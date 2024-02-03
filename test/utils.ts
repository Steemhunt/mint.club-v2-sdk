import { LowerCaseChainNames } from '../src/constants/chains';

type ValueOf<T> = T[keyof T];
type Entries<T> = [keyof T, ValueOf<T>][];

export const ALL_CHAINS = ['ethereum', 'optimism', 'arbitrum', 'avalanche', 'polygon', 'bnbchain', 'base'] as const;

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
