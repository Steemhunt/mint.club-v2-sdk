import MerkleTree from 'merkletreejs';
import { getAddress, isAddress, keccak256 } from 'viem';
import { baseFetcher } from '../utils/api';
import { getTwentyFourHoursAgoTimestamp } from '../utils';
import { chainIdToViemChain, SdkSupportedChainIds, getMintClubContractAddress, toNumber, over } from '../exports';
import { retry } from '../utils/retry';
import { oneInchContract } from '../contracts';
import { FALLBACK_USD_MAP } from '../constants/usd/fallbackUsdMap';
import { Client } from './ClientHelper';
import {
  apeChain,
  arbitrum,
  avalanche,
  avalancheFuji,
  base,
  baseSepolia,
  blast,
  blastSepolia,
  bsc,
  cyber,
  cyberTestnet,
  degen,
  ham,
  hashkey,
  kaia,
  mainnet,
  optimism,
  polygon,
  sepolia,
  shibarium,
  shibariumTestnet,
  unichain,
  zora,
} from 'viem/chains';

export class Utils {
  // ETH cache for efficient pricing (TOKEN -> ETH -> USD)
  private static ethRateCache = new Map<string, { rate: number; timestamp: number }>();
  private static ETH_CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  // WETH addresses for TOKEN -> ETH pricing path
  private static WETH_ADDRESSES: Record<SdkSupportedChainIds, `0x${string}`> = {
    [mainnet.id]: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
    [optimism.id]: '0x4200000000000000000000000000000000000006',
    [arbitrum.id]: '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1',
    [avalanche.id]: '0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7', // WAVAX
    [polygon.id]: '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270', // WMATIC
    [bsc.id]: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c', // WBNB
    [base.id]: '0x4200000000000000000000000000000000000006',
    [sepolia.id]: '0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14',
    [baseSepolia.id]: '0x4200000000000000000000000000000000000006',
    [blast.id]: '0x4300000000000000000000000000000000000004',
    [blastSepolia.id]: '0x4300000000000000000000000000000000000004',
    [avalancheFuji.id]: '0xd00ae08403B9bbb9124bB305C09058E32C39A48c', // WAVAX
    [degen.id]: '0xEb54dACB4C2ccb64F8074eceEa33b5eBb38E5387', // DEGEN (native)
    [cyber.id]: '0x4200000000000000000000000000000000000006',
    [cyberTestnet.id]: '0x4200000000000000000000000000000000000006',
    [kaia.id]: '0x19Aac5f612f524B754CA7e7c41cbFa2E981A4432', // WKLAY
    [ham.id]: '0xe8dd44D0791B73aFE9066C3A77721F42D0844bEB', // WHAM
    [shibarium.id]: '0x0000000000000000000000000000000000001010', // BONE
    [shibariumTestnet.id]: '0x0000000000000000000000000000000000001010',
    [apeChain.id]: '0x48b62137EdfA95a428D35C09E44256a739F6B557', // WAPE
    [zora.id]: '0x4200000000000000000000000000000000000006',
    [hashkey.id]: '0xB210D2120d57b758EE163cFfb43e73728c471Cf1', // WHSK
    [unichain.id]: '0x4200000000000000000000000000000000000006',
    [over.id]: '0x4200000000000000000000000000000000000006', // Assume WETH for Over network
  };

  // 1inch stablecoin map for USD quoting
  private static STABLE_COINS: Record<
    SdkSupportedChainIds,
    { address: `0x${string}`; symbol: string; decimals: bigint }
  > = {
    [mainnet.id]: { address: '0xdac17f958d2ee523a2206206994597c13d831ec7', symbol: 'USDT', decimals: 6n },
    [optimism.id]: { address: '0x94b008aa00579c1307b0ef2c499ad98a8ce58e58', symbol: 'USDT', decimals: 6n },
    [arbitrum.id]: { address: '0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9', symbol: 'USDT', decimals: 6n },
    [avalanche.id]: { address: '0x9702230a8ea53601f5cd2dc00fdbc13d4df4a8c7', symbol: 'USDT', decimals: 6n },
    [polygon.id]: { address: '0xc2132d05d31c914a87c6611c10748aeb04b58e8f', symbol: 'USDT', decimals: 6n },
    [bsc.id]: { address: '0x55d398326f99059ff775485246999027b3197955', symbol: 'USDT', decimals: 18n },
    [base.id]: { address: '0xd9aaec86b65d86f6a7b5b1b0c42ffa531710b6ca', symbol: 'USDBC', decimals: 6n },
    [baseSepolia.id]: { address: '0x', symbol: '', decimals: 0n },
    [sepolia.id]: { address: '0x', symbol: '', decimals: 0n },
    [blast.id]: { address: '0x', symbol: '', decimals: 0n },
    [blastSepolia.id]: { address: '0x', symbol: '', decimals: 0n },
    [avalancheFuji.id]: { address: '0x', symbol: '', decimals: 0n },
    [degen.id]: { address: '0x', symbol: '', decimals: 0n },
    [cyber.id]: { address: '0x', symbol: '', decimals: 0n },
    [cyberTestnet.id]: { address: '0x', symbol: '', decimals: 0n },
    [kaia.id]: { address: '0x', symbol: '', decimals: 0n },
    [ham.id]: { address: '0x', symbol: '', decimals: 0n },
    [shibarium.id]: { address: '0x', symbol: '', decimals: 0n },
    [shibariumTestnet.id]: { address: '0x', symbol: '', decimals: 0n },
    [apeChain.id]: { address: '0x', symbol: '', decimals: 0n },
    [zora.id]: { address: '0x', symbol: '', decimals: 0n },
    [hashkey.id]: {
      address: '0xf1b50ed67a9e2cc94ad3c477779e2d4cbfff9029',
      symbol: 'USDT',
      decimals: 6n,
    },
    [unichain.id]: {
      address: '0x078D782b760474a361dDA0AF3839290b0EF57AD6',
      symbol: 'USDT',
      decimals: 6n,
    },
    [over.id]: {
      address: '0xA510432E4aa60B4acd476fb850EC84B7EE226b2d',
      symbol: 'USDT',
      decimals: 18n,
    }, // USDT
  };
  public generateMerkleRoot(wallets: `0x${string}`[]) {
    const leaves = wallets.map((address) => keccak256(address));
    const tree = new MerkleTree(leaves, keccak256, {
      sortPairs: true,
    });
    const merkleRoot = `0x${tree.getRoot().toString('hex')}` as const;
    return merkleRoot;
  }

  public async oneinchEthRate(params: {
    chainId: number;
    tokenAddress: `0x${string}`;
    tokenDecimals: number;
    blockNumber?: bigint | number | 'now';
    tryCount?: number;
  }): Promise<{ rate: number; nativeToken: { address: `0x${string}`; symbol: string; decimals: number } } | undefined> {
    const { chainId, tokenAddress, tokenDecimals, blockNumber, tryCount } = params;
    const wethAddress = Utils.WETH_ADDRESSES[chainId as SdkSupportedChainIds];

    if (!isAddress(wethAddress) || wethAddress === '0x') {
      return undefined;
    }

    if (typeof tryCount === 'number' && tryCount > 5) return undefined;

    const isSameToken = isAddress(tokenAddress) && getAddress(tokenAddress) === getAddress(wethAddress);
    if (isSameToken) {
      const nativeSymbol = chainIdToViemChain(chainId as SdkSupportedChainIds)?.nativeCurrency?.symbol || 'ETH';
      return {
        rate: 1,
        nativeToken: { address: wethAddress, symbol: nativeSymbol, decimals: 18 },
      } as const;
    }

    const oneInchAddress = getMintClubContractAddress('ONEINCH', chainId as SdkSupportedChainIds);
    const validParams =
      tokenAddress &&
      tokenAddress !== '0x' &&
      oneInchAddress !== '0x' &&
      isAddress(tokenAddress) &&
      isAddress(wethAddress) &&
      isAddress(oneInchAddress);

    if (!validParams) return undefined;

    let bn: bigint | undefined = undefined;
    if (typeof blockNumber === 'number') {
      bn = BigInt(blockNumber);
    } else if (typeof blockNumber === 'bigint') {
      bn = blockNumber;
    } else if (blockNumber === 'now') {
      bn = undefined;
    }

    const rate = await retry(
      () =>
        oneInchContract.network(chainId as SdkSupportedChainIds).read({
          functionName: 'getRate',
          args: [tokenAddress, wethAddress, false],
          ...(bn !== undefined ? { blockNumber: bn } : {}),
        }),
      { retries: 5, retryIntervalMs: 1000 },
    ).catch(() => {
      return undefined as unknown as bigint;
    });

    if (rate === undefined || rate === null) return undefined;

    const rateToNumber = toNumber(rate, Number(18n + 18n) - tokenDecimals); // WETH is always 18 decimals
    const nativeSymbol = chainIdToViemChain(chainId as SdkSupportedChainIds)?.nativeCurrency?.symbol || 'ETH';

    return {
      rate: rateToNumber,
      nativeToken: { address: wethAddress, symbol: nativeSymbol, decimals: 18 },
    } as const;
  }

  private getCachedEthUsdRate(chainId: number): number | undefined {
    const cacheKey = `eth-usd-${chainId}`;
    const cached = Utils.ethRateCache.get(cacheKey);

    if (cached && Date.now() - cached.timestamp < Utils.ETH_CACHE_DURATION) {
      return cached.rate;
    }

    return undefined;
  }

  private setCachedEthUsdRate(chainId: number, rate: number): void {
    const cacheKey = `eth-usd-${chainId}`;
    Utils.ethRateCache.set(cacheKey, {
      rate,
      timestamp: Date.now(),
    });
  }

  public async oneinchUsdRate(params: {
    chainId: number;
    tokenAddress: `0x${string}`;
    tokenDecimals: number;
    blockNumber?: bigint | number | 'now';
    tryCount?: number;
  }): Promise<{ rate: number; stableCoin: { address: `0x${string}`; symbol: string; decimals: bigint } } | undefined> {
    const { chainId, tokenAddress, tokenDecimals, blockNumber, tryCount } = params;
    const stable = Utils.STABLE_COINS[chainId as SdkSupportedChainIds];

    if (!isAddress(stable.address) || stable.address === '0x') {
      return undefined;
    }

    if (typeof tryCount === 'number' && tryCount > 5) return undefined;

    const isSameToken = isAddress(tokenAddress) && getAddress(tokenAddress) === getAddress(stable.address);
    if (isSameToken) return { rate: 1, stableCoin: stable } as const;

    const oneInchAddress = getMintClubContractAddress('ONEINCH', chainId as SdkSupportedChainIds);
    const validParams =
      tokenAddress &&
      tokenAddress !== '0x' &&
      oneInchAddress !== '0x' &&
      isAddress(tokenAddress) &&
      isAddress(stable.address) &&
      isAddress(oneInchAddress);

    if (!validParams) return undefined;

    let bn: bigint | undefined = undefined;
    if (typeof blockNumber === 'number') {
      bn = BigInt(blockNumber);
    } else if (typeof blockNumber === 'bigint') {
      bn = blockNumber;
    } else if (blockNumber === 'now') {
      bn = undefined;
    }

    // Try direct TOKEN -> STABLE path first
    const rate = await retry(
      () =>
        oneInchContract.network(chainId as SdkSupportedChainIds).read({
          functionName: 'getRate',
          args: [tokenAddress, stable.address, false],
          ...(bn !== undefined ? { blockNumber: bn } : {}),
        }),
      { retries: 5, retryIntervalMs: 1000 },
    ).catch(() => {
      return undefined as unknown as bigint;
    });

    if (rate !== undefined && rate !== null) {
      const rateToNumber = toNumber(rate, Number(18n + stable.decimals) - tokenDecimals);

      // If the rate is too small (< $0.000001), try TOKEN -> ETH -> USD path
      if (rateToNumber >= 0.000001) {
        return { rate: rateToNumber, stableCoin: stable } as const;
      }
    }

    // Fallback: Try TOKEN -> ETH -> USD path for better precision with small values
    const ethRate = await this.oneinchEthRate({
      chainId,
      tokenAddress,
      tokenDecimals,
      blockNumber,
      tryCount: (tryCount ?? 0) + 1,
    });

    if (!ethRate) return undefined;

    // Get cached ETH -> USD rate or fetch fresh one
    let ethUsdRate = this.getCachedEthUsdRate(chainId);

    if (ethUsdRate === undefined || ethUsdRate === null || ethUsdRate === 0) {
      // Get ETH -> USD rate
      const wethAddress = Utils.WETH_ADDRESSES[chainId as SdkSupportedChainIds];
      const ethToUsdRate = await retry(
        () =>
          oneInchContract.network(chainId as SdkSupportedChainIds).read({
            functionName: 'getRate',
            args: [wethAddress, stable.address, false],
            ...(bn !== undefined ? { blockNumber: bn } : {}),
          }),
        { retries: 5, retryIntervalMs: 1000 },
      ).catch(() => {
        return undefined as unknown as bigint;
      });

      if (ethToUsdRate === undefined || ethToUsdRate === null) return undefined;

      ethUsdRate = toNumber(ethToUsdRate, Number(18n + stable.decimals) - 18); // WETH is 18 decimals
      this.setCachedEthUsdRate(chainId, ethUsdRate);
    }

    const finalUsdRate = ethRate.rate * ethUsdRate;
    return { rate: finalUsdRate, stableCoin: stable } as const;
  }

  private getDefillamaChainName(chainId: number) {
    // Map known differences; fall back to viem chain name
    const mapping: Partial<Record<number, string>> = {
      [mainnet.id]: 'ethereum',
      [base.id]: 'base',
      [degen.id]: 'degen',
      [ham.id]: 'ham',
      [unichain.id]: 'unichain',
      [arbitrum.id]: 'arbitrum',
      [avalanche.id]: 'avax',
      [blast.id]: 'blast',
      [bsc.id]: 'bsc',
      [cyber.id]: 'cyber',
      [optimism.id]: 'optimism',
      [kaia.id]: 'klaytn',
      [polygon.id]: 'polygon',
      [shibarium.id]: 'shibarium',
      [zora.id]: 'zora',
      [sepolia.id]: 'sepolia',
      [apeChain.id]: 'apechain',
      [hashkey.id]: 'hashkey',
    } as const;

    return mapping[chainId] ?? chainIdToViemChain(chainId as SdkSupportedChainIds)?.name?.toLowerCase();
  }

  private defillamaGet<T>(url: string): Promise<T> {
    return baseFetcher.get(url, { prefixUrl: 'https://coins.llama.fi' }) as Promise<T>;
  }

  public async defillamaUsdRate(params: {
    chainId: number;
    tokenAddress: `0x${string}`;
    timestamp?: number;
  }): Promise<number | undefined> {
    let { chainId, tokenAddress } = params;
    const timestamp = params.timestamp ?? Math.floor(Date.now() / 1000);

    // Centralized fallback remap if present
    const chainFallbacks = FALLBACK_USD_MAP[chainId];
    if (chainFallbacks !== undefined) {
      const key = (Object.keys(chainFallbacks) as Array<keyof typeof chainFallbacks>).find(
        (k) => (k as string).toLowerCase() === tokenAddress.toLowerCase(),
      );
      if (key) {
        const remap = chainFallbacks[key]!;
        chainId = remap.network;
        tokenAddress = remap.address as `0x${string}`;
      }
    }

    const chainName = this.getDefillamaChainName(chainId);
    if (!chainName) return undefined;

    type DefillamaResponse = { coins: { [key: string]: { price: number } } };

    try {
      const json = await this.defillamaGet<DefillamaResponse>(
        `prices/historical/${timestamp}/${chainName}:${tokenAddress}`,
      );
      const price = json?.coins?.[`${chainName}:${tokenAddress}`]?.price;
      if (price === undefined) return undefined;
      return price;
    } catch {
      return undefined;
    }
  }

  public async defillama24HoursPercentage(params: {
    chainId: number;
    tokenAddress: `0x${string}`;
  }): Promise<number | undefined> {
    let { chainId, tokenAddress } = params;

    // Centralized fallback remap if present
    const chainFallbacks = FALLBACK_USD_MAP[chainId];
    if (chainFallbacks !== undefined) {
      const key = (Object.keys(chainFallbacks) as Array<keyof typeof chainFallbacks>).find(
        (k) => (k as string).toLowerCase() === tokenAddress.toLowerCase(),
      );
      if (key) {
        const remap = chainFallbacks[key]!;
        chainId = remap.network;
        tokenAddress = remap.address as `0x${string}`;
      }
    }

    const chainName = this.getDefillamaChainName(chainId);
    if (!chainName) return undefined;

    type Defillama24HourPercentageResponse = { coins: { [key: string]: number } };

    try {
      const json = await this.defillamaGet<Defillama24HourPercentageResponse>(
        `percentage/${chainName}:${tokenAddress}`,
      );
      const percentage = json?.coins?.[`${chainName}:${tokenAddress}`];
      return typeof percentage === 'number' ? percentage : undefined;
    } catch {
      return undefined;
    }
  }

  public async getBlockNumber(params: {
    chainId: number;
    timestamp: number; // unix seconds
  }): Promise<bigint | undefined> {
    const { chainId } = params;
    const prevTimeStamp = params.timestamp ?? getTwentyFourHoursAgoTimestamp();

    const chainName = this.getDefillamaChainName(chainId);
    try {
      const json = await this.defillamaGet<{ height: number }>(`block/${chainName}/${prevTimeStamp}`);
      if (json?.height !== undefined) return BigInt(json.height);
    } catch {}

    return undefined;
  }

  public async getTimestampFromBlock(params: {
    chainId: number;
    blockNumber: bigint | number;
  }): Promise<number | undefined> {
    const { chainId, blockNumber } = params;
    try {
      const client = new Client();
      const pc = client._getPublicClient(chainId);
      const bn = typeof blockNumber === 'number' ? BigInt(blockNumber) : blockNumber;
      const block = await pc.getBlock({ blockNumber: bn });
      return Number(block.timestamp);
    } catch {
      return undefined;
    }
  }

  // NOTE: only for kaia network
  public async getSwapscannerPrice(tokenAddress: `0x${string}`): Promise<number | undefined> {
    try {
      const data = (await baseFetcher.get('/v1/tokens/prices', { prefixUrl: 'https://api.swapscanner.io/' })) as Record<
        `0x${string}`,
        number
      >;

      const key = Object.keys(data).find((k) => k.toLowerCase() === tokenAddress.toLowerCase());
      if (key) return data[key as keyof typeof data];
      return undefined;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error fetching Swapscanner price:', error);
      return undefined;
    }
  }
}
