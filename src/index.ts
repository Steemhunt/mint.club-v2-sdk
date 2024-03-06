const isNode = typeof process !== 'undefined' && process.versions != null && process.versions.node != null;
import { JSDOM } from 'jsdom';

if (isNode) {
  const { window } = new JSDOM('');
  (global as any).window = window;
}

import { MintClubSDK } from './MintClubSDK';
import {
  Abi,
  BOND_ABI,
  CONTRACT_ERROR_MESSAGES,
  SdkSupportedChainIds,
  ContractNames,
  ERC1155_ABI,
  ERC20_ABI,
  LOCKER_ABI,
  LowerCaseChainNames,
  MERKLE_ABI,
  ONEINCH_ABI,
  TOKENS,
  ZAP_ABI,
} from './exports';

export const abis: Record<ContractNames, Abi> = {
  BOND: BOND_ABI,
  ERC20: ERC20_ABI,
  ERC1155: ERC1155_ABI,
  LOCKER: LOCKER_ABI,
  MERKLE: MERKLE_ABI,
  ONEINCH: ONEINCH_ABI,
  ZAP: ZAP_ABI,
};

export const whitelistedTokens = TOKENS;
export const errorMessages = CONTRACT_ERROR_MESSAGES;
export const supportedChains = [
  'ethereum',
  'sepolia',
  'bnbchain',
  'polygon',
  'arbitrum',
  'optimism',
  'avalanche',
  'base',
] as const;

export const supportedChainsMap: Record<LowerCaseChainNames, SdkSupportedChainIds> = {
  ethereum: 1,
  sepolia: 11155111,
  bnbchain: 56,
  polygon: 137,
  arbitrum: 42161,
  optimism: 10,
  avalanche: 43114,
  base: 8453,
};

export * from './exports';
export * from './contracts';

export const mintclub = new MintClubSDK();
