import { getAddress, isAddress } from 'viem';
import {
  arbitrum,
  avalanche,
  avalancheFuji,
  base,
  baseSepolia,
  blast,
  blastSepolia,
  bsc,
  kaia,
  mainnet,
  optimism,
  polygon,
  sepolia,
  degen,
  cyber,
  cyberTestnet,
  ham,
  shibarium,
  shibariumTestnet,
  unichain,
} from 'viem/chains';
import { oneInchContract } from '../contracts';
import { ChainNotSupportedError } from '../errors/sdk.errors';
import { SdkSupportedChainIds, toNumber, getMintClubContractAddress } from '../exports';
import { retry } from '../utils/retry';

export type USDValueOptions = {
  tokenAddress: `0x${string}`;
  tokenDecimals: number;
  blockNumber?: bigint;
};

export const STABLE_COINS: Record<SdkSupportedChainIds, { address: `0x${string}`; symbol: string; decimals: bigint }> =
  {
    [mainnet.id]: {
      address: '0xdac17f958d2ee523a2206206994597c13d831ec7',
      symbol: 'USDT',
      decimals: 6n,
    }, // USDT
    [optimism.id]: {
      address: '0x94b008aa00579c1307b0ef2c499ad98a8ce58e58',
      symbol: 'USDT',
      decimals: 6n,
    }, // USDT
    [arbitrum.id]: {
      address: '0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9',
      symbol: 'USDT',
      decimals: 6n,
    }, // USDT
    [avalanche.id]: {
      address: '0x9702230a8ea53601f5cd2dc00fdbc13d4df4a8c7',
      symbol: 'USDT',
      decimals: 6n,
    }, // USDT
    [polygon.id]: {
      address: '0xc2132d05d31c914a87c6611c10748aeb04b58e8f',
      symbol: 'USDT',
      decimals: 6n,
    }, // USDT
    [bsc.id]: {
      address: '0x55d398326f99059ff775485246999027b3197955',
      symbol: 'USDT',
      decimals: 18n,
    }, // USDT
    [base.id]: {
      address: '0xd9aaec86b65d86f6a7b5b1b0c42ffa531710b6ca',
      symbol: 'USDBC',
      decimals: 6n,
    }, // USDBC
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
    [unichain.id]: { address: '0x', symbol: '', decimals: 0n },
  };

export class OneInch {
  private chainId: SdkSupportedChainIds;

  constructor(chainId: SdkSupportedChainIds) {
    this.chainId = chainId;
  }

  public async getUsdRate({
    tokenAddress,
    tokenDecimals,
    blockNumber,
    tryCount,
  }: USDValueOptions & { blockNumber?: bigint | number | 'now'; tryCount?: number }) {
    const stable = STABLE_COINS[this.chainId];

    if (!isAddress(stable.address) || stable.address === '0x') {
      return undefined;
    }

    if (typeof tryCount === 'number' && tryCount > 5) return undefined;

    const isSameToken = isAddress(tokenAddress) && getAddress(tokenAddress) === getAddress(stable.address);
    if (isSameToken) return { rate: 1, stableCoin: stable };

    // Validate params similar to client before attempting read
    const oneInchAddress = getMintClubContractAddress('ONEINCH', this.chainId);
    const validParams =
      tokenAddress &&
      tokenAddress !== '0x' &&
      oneInchAddress !== '0x' &&
      isAddress(tokenAddress) &&
      isAddress(stable.address) &&
      isAddress(oneInchAddress);

    if (!validParams) return undefined;

    // Compute blockNumber value to pass (number -> bigint, 'now' -> undefined)
    let bn: bigint | undefined = undefined;
    if (typeof blockNumber === 'number') {
      bn = BigInt(blockNumber);
    } else if (typeof blockNumber === 'bigint') {
      bn = blockNumber;
    } else if (blockNumber === 'now') {
      bn = undefined;
    }

    // Retry read up to 5 times, 1s interval, and swallow errors to return undefined (rpc down)
    const rate = await retry(
      () =>
        oneInchContract.network(this.chainId).read({
          functionName: 'getRate',
          args: [tokenAddress, stable.address, false],
          ...(bn !== undefined ? { blockNumber: bn } : {}),
        }),
      { retries: 5, retryIntervalMs: 1000 },
    ).catch(() => {
      return undefined as unknown as bigint;
    });

    if (rate === undefined || rate === null) return undefined;

    const stableCoinDecimals = stable.decimals;
    const rateToNumber = toNumber(rate, Number(18n + stableCoinDecimals) - tokenDecimals);
    return { rate: rateToNumber, stableCoin: stable };
  }
}
