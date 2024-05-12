import { isAddress } from 'viem';
import {
  avalancheFuji,
  arbitrum,
  avalanche,
  base,
  blast,
  blastSepolia,
  bsc,
  klaytn,
  mainnet,
  optimism,
  polygon,
  sepolia,
  baseSepolia,
  cyber,
  cyberTestnet,
  degen,
} from 'viem/chains';
import { ChainNotSupportedError } from '../errors/sdk.errors';
import { getMintClubContractAddress, SdkSupportedChainIds } from './contracts';
import * as chains from 'viem/chains';

export type ChainType = {
  readonly id: SdkSupportedChainIds;
  readonly name:
    | 'Ethereum'
    | 'Base'
    | 'Blast'
    | 'Cyber'
    | 'Degen'
    | 'Optimism'
    | 'Arbitrum'
    | 'Avalanche'
    | 'Polygon'
    | 'BNBChain'
    | 'Sepolia'
    | 'Klaytn'
    | 'BaseSepolia'
    | 'AvalancheFuji'
    | 'BlastSepolia'
    | 'CyberTestnet';
  readonly icon: string;
  readonly color: string;
  readonly openseaSlug?: string;
  readonly isTestnet?: boolean;
  readonly enabled?: boolean;
  readonly chain: chains.Chain;
};

export const CHAINS: Array<ChainType> = [
  {
    id: mainnet.id,
    name: 'Ethereum',
    icon: 'https://mint.club/assets/networks/ethereum@2x.png',
    color: '#627EEA',
    openseaSlug: 'ethereum',
    enabled: isAddress(getMintClubContractAddress('BOND', mainnet.id)),
    chain: mainnet,
  },
  {
    id: base.id,
    name: 'Base',
    icon: 'https://mint.club/assets/networks/base@2x.png',
    color: '#0052FF',
    openseaSlug: 'base',
    enabled: isAddress(getMintClubContractAddress('BOND', base.id)),
    chain: base,
  },
  {
    id: blast.id,
    name: 'Blast',
    icon: 'https://mint.club/assets/networks/blast@2x.png',
    color: '#FCFC03',
    openseaSlug: 'blast',
    enabled: isAddress(getMintClubContractAddress('BOND', blast.id)),
    chain: blast,
  },
  {
    id: optimism.id,
    name: 'Optimism',
    icon: 'https://mint.club/assets/networks/optimism@2x.png',
    color: '#FF0420',
    openseaSlug: 'optimism',
    enabled: isAddress(getMintClubContractAddress('BOND', optimism.id)),
    chain: optimism,
  },
  {
    id: degen.id,
    name: 'Degen',
    icon: 'https://mint.club/assets/networks/degen@2x.png',
    color: '#A36EFD',
    openseaSlug: 'degen',
    enabled: isAddress(getMintClubContractAddress('BOND', degen.id)),
    chain: degen,
  },
  {
    id: arbitrum.id,
    name: 'Arbitrum',
    icon: 'https://mint.club/assets/networks/arbitrum@2x.png',
    color: '#12AAFF',
    openseaSlug: 'arbitrum',
    enabled: isAddress(getMintClubContractAddress('BOND', arbitrum.id)),
    chain: arbitrum,
  },
  {
    id: avalanche.id,
    name: 'Avalanche',
    icon: 'https://mint.club/assets/networks/avalanche@2x.png',
    color: '#E94143',
    openseaSlug: 'avalanche',
    enabled: isAddress(getMintClubContractAddress('BOND', avalanche.id)),
    chain: avalanche,
  },
  {
    id: polygon.id,
    name: 'Polygon',
    icon: 'https://mint.club/assets/networks/polygon@2x.png',
    color: '#8247E5',
    openseaSlug: 'matic',
    enabled: isAddress(getMintClubContractAddress('BOND', polygon.id)),
    chain: polygon,
  },
  {
    id: bsc.id,
    name: 'BNBChain',
    icon: 'https://mint.club/assets/networks/bnb@2x.png',
    color: '#F0B90B',
    openseaSlug: 'bsc',
    enabled: isAddress(getMintClubContractAddress('BOND', bsc.id)),
    chain: bsc,
  },
  {
    id: sepolia.id,
    name: 'Sepolia',
    icon: 'https://mint.club/assets/networks/ethereum@2x.png',
    color: '#627EEA',
    openseaSlug: 'sepolia',
    enabled: isAddress(getMintClubContractAddress('BOND', sepolia.id)),
    isTestnet: true,
    chain: sepolia,
  },
  {
    id: baseSepolia.id,
    name: 'BaseSepolia',
    icon: 'https://mint.club/assets/networks/base@2x.png',
    color: '#0052FF',
    openseaSlug: 'base-sepolia',
    enabled: isAddress(getMintClubContractAddress('BOND', baseSepolia.id)),
    isTestnet: true,
    chain: sepolia,
  },
  {
    id: blastSepolia.id,
    name: 'BlastSepolia',
    icon: 'https://mint.club/assets/networks/blast@2x.png',
    color: '#FCFC03',
    openseaSlug: 'blast-sepolia',
    enabled: isAddress(getMintClubContractAddress('BOND', blastSepolia.id)),
    isTestnet: true,
    chain: blastSepolia,
  },

  {
    id: cyber.id,
    name: 'Cyber',
    icon: 'https://mint.club/assets/networks/cyber@2x.png',
    color: '#32A0CD',
    openseaSlug: 'cyber',
    enabled: isAddress(getMintClubContractAddress('BOND', cyber.id)),
    chain: cyber,
  },

  {
    id: avalancheFuji.id,
    name: 'AvalancheFuji',
    icon: 'https://mint.club/assets/networks/avalanche@2x.png',
    color: '#E94143',
    openseaSlug: 'avalanche-fuji',
    enabled: isAddress(getMintClubContractAddress('BOND', avalancheFuji.id)),
    isTestnet: true,
    chain: avalancheFuji,
  },

  {
    id: cyberTestnet.id,
    name: 'CyberTestnet',
    icon: 'https://mint.club/assets/networks/cyber@2x.png',
    color: '#32A0CD',
    openseaSlug: 'cyber-testnet',
    enabled: isAddress(getMintClubContractAddress('BOND', cyberTestnet.id)),
    isTestnet: true,
    chain: cyberTestnet,
  },

  {
    id: klaytn.id,
    name: 'Klaytn',
    icon: 'https://mint.club/assets/networks/klaytn@2x.png',
    color: '#C82812',
    openseaSlug: 'klaytn',
    enabled: isAddress(getMintClubContractAddress('BOND', klaytn.id)),
    chain: klaytn,
  },
  // {
  //   id: klaytnBaobab.id,
  //   name: 'KlaytnBaobab',
  //   icon: 'https://mint.club/assets/networks/klaytn@2x.png',
  //   color: '#C82812',
  //   openseaSlug: 'klaytn',
  //   enabled: isAddress(getMintClubContractAddress('BOND', klaytnBaobab.id)),
  //   isTestnet: true,
  //   chain: klaytnBaobab,
  // },
];

export function chainIdToViemChain(chainId: SdkSupportedChainIds) {
  return CHAINS.find((chain) => chain.id === chainId)?.chain;
}

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
  const found = CHAINS.find((chain) => chain?.name?.toLowerCase?.() === name?.toLowerCase?.());

  if (!found) throw new ChainNotSupportedError(name);

  return found.id;
}

export function getChain(chainId: SdkSupportedChainIds): chains.Chain {
  let chain = Object.values(chains).find((c) => c.id === chainId) ?? CHAINS.find((c) => c.id === chainId)?.chain;

  if (!chain) {
    throw new ChainNotSupportedError(chainId);
  }

  return chain;
}

type ChainMapType = Record<SdkSupportedChainIds, ChainType>;

export const CHAIN_MAP = CHAINS.reduce((prev, curr) => {
  prev[curr.id] = curr;
  return prev;
}, {} as ChainMapType);

export const CHAIN_NAME_ID_MAP: Record<string, SdkSupportedChainIds> = {
  sepolia: sepolia.id,
} as const;
