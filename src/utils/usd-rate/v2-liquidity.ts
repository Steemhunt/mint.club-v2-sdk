import { Address, Hex, concat, encodePacked, getAddress, keccak256, parseAbi } from 'viem';
import { ONEINCH_ABI, SdkSupportedChainIds, TOKENS, getMintClubContractAddress, wei } from '../../exports';
import { Client } from '../../helpers/ClientHelper';

const ABI = parseAbi([
  'function FACTORY() view returns (address)',
  'function INITCODE_HASH() view returns (bytes32)',
  'function getRate(address src, address dst, address connector, uint256 threshold) view returns (uint256 rate, uint256 weight)',
  'function token0() view returns (address)',
  'function token1() view returns (address)',
  'function getReserves() view returns (uint112 reserve0, uint112 reserve1, uint32 timestamp)',
]);
const NONE = '0xffffffffffffffffffffffffffffffffffffffff';
const MAX_UINT256 = (1n << 256n) - 1n;
type V2 = { factory: Address; hash: Hex };
type Config = { oracles: readonly Address[]; connectors: readonly Address[]; v2: Map<Address, V2> };
const configCaches = new WeakMap<Client, Map<number, { timestamp: number; value: Promise<Config> }>>();

async function getConfig(chainId: number, blockNumber: bigint | undefined, historical: boolean, client: Client) {
  let cache = configCaches.get(client);
  if (!cache) configCaches.set(client, (cache = new Map()));
  const cached = historical ? undefined : cache.get(chainId);
  if (cached && Date.now() - cached.timestamp < 5 * 60 * 1000) return cached.value;
  const value = (async () => {
    const publicClient = client._getPublicClient(chainId);
    const address = getMintClubContractAddress('ONEINCH', chainId as SdkSupportedChainIds);
    const [[oracles], connectors] = await Promise.all([
      publicClient.readContract({ address, abi: ONEINCH_ABI, functionName: 'oracles', blockNumber }),
      publicClient.readContract({ address, abi: ONEINCH_ABI, functionName: 'connectors', blockNumber }),
    ]);
    const metadata = await publicClient.multicall({
      contracts: oracles.flatMap((address) => [
        { address, abi: ABI, functionName: 'FACTORY' as const },
        { address, abi: ABI, functionName: 'INITCODE_HASH' as const },
      ]),
      blockNumber,
    });
    const v2 = new Map<Address, V2>();
    oracles.forEach((oracle, i) => {
      const factory = metadata[i * 2],
        hash = metadata[i * 2 + 1];
      if (factory.status === 'success' && hash.status === 'success') {
        v2.set(oracle, { factory: factory.result, hash: hash.result });
      }
    });
    return { oracles, connectors, v2 };
  })();
  if (!historical) {
    cache.set(chainId, { timestamp: Date.now(), value });
    void value.catch(() => {
      if (cache.get(chainId)?.value === value) cache.delete(chainId);
    });
  }
  return value;
}

/** Preserve each oracle source while excluding verified V2 pools with less than $1,000 on the quote side. */
export async function getLiquidityFilteredRate(
  params: {
    chainId: number;
    srcToken: Address;
    dstToken: Address;
    blockNumber?: bigint;
    getWethUsdRate: (weth: Address, decimals: number, blockNumber?: bigint) => Promise<number | undefined>;
  },
  client: Client,
): Promise<bigint | undefined> {
  const { chainId, srcToken, dstToken, getWethUsdRate } = params;
  const publicClient = client._getPublicClient(chainId);
  const blockNumber = params.blockNumber ?? (await publicClient.getBlockNumber().catch(() => undefined));
  const config = await getConfig(chainId, blockNumber, params.blockNumber !== undefined, client);
  const routes = config.connectors
    .filter((connector) => ![srcToken.toLowerCase(), dstToken.toLowerCase()].includes(connector.toLowerCase()))
    .flatMap((connector) => config.oracles.map((oracle) => ({ oracle, connector })));
  const quotes = await publicClient.multicall({
    contracts: routes.map(({ oracle: address, connector }) => ({
      address,
      abi: ABI,
      functionName: 'getRate' as const,
      args: [srcToken, dstToken, connector, 0n] as const,
    })),
    blockNumber,
  });
  const trusted = Object.values(TOKENS[chainId as SdkSupportedChainIds] ?? {})
    .filter(({ symbol }) => symbol === 'USDC' || symbol === 'WETH')
    .sort((a, b) => Number(b.symbol === 'USDC') - Number(a.symbol === 'USDC'));
  const pools = new Map<Address, { token0: Address; token1: Address; quote: (typeof trusted)[number] }>();

  function collectPair(v2: V2, a: Address, b: Address): Address[] {
    const quote = trusted.find(({ address }) => [a.toLowerCase(), b.toLowerCase()].includes(address.toLowerCase()));
    if (!quote) return [];
    const [token0, token1] = BigInt(a) < BigInt(b) ? [a, b] : [b, a];
    const salt = keccak256(encodePacked(['address', 'address'], [token0, token1]));
    const pair = getAddress(`0x${keccak256(concat(['0xff', v2.factory, salt, v2.hash])).slice(-40)}`);
    pools.set(pair, { token0, token1, quote });
    return [pair];
  }

  const observations = quotes.flatMap((quote, i) => {
    if (quote.status !== 'success') return [];
    const [rate, weight] = quote.result;
    if (rate === 0n || weight === 0n) return [];
    const { oracle, connector } = routes[i];
    const v2 = config.v2.get(oracle);
    const legs =
      connector.toLowerCase() === NONE
        ? [[srcToken, dstToken]]
        : [
            [srcToken, connector],
            [connector, dstToken],
          ];
    return [{ rate, weight, pairs: v2 ? legs.flatMap(([a, b]) => collectPair(v2, a, b)) : [] }];
  });
  const pairs = [...pools];
  const details = pairs.length
    ? await publicClient
        .multicall({
          contracts: pairs.flatMap(([address]) => [
            { address, abi: ABI, functionName: 'token0' as const },
            { address, abi: ABI, functionName: 'token1' as const },
            { address, abi: ABI, functionName: 'getReserves' as const },
          ]),
          blockNumber,
        })
        .catch(() => [])
    : [];
  const wethRates = new Map<Address, Promise<number | undefined>>();
  const lowPools = new Set(
    await Promise.all(
      pairs
        .map(async ([address, { token0, token1, quote }], i) => {
          const [actual0, actual1, reserves] = details.slice(i * 3, i * 3 + 3);
          if (
            actual0?.status !== 'success' ||
            typeof actual0.result !== 'string' ||
            actual1?.status !== 'success' ||
            typeof actual1.result !== 'string' ||
            reserves?.status !== 'success' ||
            typeof reserves.result === 'string' ||
            actual0.result.toLowerCase() !== token0.toLowerCase() ||
            actual1.result.toLowerCase() !== token1.toLowerCase()
          )
            return undefined;
          let usdRate = 1;
          if (quote.symbol === 'WETH') {
            let rate = wethRates.get(quote.address);
            if (!rate)
              wethRates.set(quote.address, (rate = getWethUsdRate(quote.address, quote.decimals, blockNumber)));
            const value = await rate;
            if (value === undefined || !Number.isFinite(value) || value <= 0) return undefined;
            usdRate = value;
          }
          const usdWei = wei(usdRate, 18);
          if (usdWei <= 0n) return undefined;
          const reserve = reserves.result[quote.address.toLowerCase() === token0.toLowerCase() ? 0 : 1];
          return reserve * usdWei < 1000n * 10n ** BigInt(quote.decimals) * 10n ** 18n ? address : undefined;
        })
        .map((check) => check.catch(() => undefined)),
    ),
  );

  const accepted = observations.filter(({ pairs }) => !pairs.some((pair) => lowPools.has(pair)));
  let weightedRate = 0n,
    totalWeight = 0n;
  for (const quote of accepted) {
    const product = quote.rate * quote.weight;
    // Match the deployed oracle's safe arithmetic instead of introducing overflowing observations.
    if (product > MAX_UINT256 || weightedRate + product > MAX_UINT256) continue;
    weightedRate += product;
    totalWeight += quote.weight;
    if (totalWeight > MAX_UINT256) return undefined;
  }
  return totalWeight > 0n
    ? weightedRate / totalWeight
    : observations.length > 0 && accepted.length === 0
      ? 0n
      : undefined;
}
