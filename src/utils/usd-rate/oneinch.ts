import { getAddress, isAddress } from 'viem';
import { oneInchContract } from '../../contracts';
import { SdkSupportedChainIds, chainIdToViemChain, getMintClubContractAddress, toNumber } from '../../exports';
import { retry } from '../retry';
import { STABLE_COINS, WETH_ADDRESSES } from './common';

// Cache ETH->USD rate per chain for 5 minutes to reduce on-chain calls
const ethRateCache = new Map<string, { rate: number; timestamp: number }>();
const ETH_CACHE_DURATION_MS = 5 * 60 * 1000;

export async function oneinchEthRate(params: {
  chainId: number;
  tokenAddress: `0x${string}`;
  tokenDecimals: number;
  blockNumber?: bigint | number | 'now';
  tryCount?: number;
}): Promise<{ rate: number; nativeToken: { address: `0x${string}`; symbol: string; decimals: number } } | undefined> {
  const { chainId, tokenAddress, tokenDecimals, blockNumber, tryCount } = params;
  const wethAddress = WETH_ADDRESSES[chainId as SdkSupportedChainIds];

  if (!isAddress(wethAddress) || wethAddress === '0x') return undefined;
  if (typeof tryCount === 'number' && tryCount > 5) return undefined;

  const isSameToken = isAddress(tokenAddress) && getAddress(tokenAddress) === getAddress(wethAddress);
  if (isSameToken) {
    const nativeSymbol = chainIdToViemChain(chainId as SdkSupportedChainIds)?.nativeCurrency?.symbol || 'ETH';
    return { rate: 1, nativeToken: { address: wethAddress, symbol: nativeSymbol, decimals: 18 } } as const;
  }

  const oneInchAddress = getMintClubContractAddress('ONEINCH', chainId as SdkSupportedChainIds);
  const validParams =
    tokenAddress &&
    tokenAddress !== '0x' &&
    oneInchAddress !== '0x' &&
    isAddress(tokenAddress) &&
    isAddress(wethAddress) &&
    isAddress(oneInchAddress);
  if (!validParams) return undefined;

  let bn: bigint | undefined = undefined;
  if (typeof blockNumber === 'number') bn = BigInt(blockNumber);
  else if (typeof blockNumber === 'bigint') bn = blockNumber;
  else if (blockNumber === 'now') bn = undefined;

  const rate = await retry(
    () =>
      oneInchContract.network(chainId as SdkSupportedChainIds).read({
        functionName: 'getRate',
        args: [tokenAddress, wethAddress, false],
        ...(bn !== undefined ? { blockNumber: bn } : {}),
      }),
    { retries: 5, retryIntervalMs: 1000 },
  ).catch(() => undefined as unknown as bigint);

  if (rate === undefined || rate === null) return undefined;

  const rateToNumber = toNumber(rate, Number(18n + 18n) - tokenDecimals);
  const nativeSymbol = chainIdToViemChain(chainId as SdkSupportedChainIds)?.nativeCurrency?.symbol || 'ETH';
  return { rate: rateToNumber, nativeToken: { address: wethAddress, symbol: nativeSymbol, decimals: 18 } } as const;
}

export async function oneinchUsdRate(params: {
  chainId: number;
  tokenAddress: `0x${string}`;
  tokenDecimals: number;
  blockNumber?: bigint | number | 'now';
  tryCount?: number;
}): Promise<{ rate: number; stableCoin: { address: `0x${string}`; symbol: string; decimals: bigint } } | undefined> {
  const { chainId, tokenAddress, tokenDecimals, blockNumber, tryCount } = params;
  const stable = STABLE_COINS[chainId as SdkSupportedChainIds];

  if (!isAddress(stable.address) || stable.address === '0x') return undefined;
  if (typeof tryCount === 'number' && tryCount > 5) return undefined;

  const isSameToken = isAddress(tokenAddress) && getAddress(tokenAddress) === getAddress(stable.address);
  if (isSameToken) return { rate: 1, stableCoin: stable } as const;

  const oneInchAddress = getMintClubContractAddress('ONEINCH', chainId as SdkSupportedChainIds);
  const validParams =
    tokenAddress &&
    tokenAddress !== '0x' &&
    oneInchAddress !== '0x' &&
    isAddress(tokenAddress) &&
    isAddress(stable.address) &&
    isAddress(oneInchAddress);
  if (!validParams) return undefined;

  let bn: bigint | undefined = undefined;
  if (typeof blockNumber === 'number') bn = BigInt(blockNumber);
  else if (typeof blockNumber === 'bigint') bn = blockNumber;
  else if (blockNumber === 'now') bn = undefined;

  // default: reverse-quote for precision (STABLE -> TOKEN) and invert
  // This avoids precision loss when quoting directly into 6-decimal stables for tiny USD prices
  const reverseRate = await retry(
    () =>
      oneInchContract.network(chainId as SdkSupportedChainIds).read({
        functionName: 'getRate',
        args: [stable.address, tokenAddress, false],
        ...(bn !== undefined ? { blockNumber: bn } : {}),
      }),
    { retries: 5, retryIntervalMs: 1000 },
  ).catch(() => undefined as unknown as bigint);

  if (reverseRate !== undefined && reverseRate !== null) {
    // tokens per 1 stable
    const tokensPerStable = toNumber(reverseRate, Number(18n + BigInt(tokenDecimals) - stable.decimals));
    if (tokensPerStable > 0) {
      const invertedUsdPerToken = 1 / tokensPerStable;
      if (Number.isFinite(invertedUsdPerToken) && invertedUsdPerToken > 0) {
        return { rate: invertedUsdPerToken, stableCoin: stable } as const;
      }
    }
  }

  // Fallback 2: TOKEN -> ETH -> USD path
  const ethRate = await oneinchEthRate({
    chainId,
    tokenAddress,
    tokenDecimals,
    blockNumber,
    tryCount: (tryCount ?? 0) + 1,
  });
  if (!ethRate) return undefined;

  const wethAddress = WETH_ADDRESSES[chainId as SdkSupportedChainIds];
  const cacheKey = `eth-usd-${chainId}`;
  let cached = ethRateCache.get(cacheKey);
  let ethUsdRate: number | undefined = undefined;

  if (cached && Date.now() - cached.timestamp < ETH_CACHE_DURATION_MS) {
    ethUsdRate = cached.rate;
  } else {
    const ethToUsdRate = await retry(
      () =>
        oneInchContract.network(chainId as SdkSupportedChainIds).read({
          functionName: 'getRate',
          args: [wethAddress, stable.address, false],
          ...(bn !== undefined ? { blockNumber: bn } : {}),
        }),
      { retries: 5, retryIntervalMs: 1000 },
    ).catch(() => undefined as unknown as bigint);

    if (ethToUsdRate === undefined || ethToUsdRate === null) return undefined;
    ethUsdRate = toNumber(ethToUsdRate, Number(18n + stable.decimals) - 18);
    ethRateCache.set(cacheKey, { rate: ethUsdRate, timestamp: Date.now() });
  }

  const finalUsdRate = ethRate.rate * ethUsdRate;
  if (!finalUsdRate) return undefined;
  return { rate: finalUsdRate, stableCoin: stable } as const;
}
