import { afterEach, expect, mock, spyOn, test } from 'bun:test';
import { ERC20 } from '../src/helpers/ERC20Helper';
import { Utils } from '../src/helpers/UtilsHelper';
import { bondContract, erc20Contract, oneInchContract } from '../src/contracts';
import { STABLE_COINS, WETH_ADDRESSES } from '../src/utils/usd-rate/common';
import { oneinchUsdRate } from '../src/utils/usd-rate/oneinch';

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
