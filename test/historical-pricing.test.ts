import { afterEach, expect, mock, spyOn, test } from 'bun:test';
import { ERC20 } from '../src/helpers/ERC20Helper';
import { Utils } from '../src/helpers/UtilsHelper';
import { Client } from '../src/helpers/ClientHelper';
import { bondContract, erc20Contract, oneInchContract } from '../src/contracts';
import { STABLE_COINS, WETH_ADDRESSES } from '../src/utils/usd-rate/common';
import { oneinchUsdRate } from '../src/utils/usd-rate/oneinch';
import * as liquidity from '../src/utils/usd-rate/v2-liquidity';

const TOKEN = '0x1111111111111111111111111111111111111111';
const RESERVE = '0x2222222222222222222222222222222222222222';
const STABLE = STABLE_COINS[8453];
afterEach(() => mock.restore());

test('nested reserve pricing pins its bond existence, reserve and price reads', async () => {
  const token = new ERC20({ chainId: 8453, symbolOrAddress: TOKEN });
  spyOn(token, 'getReserveToken').mockResolvedValue({ address: RESERVE, symbol: 'RES', name: 'Reserve', decimals: 18 });
  const read = mock(async (params: any) => {
    if (params.functionName === 'exists') return true;
    if (params.functionName === 'priceForNextMint') return 3n * 10n ** 6n;
    if (params.functionName === 'tokenBond') return [TOKEN, 0, 0, 0, STABLE.address, 0n];
    throw new Error('Unexpected read');
  });
  spyOn(bondContract, 'network').mockReturnValue({ read } as any);
  spyOn(erc20Contract, 'network').mockReturnValue({
    read: async (params: any) => (params.functionName === 'decimals' ? 6 : 'USDC'),
  } as any);
  spyOn(Utils.prototype, 'oneinchUsdRate').mockResolvedValue({ rate: 1, stableCoin: STABLE });
  expect((await token.getReserveUsdRate({ blockNumber: 123n })).usdRate).toBe(3);
  for (const [params] of read.mock.calls) expect(params.blockNumber).toBe(123n);
});

test('remapped historical quotes use timestamps instead of a live quote on the other chain', async () => {
  const token = new ERC20({ chainId: 130, symbolOrAddress: '0x4200000000000000000000000000000000000006' });
  spyOn(token, 'exists').mockResolvedValue(false);
  spyOn(erc20Contract, 'network').mockReturnValue({ read: async () => 18 } as any);
  const oneinch = spyOn(Utils.prototype, 'oneinchUsdRate').mockResolvedValue({ rate: 999, stableCoin: STABLE });
  spyOn(Utils.prototype, 'getTimestampFromBlock').mockResolvedValue(1234);
  const llama = spyOn(Utils.prototype, 'defillamaUsdRate').mockResolvedValue(2);
  expect((await token.getUsdRate({ amount: 1, blockNumber: 123n })).usdRate).toBe(2);
  expect(oneinch).not.toHaveBeenCalled();
  expect(llama).toHaveBeenCalledWith({ chainId: 130, tokenAddress: token.getTokenAddress(), timestamp: 1234 });
});

test('historical ETH fallback quotes neither read nor overwrite the live cache', async () => {
  const weth = WETH_ADDRESSES[8453];
  const read = mock(async (params: any) => {
    const [from, to] = params.args;
    if (from === STABLE.address) return 0n;
    if (to === weth) return (params.blockNumber === undefined ? 2n : 3n) * 10n ** 18n;
    if (from === weth && to === STABLE.address) return (params.blockNumber === undefined ? 100n : 50n) * 10n ** 6n;
    throw new Error('Unexpected rate request');
  });
  spyOn(oneInchContract, 'network').mockReturnValue({ read } as any);
  spyOn(liquidity, 'getLiquidityFilteredRate').mockImplementation(async (params) => {
    const rate = await read({ args: [params.srcToken, params.dstToken], blockNumber: params.blockNumber });
    return rate === 0n ? undefined : rate;
  });
  const args = { chainId: 8453, tokenAddress: TOKEN, tokenDecimals: 18 };
  expect((await oneinchUsdRate(args))?.rate).toBe(200);
  expect((await oneinchUsdRate({ ...args, blockNumber: 123n }))?.rate).toBe(150);
  expect((await oneinchUsdRate(args))?.rate).toBe(200);
  expect(
    read.mock.calls.filter(([params]) => params.args[0] === weth && params.args[1] === STABLE.address),
  ).toHaveLength(2);
});

test('unsupported USD quote networks return unavailable without dereferencing missing stablecoins', async () => {
  expect(await oneinchUsdRate({ chainId: 999999, tokenAddress: TOKEN, tokenDecimals: 18 })).toBeUndefined();
});

test('independent SDK pricing paths and ETH caches use their own RPC context', async () => {
  const { MintClubSDK } = await import('../src');
  const { base } = await import('viem/chains');
  const first = new MintClubSDK();
  const second = new MintClubSDK();
  const weth = WETH_ADDRESSES[8453];
  const reads = [mock(), mock()];
  for (const [index, sdk] of [first, second].entries()) {
    sdk.withPublicClient({
      chain: base,
      readContract: async (params: any) => {
        reads[index](params);
        const [from, to] = params.args;
        if (from === STABLE.address) return 0n;
        if (to === weth) return 10n ** 18n;
        return BigInt(index + 1) * 100n * 10n ** 6n;
      },
    } as any);
  }
  spyOn(liquidity, 'getLiquidityFilteredRate').mockImplementation(async (params, client) => {
    const rate = await client._getPublicClient(params.chainId as 8453).readContract({
      args: [params.srcToken, params.dstToken],
    } as any);
    return rate === 0n ? undefined : (rate as bigint);
  });
  const params = { chainId: 8453, tokenAddress: TOKEN, tokenDecimals: 18 };
  expect((await first.utils.oneinchUsdRate(params))?.rate).toBe(100);
  expect((await second.utils.oneinchUsdRate(params))?.rate).toBe(200);
  expect((await first.utils.oneinchUsdRate(params))?.rate).toBe(100);
  expect(reads[0].mock.calls.filter(([params]) => params.args[0] === weth)).toHaveLength(1);
  expect(reads[1].mock.calls.filter(([params]) => params.args[0] === weth)).toHaveLength(1);
});

test('confirmed illiquidity cannot fall back to an external price provider', async () => {
  const token = new ERC20({ chainId: 8453, symbolOrAddress: TOKEN });
  spyOn(token, 'exists').mockResolvedValue(false);
  spyOn(erc20Contract, 'network').mockReturnValue({ read: async () => 18 } as any);
  spyOn(liquidity, 'getLiquidityFilteredRate').mockResolvedValue(0n);
  const llama = spyOn(Utils.prototype, 'defillamaUsdRate').mockResolvedValue(999);
  const swap = spyOn(Utils.prototype, 'zeroXUsdRate').mockResolvedValue({ rate: 999, stableCoin: STABLE });
  expect((await token.getUsdRate()).usdRate).toBe(0);
  expect(llama).not.toHaveBeenCalled();
  expect(swap).not.toHaveBeenCalled();
});

test('a rejected reverse quote preserves a healthy filtered ETH fallback', async () => {
  const filtered = spyOn(liquidity, 'getLiquidityFilteredRate').mockImplementation(async (params) =>
    params.srcToken === STABLE.address ? 0n : 10n ** 15n,
  );
  spyOn(oneInchContract, 'network').mockReturnValue({ read: async () => 2000n * 10n ** 6n } as any);
  expect((await oneinchUsdRate({ chainId: 8453, tokenAddress: TOKEN, tokenDecimals: 18 }, new Client()))?.rate).toBe(2);
  expect(filtered).toHaveBeenCalledTimes(2);
});

test('a rejected reverse quote with no ETH fallback still blocks external providers', async () => {
  const token = new ERC20({ chainId: 8453, symbolOrAddress: TOKEN });
  spyOn(token, 'exists').mockResolvedValue(false);
  spyOn(erc20Contract, 'network').mockReturnValue({ read: async () => 18 } as any);
  const filtered = spyOn(liquidity, 'getLiquidityFilteredRate').mockImplementation(async (params) =>
    params.srcToken === STABLE.address ? 0n : undefined,
  );
  const llama = spyOn(Utils.prototype, 'defillamaUsdRate').mockResolvedValue(999);
  const swap = spyOn(Utils.prototype, 'zeroXUsdRate').mockResolvedValue({ rate: 999, stableCoin: STABLE });
  expect((await token.getUsdRate()).usdRate).toBe(0);
  expect(filtered).toHaveBeenCalledTimes(2);
  expect(llama).not.toHaveBeenCalled();
  expect(swap).not.toHaveBeenCalled();
});

test('confirmed illiquidity on the ETH fallback remains a priced zero', async () => {
  spyOn(liquidity, 'getLiquidityFilteredRate').mockImplementation(async (params) =>
    params.srcToken === STABLE.address ? undefined : 0n,
  );
  const anchor = spyOn(oneInchContract, 'network');
  expect((await oneinchUsdRate({ chainId: 8453, tokenAddress: TOKEN, tokenDecimals: 18 }))?.rate).toBe(0);
  expect(anchor).not.toHaveBeenCalled();
});

test('nested bond valuations keep an illiquid external reserve at zero', async () => {
  const token = new ERC20({ chainId: 8453, symbolOrAddress: TOKEN });
  spyOn(token, 'exists').mockResolvedValue(true);
  spyOn(token, 'getReserveToken').mockResolvedValue({ address: RESERVE, symbol: 'RES', name: 'Reserve', decimals: 18 });
  spyOn(token, 'getPriceForNextMint').mockResolvedValue(10n ** 30n);
  spyOn(bondContract, 'network').mockReturnValue({ read: async () => false } as any);
  spyOn(liquidity, 'getLiquidityFilteredRate').mockResolvedValue(0n);
  const llama = spyOn(Utils.prototype, 'defillamaUsdRate').mockResolvedValue(999);
  const swap = spyOn(Utils.prototype, 'zeroXUsdRate').mockResolvedValue({ rate: 999, stableCoin: STABLE });
  expect((await token.getUsdRate()).usdRate).toBe(0);
  expect(llama).not.toHaveBeenCalled();
  expect(swap).not.toHaveBeenCalled();
});
