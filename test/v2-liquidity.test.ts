import { expect, test } from 'bun:test';
import { Address, Hex, PublicClient, encodePacked, getContractAddress, keccak256 } from 'viem';
import { arbitrum } from 'viem/chains';
import { Client } from '../src/helpers/ClientHelper';
import { getLiquidityFilteredRate } from '../src/utils/usd-rate/v2-liquidity';

const USDC = '0xaf88d065e77c8cC2239327C5EDb3A432268e5831';
const WETH = '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1';
const DOCTRAP = '0xF8342Ac909340aa3E52d895De984Db9A0FDd7E2b';
const TOKEN = '0x1111111111111111111111111111111111111111';
const NONE = '0xFFfFfFffFFfffFFfFFfFFFFFffFFFffffFfFFFfF';
const INIT_CODE_HASH = `0x${'ab'.repeat(32)}` as Hex;
const LIVE_BLOCK = 123456n;
const same = (a: string, b: string) => a.toLowerCase() === b.toLowerCase();

type Pool = { tokens: [Address, Address]; reserves: [bigint, bigint]; fail?: boolean };
type Quote = { connector?: Address; rate: bigint; weight: bigint };
type Source = { v2?: boolean; pools?: Pool[]; quotes: Quote[] };
type Read = { address: Address; functionName: string; args?: unknown[]; blockNumber?: bigint };

function fixture(sources: Source[], connectors: Address[] = [NONE]) {
  const reads: Read[] = [];
  const multicalls: Read[][] = [];
  const oracles = sources.map((_, index) => `0x${(0x1000 + index).toString(16).padStart(40, '0')}` as Address);
  const factories = sources.map((_, index) => `0x${(0x2000 + index).toString(16).padStart(40, '0')}` as Address);
  const pools = new Map<string, Pool>();
  sources.forEach((source, index) => {
    for (const pool of source.pools ?? []) {
      const sorted = pool.tokens[0].toLowerCase() < pool.tokens[1].toLowerCase();
      const tokens: [Address, Address] = sorted ? pool.tokens : [pool.tokens[1], pool.tokens[0]];
      const reserves: [bigint, bigint] = sorted ? pool.reserves : [pool.reserves[1], pool.reserves[0]];
      const address = getContractAddress({
        opcode: 'CREATE2',
        from: factories[index],
        salt: keccak256(encodePacked(['address', 'address'], tokens)),
        bytecodeHash: INIT_CODE_HASH,
      });
      pools.set(address.toLowerCase(), { ...pool, tokens, reserves });
    }
  });
  const readContract = async (params: Read): Promise<unknown> => {
    reads.push(params);
    if (params.functionName === 'oracles') return [oracles, sources.map(() => 0)];
    if (params.functionName === 'connectors') return connectors;
    const index = oracles.findIndex((address) => same(address, params.address));
    if (index !== -1) {
      const source = sources[index];
      if (params.functionName === 'FACTORY' && source.v2) return factories[index];
      if (params.functionName === 'INITCODE_HASH' && source.v2) return INIT_CODE_HASH;
      if (params.functionName === 'getRate') {
        const connector = params.args?.[2] as Address;
        const quote = source.quotes.find((quote) => same(quote.connector ?? NONE, connector));
        return quote ? [quote.rate, quote.weight] : [0n, 0n];
      }
      throw new Error('Unsupported oracle method');
    }
    const pool = pools.get(params.address.toLowerCase());
    if (!pool || pool.fail) throw new Error('Pool read unavailable');
    if (params.functionName === 'token0') return pool.tokens[0];
    if (params.functionName === 'token1') return pool.tokens[1];
    if (params.functionName === 'getReserves') return [...pool.reserves, 1000];
    throw new Error('Unexpected pool method');
  };
  const client = new Client();
  client.withPublicClient({
    chain: arbitrum,
    getBlockNumber: async () => LIVE_BLOCK,
    readContract,
    multicall: async ({ contracts, blockNumber }: { contracts: Read[]; blockNumber?: bigint }) => {
      multicalls.push(contracts);
      return Promise.all(
        contracts.map(async (contract) => {
          try {
            return { status: 'success', result: await readContract({ ...contract, blockNumber }) };
          } catch (error) {
            return { status: 'failure', error };
          }
        }),
      );
    },
  } as unknown as PublicClient);
  return { client, reads, multicalls };
}

function query(client: Client, overrides: Partial<Parameters<typeof getLiquidityFilteredRate>[0]> = {}) {
  return getLiquidityFilteredRate(
    { chainId: arbitrum.id, srcToken: USDC, dstToken: TOKEN, getWethUsdRate: async () => 2000, ...overrides },
    client,
  );
}

test('the actual DOCTRAP dust pool is rejected rather than returned as a usable price', async () => {
  const { client } = fixture([
    {
      v2: true,
      pools: [{ tokens: [USDC, DOCTRAP], reserves: [1n, 3782493909300n] }],
      quotes: [{ rate: 3782493909300000000000000000000n, weight: 1944863n }],
    },
  ]);
  expect(await query(client, { dstToken: DOCTRAP })).toBe(0n);
});

test.each([999999999n, 1000000000n])('USDC requires the full $1,000 quote-side reserve: %s', async (reserve) => {
  const { client } = fixture([
    {
      v2: true,
      pools: [{ tokens: [TOKEN, USDC], reserves: [10n ** 24n, reserve] }],
      quotes: [{ rate: 7n, weight: 2n }],
    },
  ]);
  expect(await query(client)).toBe(reserve < 1000000000n ? 0n : 7n);
});

test('a reversed token ordering reads the USDC reserve rather than the token reserve', async () => {
  const { client } = fixture([
    {
      v2: true,
      pools: [{ tokens: [USDC, DOCTRAP], reserves: [1000000000n, 1n] }],
      quotes: [{ rate: 11n, weight: 2n }],
    },
  ]);
  expect(await query(client, { dstToken: DOCTRAP })).toBe(11n);
});

test.each([499999999999999999n, 500000000000000000n])(
  'WETH uses its USD value without rounding up: %s',
  async (reserve) => {
    const { client } = fixture([
      {
        v2: true,
        pools: [{ tokens: [TOKEN, WETH], reserves: [10n ** 24n, reserve] }],
        quotes: [{ rate: 13n, weight: 2n }],
      },
    ]);
    expect(await query(client, { srcToken: TOKEN, dstToken: WETH })).toBe(reserve < 500000000000000000n ? 0n : 13n);
  },
);

test('a rejected V2 quote cannot distort the weighted average of healthy V2 and other sources', async () => {
  const { client, multicalls } = fixture([
    {
      v2: true,
      pools: [{ tokens: [TOKEN, USDC], reserves: [10n ** 24n, 1n] }],
      quotes: [{ rate: 1000000n, weight: 100n }],
    },
    {
      v2: true,
      pools: [{ tokens: [TOKEN, USDC], reserves: [10n ** 24n, 1000000000n] }],
      quotes: [{ rate: 10n, weight: 3n }],
    },
    { quotes: [{ rate: 30n, weight: 1n }] },
  ]);
  expect(await query(client)).toBe(15n);
  expect(
    multicalls.filter((contracts) => contracts.some(({ functionName }) => functionName === 'getReserves')),
  ).toHaveLength(1);
});

test('a thin token/WETH pool cannot re-enter a USD quote through the WETH connector', async () => {
  const { client } = fixture(
    [
      {
        v2: true,
        pools: [
          { tokens: [TOKEN, WETH], reserves: [10n ** 24n, 10n ** 15n] },
          { tokens: [USDC, WETH], reserves: [1000000n * 10n ** 6n, 500n * 10n ** 18n] },
        ],
        quotes: [{ connector: WETH, rate: 1000000n, weight: 100n }],
      },
    ],
    [NONE, WETH],
  );
  expect(await query(client)).toBe(0n);
});

test('no positive quote is unavailable, not a confirmed liquidity rejection', async () => {
  const { client } = fixture([{ quotes: [] }]);
  expect(await query(client)).toBeUndefined();
});

test('a failed pool read does not falsely classify a source as low liquidity', async () => {
  const { client } = fixture([
    {
      v2: true,
      pools: [{ tokens: [TOKEN, USDC], reserves: [1n, 1n], fail: true }],
      quotes: [{ rate: 17n, weight: 2n }],
    },
  ]);
  expect(await query(client)).toBe(17n);
});

test('an unavailable ETH/USD conversion does not falsely reject a WETH pool', async () => {
  const { client } = fixture([
    { v2: true, pools: [{ tokens: [TOKEN, WETH], reserves: [1n, 1n] }], quotes: [{ rate: 19n, weight: 2n }] },
  ]);
  expect(await query(client, { srcToken: TOKEN, dstToken: WETH, getWethUsdRate: async () => undefined })).toBe(19n);
});

test('live source prices and reserve reads share a pinned block', async () => {
  const { client, reads } = fixture([
    { v2: true, pools: [{ tokens: [TOKEN, USDC], reserves: [1n, 1000000000n] }], quotes: [{ rate: 23n, weight: 2n }] },
  ]);
  expect(await query(client)).toBe(23n);
  expect(reads.length).toBeGreaterThan(0);
  expect(reads.every((read) => read.blockNumber === LIVE_BLOCK)).toBe(true);
});

test('historical reads use the requested block rather than live cached metadata', async () => {
  const { client, reads } = fixture([
    { v2: true, pools: [{ tokens: [TOKEN, USDC], reserves: [1n, 1000000000n] }], quotes: [{ rate: 23n, weight: 2n }] },
  ]);
  await query(client);
  reads.length = 0;
  expect(await query(client, { blockNumber: 777n })).toBe(23n);
  expect(reads.some((read) => read.functionName === 'oracles')).toBe(true);
  expect(reads.every((read) => read.blockNumber === 777n)).toBe(true);
});

test('WETH conversion receives the same historical block as the reserves', async () => {
  const { client } = fixture([
    {
      v2: true,
      pools: [{ tokens: [TOKEN, WETH], reserves: [1n, 500000000000000000n] }],
      quotes: [{ rate: 23n, weight: 2n }],
    },
  ]);
  const conversions: unknown[][] = [];
  expect(
    await query(client, {
      srcToken: TOKEN,
      dstToken: WETH,
      blockNumber: 777n,
      getWethUsdRate: async (...args) => {
        conversions.push(args);
        return 2000;
      },
    }),
  ).toBe(23n);
  expect(conversions).toEqual([[WETH, 18, 777n]]);
});

test('independent clients do not share cached oracle registries or reserve results', async () => {
  const first = fixture([
    { v2: true, pools: [{ tokens: [TOKEN, USDC], reserves: [1n, 1n] }], quotes: [{ rate: 29n, weight: 2n }] },
  ]);
  const second = fixture([
    { v2: true, pools: [{ tokens: [TOKEN, USDC], reserves: [1n, 1000000000n] }], quotes: [{ rate: 31n, weight: 2n }] },
  ]);
  expect(await query(first.client)).toBe(0n);
  expect(await query(second.client)).toBe(31n);
  expect(second.reads.some((read) => read.functionName === 'oracles')).toBe(true);
});
