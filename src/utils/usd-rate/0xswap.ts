import { createClientV2 } from '@0x/swap-ts-sdk';
import { getAddress, isAddress, parseUnits } from 'viem';
import { SdkSupportedChainIds } from '../../constants/contracts';
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

  // this api key can be exposed to the public
  const client = createClientV2({ apiKey: '44dd5e10-4062-42e1-9c2c-67e90d99972b' });

  // Price 1 whole token to get USD rate per token
  const sellAmount = parseUnits('1', tokenDecimals).toString();

  try {
    const res: any = await client.swap.permit2.getPrice.query({
      chainId,
      sellToken: tokenAddress,
      buyToken: stable.address,
      sellAmount,
    });

    // Prefer buyAmount if provided; fallback to price * sellAmount
    const buyAmount: string | undefined = res?.buyAmount;
    if (buyAmount) {
      const amountOut = BigInt(buyAmount);
      const rate = toNumber(amountOut, Number(stable.decimals));
      return { rate, stableCoin: stable } as const;
    }

    const unitPrice: string | number | undefined = (res?.price as string | undefined) ?? undefined;
    if (unitPrice !== undefined) {
      const rate = Number(unitPrice);
      if (Number.isFinite(rate)) return { rate, stableCoin: stable } as const;
    }

    return undefined;
  } catch {
    return undefined;
  }
}
