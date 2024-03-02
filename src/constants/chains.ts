import { isAddress } from 'viem';
import { arbitrum, avalanche, base, bsc, mainnet, optimism, polygon, sepolia } from 'viem/chains';
import { CONTRACT_ADDRESSES, SdkSupportedChainIds } from './contracts';
import { ChainNotSupportedError } from '../errors/sdk.errors';

export type ChainType = {
  readonly id: SdkSupportedChainIds;
  readonly name: 'Ethereum' | 'Base' | 'Optimism' | 'Arbitrum' | 'Avalanche' | 'Polygon' | 'BNBChain' | 'Sepolia';
  readonly icon: string;
  readonly color: string;
  readonly openseaSlug: string;
  readonly isTestnet?: boolean;
  readonly enabled?: boolean;
};

export const CHAINS: Array<ChainType> = [
  {
    id: mainnet.id,
    name: 'Ethereum',
    icon: 'https://mint.club/assets/networks/ethereum@2x.png',
    color: '#627EEA',
    openseaSlug: 'ethereum',
    enabled: isAddress(CONTRACT_ADDRESSES.BOND[mainnet.id]),
  },
  {
    id: base.id,
    name: 'Base',
    icon: 'https://mint.club/assets/networks/base@2x.png',
    color: '#0052FF',
    openseaSlug: 'base',
    enabled: isAddress(CONTRACT_ADDRESSES.BOND[base.id]),
  },
  {
    id: optimism.id,
    name: 'Optimism',
    icon: 'https://mint.club/assets/networks/optimism@2x.png',
    color: '#FF0420',
    openseaSlug: 'optimism',
    enabled: isAddress(CONTRACT_ADDRESSES.BOND[optimism.id]),
  },
  {
    id: arbitrum.id,
    name: 'Arbitrum',
    icon: 'https://mint.club/assets/networks/arbitrum@2x.png',
    color: '#12AAFF',
    openseaSlug: 'arbitrum',
    enabled: isAddress(CONTRACT_ADDRESSES.BOND[arbitrum.id]),
  },
  {
    id: avalanche.id,
    name: 'Avalanche',
    icon: 'https://mint.club/assets/networks/avalanche@2x.png',
    color: '#E94143',
    openseaSlug: 'avalanche',
    enabled: isAddress(CONTRACT_ADDRESSES.BOND[avalanche.id]),
  },
  {
    id: polygon.id,
    name: 'Polygon',
    icon: 'https://mint.club/assets/networks/polygon@2x.png',
    color: '#8247E5',
    openseaSlug: 'matic',
    enabled: isAddress(CONTRACT_ADDRESSES.BOND[polygon.id]),
  },
  {
    id: bsc.id,
    name: 'BNBChain',
    icon: 'https://mint.club/assets/networks/bnb@2x.png',
    color: '#F0B90B',
    openseaSlug: 'bsc',
    enabled: isAddress(CONTRACT_ADDRESSES.BOND[bsc.id]),
  },
  {
    id: sepolia.id,
    name: 'Sepolia',
    icon: 'https://mint.club/assets/networks/ethereum@2x.png',
    color: '#627EEA',
    openseaSlug: 'sepolia',
    enabled: isAddress(CONTRACT_ADDRESSES.BOND[sepolia.id]),
    isTestnet: true,
  },
];

export type LowerCaseChainNames = (typeof CHAINS)[number]['name'] extends infer X
  ? X extends string
    ? Lowercase<X>
    : never
  : never;

export function chainIdToString(chainId: number) {
  const found = CHAINS.find((chain) => chain.id === chainId);
  if (!found) throw new ChainNotSupportedError(chainId);
  return found?.name?.toLowerCase() as LowerCaseChainNames;
}

export function chainStringToId(name: LowerCaseChainNames) {
  const found = CHAINS.find((chain) => chain.name?.toLowerCase() === name.toLowerCase());

  if (!found) throw new ChainNotSupportedError(name);

  return found.id;
}

type ChainMapType = Record<SdkSupportedChainIds, ChainType>;

export const CHAIN_MAP = CHAINS.reduce((prev, curr) => {
  prev[curr.id] = curr;
  return prev;
}, {} as ChainMapType);

export const CHAIN_NAME_ID_MAP: Record<string, SdkSupportedChainIds> = {
  sepolia: sepolia.id,
} as const;
