// pollyfill
import { Abi } from 'viem';
import { BOND_ABI } from './constants/abis/bond';
import { ERC1155_ABI } from './constants/abis/erc1155';
import { ERC20_ABI } from './constants/abis/erc20';
import { LOCKER_ABI } from './constants/abis/locker';
import { MERKLE_ABI } from './constants/abis/merkle';
import { ONEINCH_ABI } from './constants/abis/oneinch';
import { ZAP_ABI } from './constants/abis/zap';
import { LowerCaseChainNames } from './constants/chains';
import { ContractChainType, ContractType } from './constants/contracts';
import { CONTRACT_ERROR_MESSAGES } from './constants/error-dictionary/contract-errors';
import { TOKENS } from './constants/tokens';
import { GenericContract } from './contracts/GenericContract';

export type * from './constants/chains';
export * from './constants/contracts';
export * from './constants/tokens';

export const bondContract = new GenericContract('BOND');
export const erc20Contract = new GenericContract('ERC20');
export const erc1155Contract = new GenericContract('ERC1155');
export const zapContract = new GenericContract('ZAP');
export const merkleContract = new GenericContract('MERKLE');
export const oneInchContract = new GenericContract('ONEINCH');

const abis: Record<ContractType, Abi> = {
  BOND: BOND_ABI,
  ERC20: ERC20_ABI,
  ERC1155: ERC1155_ABI,
  LOCKER: LOCKER_ABI,
  MERKLE: MERKLE_ABI,
  ONEINCH: ONEINCH_ABI,
  ZAP: ZAP_ABI,
};

const whitelistedTokens = TOKENS;
const errorMessages = CONTRACT_ERROR_MESSAGES;
const supportedChains = [
  'ethereum',
  'sepolia',
  'bnbchain',
  'polygon',
  'arbitrum',
  'optimism',
  'avalanche',
  'base',
] as const;

const supportedChainsMap: Record<LowerCaseChainNames, ContractChainType> = {
  ethereum: 1,
  sepolia: 11155111,
  bnbchain: 56,
  polygon: 137,
  arbitrum: 42161,
  optimism: 10,
  avalanche: 43114,
  base: 8453,
};

export { abis, errorMessages, supportedChains, supportedChainsMap, whitelistedTokens };
