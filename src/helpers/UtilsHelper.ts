import MerkleTree from 'merkletreejs';
import { getAddress, isAddress, keccak256 } from 'viem';
import { baseFetcher } from '../utils/api';
import { getTwentyFourHoursAgoTimestamp } from '../utils';
import { chainIdToViemChain, SdkSupportedChainIds, getMintClubContractAddress, toNumber, over } from '../exports';
import { retry } from '../utils/retry';
import { oneInchContract } from '../contracts';
import { FALLBACK_USD_MAP } from '../constants/usd/fallbackUsdMap';
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
    [unichain.id]: { address: '0x078d782b760474a361dda0af3839290b0ef57ad6', symbol: 'USDT', decimals: 6n },
    [hashkey.id]: { address: '0x', symbol: '', decimals: 0n },
    [zora.id]: { address: '0x', symbol: '', decimals: 0n },
    [over.id]: { address: '0x', symbol: '', decimals: 0n },
  };
  public generateMerkleRoot(wallets: `0x${string}`[]) {
    const leaves = wallets.map((address) => keccak256(address));
    const tree = new MerkleTree(leaves, keccak256, {
      sortPairs: true,
    });
    const merkleRoot = `0x${tree.getRoot().toString('hex')}` as const;
    return merkleRoot;
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

    if (rate === undefined || rate === null) return undefined;

    const rateToNumber = toNumber(rate, Number(18n + stable.decimals) - tokenDecimals);
    return { rate: rateToNumber, stableCoin: stable } as const;
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
    if (chainFallbacks) {
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
    if (chainFallbacks) {
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

  // NOTE: only for kaia network
  public async getSwapscannerPrice(tokenAddress: `0x${string}`): Promise<number | undefined> {
    try {
      const data = (await baseFetcher.get('https://api.swapscanner.io/v1/tokens/prices')) as Record<
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
