import { getAddress, isAddress, parseUnits } from 'viem';
import { SdkSupportedChainIds } from '../../constants/contracts';
import { baseFetcher } from '../api';
import { toNumber } from '../numbers';
import { STABLE_COINS } from './common';

export async function get0xSwapUsdRate(params: {
  chainId: number;
  tokenAddress: `0x${string}`;
  tokenDecimals: number;
  blockNumber?: bigint | number | 'now';
  tryCount?: number;
}): Promise<{ rate: number; stableCoin: { address: `0x${string}`; symbol: string; decimals: bigint } } | undefined> {
  const { chainId, tokenAddress, tokenDecimals, blockNumber, tryCount } = params;

  const stable = STABLE_COINS[chainId as SdkSupportedChainIds];
  if (!stable || !isAddress(stable.address) || stable.address === '0x') return undefined;

  if (!isAddress(tokenAddress)) return undefined;
  if (typeof tryCount === 'number' && tryCount > 5) return undefined;

  // 0x Swap API does not support historical block pinning; only live quotes
  if (blockNumber !== undefined && blockNumber !== 'now') return undefined;

  const isSame = getAddress(tokenAddress) === getAddress(stable.address);
  if (isSame) return { rate: 1, stableCoin: stable } as const;

  // Price 1 whole token to get USD rate per token
  const sellAmount = parseUnits('1', tokenDecimals).toString();

  try {
    const qs = new URLSearchParams({
      chainId: String(chainId),
      sellToken: tokenAddress,
      buyToken: stable.address,
      sellAmount,
    }).toString();
    const res: any = await baseFetcher.get(`price?${qs}`, { prefixUrl: 'https://api.hyped.club' });

    // Prefer buyAmount if provided; fallback to price * sellAmount
    const buyAmount: string | undefined = res?.buyAmount;
    if (buyAmount) {
      const amountOut = BigInt(buyAmount);
      const rate = toNumber(amountOut, Number(stable.decimals));
      if (rate >= 0.000001) return { rate, stableCoin: stable } as const;
    }

    const unitPrice: string | number | undefined = (res?.price as string | undefined) ?? undefined;
    if (unitPrice !== undefined) {
      const rate = Number(unitPrice);
      if (Number.isFinite(rate) && rate >= 0.000001) return { rate, stableCoin: stable } as const;
    }
    // Reverse-quote fallback: STABLE -> TOKEN, then invert to get USD per token
    try {
      const reverseSellAmount = parseUnits('1', Number(stable.decimals)).toString();
      const reverseQs = new URLSearchParams({
        chainId: String(chainId),
        sellToken: stable.address,
        buyToken: tokenAddress,
        sellAmount: reverseSellAmount,
      }).toString();
      const reverseRes: any = await baseFetcher.get(`price?${reverseQs}`, { prefixUrl: 'https://api.hyped.club' });

      const reverseBuyAmount: string | undefined = reverseRes?.buyAmount;
      if (reverseBuyAmount) {
        const tokensPerStable = toNumber(BigInt(reverseBuyAmount), tokenDecimals);
        if (tokensPerStable > 0) {
          const inverted = 1 / tokensPerStable;
          if (Number.isFinite(inverted) && inverted > 0) return { rate: inverted, stableCoin: stable } as const;
        }
      }

      const reverseUnitPrice: string | number | undefined = (reverseRes?.price as string | undefined) ?? undefined;
      if (reverseUnitPrice !== undefined) {
        const tokensPerStable2 = Number(reverseUnitPrice);
        if (Number.isFinite(tokensPerStable2) && tokensPerStable2 > 0) {
          const inverted2 = 1 / tokensPerStable2;
          if (Number.isFinite(inverted2) && inverted2 > 0) return { rate: inverted2, stableCoin: stable } as const;
        }
      }
    } catch {}

    return undefined;
  } catch {
    return undefined;
  }
}
