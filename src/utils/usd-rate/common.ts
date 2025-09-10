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
import { SdkSupportedChainIds, over } from '../../exports';

// WETH addresses for TOKEN -> ETH pricing path
export const WETH_ADDRESSES: Record<SdkSupportedChainIds, `0x${string}`> = {
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
  [degen.id]: '0xEb54dACB4C2ccb64F8074eceEa33b5eBb38E5387', // WDEGEN
  [cyber.id]: '0x4200000000000000000000000000000000000006',
  [cyberTestnet.id]: '0x4200000000000000000000000000000000000006',
  [kaia.id]: '0x19Aac5f612f524B754CA7e7c41cbFa2E981A4432', // WKLAY
  [ham.id]: '0xe8dd44D0791B73aFE9066C3A77721F42D0844bEB', // WETH
  [shibarium.id]: '0xC76F4c819D820369Fb2d7C1531aB3Bb18e6fE8d8', // WBONE
  [shibariumTestnet.id]: '0x', // WBONE
  [apeChain.id]: '0x48b62137EdfA95a428D35C09E44256a739F6B557', // WAPE
  [zora.id]: '0x4200000000000000000000000000000000000006',
  [hashkey.id]: '0xB210D2120d57b758EE163cFfb43e73728c471Cf1', // WHSK
  [unichain.id]: '0x4200000000000000000000000000000000000006',
  [over.id]: '0x59c914C8ac6F212bb655737CC80d9Abc79A1e273', // WOVER
};

// 1inch stablecoin map for USD quoting
export const STABLE_COINS: Record<SdkSupportedChainIds, { address: `0x${string}`; symbol: string; decimals: bigint }> =
  {
    [mainnet.id]: { address: '0xdac17f958d2ee523a2206206994597c13d831ec7', symbol: 'USDT', decimals: 6n },
    [optimism.id]: { address: '0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85', symbol: 'USDC', decimals: 6n },
    [arbitrum.id]: { address: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831', symbol: 'USDC', decimals: 6n },
    [avalanche.id]: { address: '0x9702230a8ea53601f5cd2dc00fdbc13d4df4a8c7', symbol: 'USDT', decimals: 6n },
    [polygon.id]: { address: '0xc2132d05d31c914a87c6611c10748aeb04b58e8f', symbol: 'USDT', decimals: 6n },
    [bsc.id]: { address: '0x55d398326f99059ff775485246999027b3197955', symbol: 'BSC-USD', decimals: 18n },
    [base.id]: { address: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913', symbol: 'USDC', decimals: 6n },
    [baseSepolia.id]: { address: '0x', symbol: '', decimals: 0n },
    [sepolia.id]: { address: '0x', symbol: '', decimals: 0n },
    [blast.id]: { address: '0x', symbol: '', decimals: 0n },
    [blastSepolia.id]: { address: '0x', symbol: '', decimals: 0n },
    [avalancheFuji.id]: { address: '0x', symbol: '', decimals: 0n },
    [degen.id]: { address: '0x', symbol: '', decimals: 0n },
    [cyber.id]: { address: '0x', symbol: '', decimals: 0n },
    [cyberTestnet.id]: { address: '0x', symbol: '', decimals: 0n },
    [kaia.id]: { address: '0xd077a400968890eacc75cdc901f0356c943e4fdb', symbol: 'USDT', decimals: 6n },
    [ham.id]: { address: '0x', symbol: '', decimals: 0n },
    [shibarium.id]: { address: '0x', symbol: '', decimals: 0n },
    [shibariumTestnet.id]: { address: '0x', symbol: '', decimals: 0n },
    [apeChain.id]: { address: '0x', symbol: '', decimals: 0n },
    [zora.id]: { address: '0x', symbol: '', decimals: 0n },
    [hashkey.id]: { address: '0x', symbol: '', decimals: 0n },
    [unichain.id]: { address: '0x078D782b760474a361dDA0AF3839290b0EF57AD6', symbol: 'USDC', decimals: 6n },
    [over.id]: { address: '0x', symbol: '', decimals: 0n },
  };
