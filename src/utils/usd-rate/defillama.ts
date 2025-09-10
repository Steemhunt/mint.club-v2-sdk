import {
  apeChain,
  arbitrum,
  avalanche,
  base,
  blast,
  bsc,
  cyber,
  degen,
  ham,
  hashkey,
  kaia,
  mainnet,
  optimism,
  polygon,
  sepolia,
  shibarium,
  unichain,
  zora,
} from 'viem/chains';
import { FALLBACK_USD_MAP } from '../../constants/usd/fallbackUsdMap';
import { SdkSupportedChainIds, chainIdToViemChain } from '../../exports';
import { baseFetcher } from '../api';

export function getDefillamaChainName(chainId: number) {
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

async function defillamaGet<T>(url: string): Promise<T> {
  return baseFetcher.get(url, { prefixUrl: 'https://coins.llama.fi' }) as Promise<T>;
}

export async function defillamaUsdRate(params: {
  chainId: number;
  tokenAddress: `0x${string}`;
  timestamp?: number;
}): Promise<number | undefined> {
  let { chainId, tokenAddress } = params;
  const timestamp = params.timestamp ?? Math.floor(Date.now() / 1000);

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

  const chainName = getDefillamaChainName(chainId);
  if (!chainName) return undefined;

  type DefillamaResponse = { coins: { [key: string]: { price: number } } };

  try {
    const json = await defillamaGet<DefillamaResponse>(`prices/historical/${timestamp}/${chainName}:${tokenAddress}`);
    const price = json?.coins?.[`${chainName}:${tokenAddress}`]?.price;
    if (price === undefined) return undefined;
    return price;
  } catch {
    return undefined;
  }
}

export async function defillama24HoursPercentage(params: {
  chainId: number;
  tokenAddress: `0x${string}`;
}): Promise<number | undefined> {
  let { chainId, tokenAddress } = params;

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

  const chainName = getDefillamaChainName(chainId);
  if (!chainName) return undefined;

  type Defillama24HourPercentageResponse = { coins: { [key: string]: number } };

  try {
    const json = await defillamaGet<Defillama24HourPercentageResponse>(`percentage/${chainName}:${tokenAddress}`);
    const percentage = json?.coins?.[`${chainName}:${tokenAddress}`];
    return typeof percentage === 'number' ? percentage : undefined;
  } catch {
    return undefined;
  }
}
