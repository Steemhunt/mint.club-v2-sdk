import {
  arbitrum,
  avalanche,
  avalancheFuji,
  base,
  baseSepolia,
  blast,
  blastSepolia,
  bsc,
  klaytn,
  mainnet,
  optimism,
  polygon,
  sepolia,
  degen,
  cyber,
  cyberTestnet,
} from 'viem/chains';
import { SdkSupportedChainIds } from '../contracts';
import { ARBITRUM_TOKENS } from './arbitrum';
import { AVALANCHE_TOKENS } from './avalanche';
import { AVALANCHE_FUJI_TOKENS } from './avalanche-fuji';
import { BASE_TOKENS } from './base';
import { BLAST_TOKENS } from './blast';
import { BLAST_SEPOLIA_TOKENS } from './blast-sepolia';
import { BSC_TOKENS } from './bsc';
import { MAINNET_TOKENS } from './mainnet';
import { OPTIMISM_TOKENS } from './optimism';
import { POLYGON_TOKENS } from './polygon';
import { SEPOLIA_TOKENS } from './sepolia';
import { DEGEN_TOKENS } from './degen';
import { BASE_SEPOLIA_TOKENS } from './base-sepolia';
import { CYBER_TESTNET_TOKENS } from './cyber-testnet';
import { CYBER_TOKENS } from './cyber';
import { KLAYTN_TOKENS } from './klaytn';

// Ref: https://api.coingecko.com/api/v3/asset_platforms
export const COINGECKO_NETWORK_IDS = {
  [mainnet.id]: 'ethereum',
  [optimism.id]: 'optimistic-ethereum',
  [arbitrum.id]: 'arbitrum-one',
  [avalanche.id]: 'avalanche',
  [base.id]: 'base',
  [polygon.id]: 'polygon-pos',
  [bsc.id]: 'binance-smart-chain',
  [sepolia.id]: 'ethereum', // sepolia not supported by coingecko API
  [blast.id]: 'ethereum', // blast not supported by coingecko API
  [blastSepolia.id]: 'ethereum', // blast sepolia not supported by coingecko API
  [avalancheFuji.id]: 'ethereum', // avalanche-fuji not supported by coingecko API
} as const satisfies Partial<Record<SdkSupportedChainIds, string>>;

export type BaseToken = {
  name: string;
  symbol: string;
  address: `0x${string}`;
  decimals: number;
  image?: {
    small: string | null;
    large: string | null;
  };
};

export type WrappedToken = {
  image: string;
  tokenAddress: `0x${string}`;
  nativeSymbol: string;
  oneInchSymbol: 'USDT' | 'USDC' | 'USDbC' | 'USDB';
  decimals: number;
};

export const WRAPPED_NATIVE_TOKENS: Record<SdkSupportedChainIds, WrappedToken> = {
  [mainnet.id]: {
    image: 'https://mint.club/assets/tokens/large/eth.png',
    tokenAddress: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
    nativeSymbol: 'ETH',
    oneInchSymbol: 'USDT',
    decimals: 18,
  },
  [optimism.id]: {
    image: 'https://mint.club/assets/tokens/large/eth.png',
    tokenAddress: '0x4200000000000000000000000000000000000006',
    nativeSymbol: 'ETH',
    oneInchSymbol: 'USDT',
    decimals: 18,
  },
  [arbitrum.id]: {
    image: 'https://mint.club/assets/tokens/large/eth.png',
    tokenAddress: '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1',
    nativeSymbol: 'ETH',
    oneInchSymbol: 'USDT',
    decimals: 18,
  },
  [avalanche.id]: {
    image: 'https://mint.club/assets/tokens/large/avalanche.png',
    tokenAddress: '0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7',
    nativeSymbol: 'AVAX',
    oneInchSymbol: 'USDT',
    decimals: 18,
  },
  [polygon.id]: {
    image: 'https://mint.club/assets/tokens/large/matic.png',
    tokenAddress: '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270',
    nativeSymbol: 'MATIC',
    oneInchSymbol: 'USDT',
    decimals: 18,
  },
  [bsc.id]: {
    image: 'https://mint.club/assets/tokens/large/bnb.png',
    tokenAddress: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
    nativeSymbol: 'BNB',
    oneInchSymbol: 'USDT',
    decimals: 18,
  },
  [base.id]: {
    image: 'https://mint.club/assets/tokens/large/eth.png',
    tokenAddress: '0x4200000000000000000000000000000000000006',
    nativeSymbol: 'ETH',
    oneInchSymbol: 'USDbC',
    decimals: 18,
  },
  [sepolia.id]: {
    image: 'https://mint.club/assets/tokens/large/eth.png',
    tokenAddress: '0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14',
    nativeSymbol: 'ETH',
    oneInchSymbol: 'USDT',
    decimals: 18,
  },
  [baseSepolia.id]: {
    image: 'https://mint.club/assets/tokens/large/eth.png',
    tokenAddress: '0x4200000000000000000000000000000000000006',
    nativeSymbol: 'ETH',
    oneInchSymbol: 'USDT',
    decimals: 18,
  },
  [blast.id]: {
    image: 'https://mint.club/assets/tokens/large/blast.png',
    tokenAddress: '0x4300000000000000000000000000000000000004',
    nativeSymbol: 'ETH',
    oneInchSymbol: 'USDB',
    decimals: 18,
  },
  [blastSepolia.id]: {
    image: 'https://mint.club/assets/tokens/large/blast.png',
    tokenAddress: '0x4200000000000000000000000000000000000023',
    nativeSymbol: 'ETH',
    oneInchSymbol: 'USDB',
    decimals: 18,
  },
  [avalancheFuji.id]: {
    image: 'https://mint.club/assets/tokens/large/avalanche.png',
    tokenAddress: '0xd00ae08403B9bbb9124bB305C09058E32C39A48c',
    nativeSymbol: 'AVAX',
    oneInchSymbol: 'USDT',
    decimals: 18,
  },
  [degen.id]: {
    image: 'https://mint.club/assets/tokens/large/degen.png',
    tokenAddress: '0xEb54dACB4C2ccb64F8074eceEa33b5eBb38E5387',
    nativeSymbol: 'DEGEN',
    oneInchSymbol: 'USDC',
    decimals: 18,
  },
  [cyber.id]: {
    image: 'https://mint.club/assets/tokens/large/eth.png',
    tokenAddress: '0x4200000000000000000000000000000000000006',
    nativeSymbol: 'ETH',
    oneInchSymbol: 'USDT',
    decimals: 18,
  },
  [cyberTestnet.id]: {
    image: 'https://mint.club/assets/tokens/large/eth.png',
    tokenAddress: '0xf760686C2b40F7C526D040b979641293D2F55816',
    nativeSymbol: 'ETH',
    oneInchSymbol: 'USDC',
    decimals: 18,
  },
  [klaytn.id]: {
    image: 'https://mint.club/assets/tokens/large/klaytn.png',
    tokenAddress: '0x608792Deb376CCE1c9FA4D0E6B7b44f507CfFa6A',
    nativeSymbol: 'KLAY',
    oneInchSymbol: 'USDC',
    decimals: 6,
  },
};

// the tokens were scraped from coingecko using a custom scraper, mint.club-scripts/whitelist
export const TOKENS: Record<SdkSupportedChainIds, Record<`0x${string}`, BaseToken>> = {
  // export const TOKENS = {
  [mainnet.id]: MAINNET_TOKENS,
  [optimism.id]: OPTIMISM_TOKENS,
  [arbitrum.id]: ARBITRUM_TOKENS,
  [avalanche.id]: AVALANCHE_TOKENS,
  [polygon.id]: POLYGON_TOKENS,
  [bsc.id]: BSC_TOKENS,
  [base.id]: BASE_TOKENS,
  [blast.id]: BLAST_TOKENS,
  [blastSepolia.id]: BLAST_SEPOLIA_TOKENS,
  [sepolia.id]: SEPOLIA_TOKENS,
  [baseSepolia.id]: BASE_SEPOLIA_TOKENS,
  [avalancheFuji.id]: AVALANCHE_FUJI_TOKENS,
  [degen.id]: DEGEN_TOKENS,
  [cyber.id]: CYBER_TOKENS,
  [cyberTestnet.id]: CYBER_TESTNET_TOKENS,
  [klaytn.id]: KLAYTN_TOKENS,
};

export type TokenChain = keyof typeof TOKENS;
export type TokenSymbol = keyof (typeof TOKENS)[TokenChain];
