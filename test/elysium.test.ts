import { afterEach, describe, expect, mock, spyOn, test } from 'bun:test';
import { hyperEvm } from 'viem/chains';
import {
  CHAIN_MAP,
  RPCS,
  elysium,
  getMintClubContractAddress,
  mintclub,
  supportedChains,
  supportedChainsMap,
  whitelistedTokens,
} from '../src';
import { FALLBACK_USD_MAP } from '../src/constants/usd/fallbackUsdMap';
import { bondContract, erc20Contract } from '../src/contracts';
import { ERC20 } from '../src/helpers/ERC20Helper';
import { Utils } from '../src/helpers/UtilsHelper';
import { baseFetcher } from '../src/utils/api';
import { getDefillamaChainName } from '../src/utils/usd-rate/defillama';

const WHYPE = '0xbA876237B0F021A6c6D852d6c26E107997cC5E81';
const HYPEREVM_WHYPE = '0x5555555555555555555555555555555555555555';
const MINT_CLUB_TOKEN = '0x1111111111111111111111111111111111111111';

afterEach(() => mock.restore());

describe('Elysium support', () => {
  test('registers chain metadata and RPCs', () => {
    expect(elysium.id).toBe(99901);
    expect(elysium.nativeCurrency.symbol).toBe('HYPE');
    expect(CHAIN_MAP[elysium.id].chain).toEqual(elysium);
    expect(supportedChains).toContain('elysium');
    expect(supportedChainsMap.elysium).toBe(elysium.id);
    expect(RPCS.find(({ id }) => id === elysium.id)?.rpcs).toEqual([
      'https://rpc.elysium.kinetiq.xyz',
      'https://rpc-elysium-mainnet.t.conduit.xyz',
    ]);
  });

  test('registers deployed contracts', () => {
    expect(getMintClubContractAddress('ERC20', elysium.id)).toBe('0xAa70bC79fD1cB4a6FBA717018351F0C3c64B79Df');
    expect(getMintClubContractAddress('ERC1155', elysium.id)).toBe('0x6c61918eECcC306D35247338FDcf025af0f6120A');
    expect(getMintClubContractAddress('BOND', elysium.id)).toBe('0xc5a076cad94176c2996B32d8466Be1cE757FAa27');
    expect(getMintClubContractAddress('ZAP', elysium.id)).toBe('0x91523b39813F3F4E406ECe406D0bEAaA9dE251fa');
    expect(getMintClubContractAddress('LOCKER', elysium.id)).toBe('0xA3dCf3Ca587D9929d540868c924f208726DC9aB6');
    expect(getMintClubContractAddress('MERKLE', elysium.id)).toBe('0x3bc6B601196752497a68B2625DB4f2205C3b150b');
    expect(getMintClubContractAddress('STAKE', elysium.id)).toBe('0xF44939c1613143ad587c79602182De7DcF593e33');
    expect(getMintClubContractAddress('ONEINCH', elysium.id)).toBe('0x');
  });

  test('creates a network client and exposes the canonical reserve tokens', () => {
    expect(mintclub.network('elysium').getPublicClient().chain?.id).toBe(elysium.id);
    expect(mintclub.network(99901).getPublicClient().chain?.id).toBe(elysium.id);
    const tokens = whitelistedTokens[elysium.id];
    expect(Object.values(tokens).map(({ symbol }) => symbol)).toEqual([
      'WHYPE',
      'USDC',
      'KNTQ',
      'kHYPE',
      'USDT0',
      'UBTC',
      'UETH',
    ]);
    expect(tokens[WHYPE]?.decimals).toBe(18);
  });

  test('maps every canonical token to its HyperEVM original for DefiLlama pricing', () => {
    expect(getDefillamaChainName(hyperEvm.id)).toBe('hyperliquid');
    const remaps = FALLBACK_USD_MAP[elysium.id];
    expect(Object.keys(remaps).sort()).toEqual(Object.keys(whitelistedTokens[elysium.id]).sort());
    for (const { network } of Object.values(remaps)) expect(network).toBe(hyperEvm.id);
    expect(remaps[WHYPE]).toEqual({ network: hyperEvm.id, address: HYPEREVM_WHYPE });
  });

  test('prices a reserve token through hyperliquid:<origin> without reading HyperEVM', async () => {
    const token = new ERC20({ chainId: elysium.id, symbolOrAddress: WHYPE });
    spyOn(token, 'exists').mockResolvedValue(false);
    const network = spyOn(erc20Contract, 'network').mockReturnValue({ read: async () => 18 } as any);
    const get = spyOn(baseFetcher, 'get').mockResolvedValue({
      coins: { [`hyperliquid:${HYPEREVM_WHYPE}`]: { price: 40 } },
    });

    const result = await token.getUsdRate({ amount: 2 });

    expect(result.usdRate).toBe(80);
    expect(result.path).toEqual([{ address: WHYPE, method: 'defillama', note: 'defillama api', rate: 40 }]);
    expect(get.mock.calls).toHaveLength(1);
    expect(get.mock.calls[0][0]).toMatch(new RegExp(`^prices/historical/\\d+/hyperliquid:${HYPEREVM_WHYPE}$`));
    expect(get.mock.calls[0][1]).toEqual({ prefixUrl: 'https://coins.llama.fi' });
    for (const [chainId] of network.mock.calls) expect(chainId).toBe(elysium.id);
  });

  test('prices a Mint Club token from its bond price and the remapped reserve rate', async () => {
    const token = new ERC20({ chainId: elysium.id, symbolOrAddress: MINT_CLUB_TOKEN });
    spyOn(token, 'getReserveToken').mockResolvedValue({
      address: WHYPE,
      symbol: 'WHYPE',
      name: 'Wrapped HYPE',
      decimals: 18,
    });
    const read = mock(async (params: any) => {
      if (params.functionName === 'exists') return params.args[0] === MINT_CLUB_TOKEN;
      if (params.functionName === 'priceForNextMint') return 5n * 10n ** 17n; // 0.5 WHYPE per token
      throw new Error(`Unexpected read: ${params.functionName}`);
    });
    spyOn(bondContract, 'network').mockReturnValue({ read } as any);
    spyOn(baseFetcher, 'get').mockResolvedValue({ coins: { [`hyperliquid:${HYPEREVM_WHYPE}`]: { price: 40 } } });

    const result = await token.getUsdRate();

    expect(result.usdRate).toBe(20);
    expect(result.path.map(({ method }) => method)).toEqual(['bond', 'defillama']);
  });

  test('estimates historical block numbers from on-chain timestamps when DefiLlama does not index the chain', async () => {
    // Block 3_000_000 is mined at `now`; the chain ran at 10 blocks/s for the last hour and at 5 blocks/s before.
    const now = 1_800_000_000n;
    const timestampOf = (block: bigint) =>
      block >= 2_964_000n ? now - (3_000_000n - block) / 10n : now - 3_600n - (2_964_000n - block) / 5n;
    const getBlock = mock(async (params?: { blockNumber?: bigint }) => {
      const number = params?.blockNumber ?? 3_000_000n;
      return { number, timestamp: timestampOf(number) };
    });
    const utils = new Utils({ _getPublicClient: () => ({ getBlock }) } as any);
    const get = spyOn(baseFetcher, 'get').mockRejectedValue(new Error('unsupported chain'));

    const target = Number(now) - 86_400;
    const block = await utils.getBlockNumber({ chainId: elysium.id, timestamp: target });

    expect(get.mock.calls[0][0]).toBe(`block/elysium/${target}`);
    expect(getBlock.mock.calls[1][0]).toEqual({ blockNumber: 2_990_000n }); // recent block-rate sample
    expect(Math.abs(Number(timestampOf(block!)) - target)).toBeLessThanOrEqual(60);
    expect(getBlock.mock.calls.length).toBeLessThanOrEqual(8);
  });
});
