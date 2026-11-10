import { Client, defaultClient } from '../../helpers/ClientHelper';
import { getAddress, isAddress } from 'viem';
import { oneInchContract } from '../../contracts';
import { SdkSupportedChainIds, chainIdToViemChain, getMintClubContractAddress, toNumber } from '../../exports';
import { retry } from '../retry';
import { STABLE_COINS, WETH_ADDRESSES } from './common';
import { getLiquidityFilteredRate } from './v2-liquidity';

// Cache ETH->USD rate per chain for 5 minutes to reduce on-chain calls
const ethRateCaches = new WeakMap<Client, Map<string, { rate: number; timestamp: number }>>();
const ETH_CACHE_DURATION_MS = 5 * 60 * 1000;

async function wethUsdRate(
  chainId: number,
  weth: `0x${string}`,
  decimals: number,
  blockNumber: bigint | undefined,
  client: Client,
): Promise<number | undefined> {
  const stable = STABLE_COINS[chainId as SdkSupportedChainIds];
  if (!stable || !isAddress(stable.address)) return undefined;
  let cache = ethRateCaches.get(client);
  if (!cache) {
    cache = new Map();
    ethRateCaches.set(client, cache);
  }
  const key = `${chainId}-${weth.toLowerCase()}`;
  const cached = blockNumber === undefined ? cache.get(key) : undefined;
  if (cached && Date.now() - cached.timestamp < ETH_CACHE_DURATION_MS) return cached.rate;

  // Use the established WETH/stable quote as the anchor, without recursing into its liquidity check.
  const rate = await retry(
    () =>
      oneInchContract.network(chainId as SdkSupportedChainIds, client).read({
        functionName: 'getRate',
        args: [weth, stable.address, false],
        ...(blockNumber !== undefined ? { blockNumber } : {}),
      }),
    { retries: 5, retryIntervalMs: 1000 },
  ).catch(() => undefined);
  if (rate === undefined) return undefined;
  const usdRate = toNumber(rate, Number(18n + stable.decimals) - decimals);
  if (!Number.isFinite(usdRate) || usdRate <= 0) return undefined;
  if (blockNumber === undefined) cache.set(key, { rate: usdRate, timestamp: Date.now() });
  return usdRate;
}

export async function oneinchEthRate(
  params: {
    chainId: number;
    tokenAddress: `0x${string}`;
    tokenDecimals: number;
    blockNumber?: bigint | number | 'now';
    tryCount?: number;
  },
  client: Client = defaultClient,
): Promise<{ rate: number; nativeToken: { address: `0x${string}`; symbol: string; decimals: number } } | undefined> {
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
      getLiquidityFilteredRate(
        {
          chainId,
          srcToken: tokenAddress,
          dstToken: wethAddress,
          blockNumber: bn,
          getWethUsdRate: (weth, decimals, block) => wethUsdRate(chainId, weth, decimals, block, client),
        },
        client,
      ),
    { retries: 5, retryIntervalMs: 1000 },
  ).catch(() => undefined as unknown as bigint);

  if (rate === undefined || rate === null) return undefined;

  const rateToNumber = toNumber(rate, Number(18n + 18n) - tokenDecimals);
  const nativeSymbol = chainIdToViemChain(chainId as SdkSupportedChainIds)?.nativeCurrency?.symbol || 'ETH';
  return { rate: rateToNumber, nativeToken: { address: wethAddress, symbol: nativeSymbol, decimals: 18 } } as const;
}

export async function oneinchUsdRate(
  params: {
    chainId: number;
    tokenAddress: `0x${string}`;
    tokenDecimals: number;
    blockNumber?: bigint | number | 'now';
    tryCount?: number;
  },
  client: Client = defaultClient,
): Promise<{ rate: number; stableCoin: { address: `0x${string}`; symbol: string; decimals: bigint } } | undefined> {
  const { chainId, tokenAddress, tokenDecimals, blockNumber, tryCount } = params;
  const stable = STABLE_COINS[chainId as SdkSupportedChainIds];

  if (!stable || !isAddress(stable.address) || stable.address === '0x') return undefined;
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
      getLiquidityFilteredRate(
        {
          chainId,
          srcToken: stable.address,
          dstToken: tokenAddress,
          blockNumber: bn,
          getWethUsdRate: (weth, decimals, block) => wethUsdRate(chainId, weth, decimals, block, client),
        },
        client,
      ),
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

  // Preserve a usable ETH route, but do not retry rejected liquidity through external providers.
  const unavailableRate = reverseRate === 0n ? ({ rate: 0, stableCoin: stable } as const) : undefined;
  // Fallback 2: TOKEN -> ETH -> USD path
  const ethRate = await oneinchEthRate(
    {
      chainId,
      tokenAddress,
      tokenDecimals,
      blockNumber,
      tryCount: (tryCount ?? 0) + 1,
    },
    client,
  );
  if (!ethRate) return unavailableRate;
  if (ethRate.rate === 0) return { rate: 0, stableCoin: stable } as const;

  const wethAddress = WETH_ADDRESSES[chainId as SdkSupportedChainIds];
  const ethUsdRate = await wethUsdRate(chainId, wethAddress, 18, bn, client);
  if (ethUsdRate === undefined) return unavailableRate;

  const finalUsdRate = ethRate.rate * ethUsdRate;
  if (!finalUsdRate) return unavailableRate;
  return { rate: finalUsdRate, stableCoin: stable } as const;
}
