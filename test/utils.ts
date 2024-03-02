import { LowerCaseChainNames } from '../src/constants/chains';

type ValueOf<T> = T[keyof T];
type Entries<T> = [keyof T, ValueOf<T>][];

export const PROTOCOL_BENEFICIARY = '0x00000B655d573662B9921e14eDA96DBC9311fDe6'; // a random address for testing

export const ALL_CHAINS = ['ethereum', 'optimism', 'arbitrum', 'avalanche', 'polygon', 'bnbchain', 'base'] as const;

export const MAX_STEPS = {
  mainnet: 1000n, // 30M gas limit
  optimisticEthereum: 1000n, // 30M gas limit
  arbitrumOne: 1000n, // over 30M gas limit
  base: 1000n, // 30M gas limit
  sepolia: 1000n, // 30M gas limit
  polygon: 1000n, // 30M gas limit
  bsc: 1000n, // 30M gas limit
  avalanche: 1000n, // 15M gas limit
  blastSepolia: 1000n, // 30M gas limit
  avalancheFujiTestnet: 1000n, // ? gas limit
  movementDevnet: 1000n, // ? gas limit
};

// Same as `Object.entries()` but with type inference
export function objectEntries<T extends object>(obj: T): Entries<T> {
  return Object.entries(obj) as Entries<T>;
}

export function wei(num: number, decimals = 18) {
  return BigInt(num) * 10n ** BigInt(decimals);
}

export function getCreationFee(network: LowerCaseChainNames) {
  // Collect ~ $5 of asset creation fee to prevent spam
  const CREATION_FEE: Record<LowerCaseChainNames, bigint> = {
    ethereum: 2n * 10n ** 15n, // 0.002 ETH
    optimism: 2n * 10n ** 15n, // 0.002 ETH
    arbitrum: 2n * 10n ** 15n, // 0.002 ETH
    base: 2n * 10n ** 15n, // 0.002 ETH
    sepolia: 0n, // 0 ETH - testnet
    polygon: 5n * 10n ** 18n, // 5 MATIC
    bnbchain: 15n * 10n ** 15n, // 0.015 BNB
    avalanche: 15n * 10n ** 16n, // 0.15 AVAX
  } as const;

  if (CREATION_FEE[network] === undefined) {
    throw new Error(`CREATION_FEE is not defined for ${network}`);
  }

  return CREATION_FEE[network];
}
