import { afterEach, expect, mock, spyOn, test } from 'bun:test';
import { ERC20 } from '../src/helpers/ERC20Helper';
import { Token } from '../src/helpers/TokenHelper';
import { Airdrop } from '../src/helpers/AirdropHelper';
import { Client } from '../src/helpers/ClientHelper';
import { Ipfs } from '../src/helpers/IpfsHelper';
import { Utils } from '../src/helpers/UtilsHelper';
import { bondContract, erc20Contract, zapContract } from '../src/contracts';

const ADDRESS = '0x1111111111111111111111111111111111111111';
const RESERVE = '0x2222222222222222222222222222222222222222';
const token = () => new ERC20({ chainId: 8453, symbolOrAddress: ADDRESS });
const receipt = { status: 'success' } as const;
afterEach(() => mock.restore());

for (const trade of ['buy', 'sell', 'sellWithZap'] as const) {
  test(`${trade} stops after an unsuccessful approval`, async () => {
    spyOn(Client.prototype, 'account').mockResolvedValue(ADDRESS);
    spyOn(Token.prototype, 'getBuyEstimation').mockResolvedValue([10000n, 0n]);
    spyOn(Token.prototype, 'getSellEstimation').mockResolvedValue([10000n, 0n]);
    spyOn(Token.prototype, 'bondContractApproved').mockResolvedValue(false);
    const approval = spyOn(Token.prototype as any, 'approveBond').mockResolvedValue(undefined);
    const write = mock();
    spyOn(bondContract, 'network').mockReturnValue({ write } as any);
    spyOn(zapContract, 'network').mockReturnValue({ write } as any);
    expect(await token()[trade]({ amount: 5n })).toBeUndefined();
    expect(approval).toHaveBeenCalledTimes(1);
    expect(write).not.toHaveBeenCalled();
  });
}

for (const trade of ['buy', 'sell', 'buyWithZap', 'sellWithZap'] as const) {
  test(`${trade} accepts fractional percentage slippage without a floating-point BigInt error`, async () => {
    spyOn(Client.prototype, 'account').mockResolvedValue(ADDRESS);
    spyOn(Token.prototype, 'getBuyEstimation').mockResolvedValue([10000n, 0n]);
    spyOn(Token.prototype, 'getSellEstimation').mockResolvedValue([10000n, 0n]);
    spyOn(Token.prototype, 'bondContractApproved').mockResolvedValue(true);
    const write = mock(async () => receipt);
    spyOn(bondContract, 'network').mockReturnValue({ write } as any);
    spyOn(zapContract, 'network').mockReturnValue({ write } as any);
    const onError = mock();
    expect(await token()[trade]({ amount: 5n, slippage: 0.29, onError })).toBe(receipt as any);
    const params = write.mock.calls[0][0] as any;
    const limit = trade === 'buyWithZap' ? params.value : params.args[2];
    expect(limit).toBe(trade.startsWith('buy') ? 10029n : 9971n);
    expect(onError).not.toHaveBeenCalled();
  });
}

test('sell checks the amount being sold even when the requested approval amount is smaller', async () => {
  spyOn(Client.prototype, 'account').mockResolvedValue(ADDRESS);
  spyOn(Token.prototype, 'getSellEstimation').mockResolvedValue([100n, 0n]);
  const approved = spyOn(Token.prototype, 'bondContractApproved').mockResolvedValue(true);
  spyOn(bondContract, 'network').mockReturnValue({ write: mock(async () => receipt) } as any);
  await token().sell({ amount: 5n, allowanceAmount: 1n });
  expect(approved).toHaveBeenCalledWith({ walletAddress: ADDRESS, amountToSpend: 5n, tradeType: 'sell' });
});

test('token airdrop creation preserves the final transaction callbacks', async () => {
  spyOn(Token.prototype as any, 'contractIsApproved').mockResolvedValue(true);
  spyOn(erc20Contract, 'network').mockReturnValue({ read: async () => 18 } as any);
  spyOn(Ipfs.prototype, 'add').mockResolvedValue('test-cid');
  const create = spyOn(Airdrop.prototype, 'createAirdrop').mockResolvedValue(receipt as any);
  const onSuccess = mock();
  const onError = mock();
  const onSigned = mock();
  await token().createAirdrop({
    title: 'Test',
    wallets: [ADDRESS],
    amountPerClaim: 1,
    endTime: new Date(),
    filebaseApiKey: 'test-key',
    onSuccess,
    onError,
    onSigned,
  });
  expect(create.mock.calls[0][0]).toMatchObject({ onSuccess, onError, onSigned });
});

test('historical bond prices use the requested block', async () => {
  const asset = token();
  const exists = spyOn(asset, 'exists').mockResolvedValue(true);
  spyOn(asset, 'getReserveUsdRate').mockResolvedValue({
    usdRate: 2,
    reserveToken: { address: RESERVE, name: 'Reserve', symbol: 'RES', decimals: 18 },
    path: [],
  });
  const price = spyOn(asset, 'getPriceForNextMint').mockResolvedValue(3n * 10n ** 18n);
  expect((await asset.getUsdRate({ amount: 2, blockNumber: 123n })).usdRate).toBe(12);
  expect(exists).toHaveBeenCalledWith({ blockNumber: 123n });
  expect(price).toHaveBeenCalledWith({ blockNumber: 123n });
});

test('a zero bond quote stays valid instead of falling through to an unrelated quote', async () => {
  const asset = token();
  spyOn(asset, 'exists').mockResolvedValue(true);
  spyOn(asset, 'getReserveUsdRate').mockResolvedValue({
    usdRate: 2,
    reserveToken: { address: RESERVE, name: 'Reserve', symbol: 'RES', decimals: 18 },
    path: [],
  });
  spyOn(asset, 'getPriceForNextMint').mockResolvedValue(0n);
  expect((await asset.getUsdRate()).usdRate).toBe(0);
});

test('Kaia live prices scale with amount and historical queries skip Swapscanner', async () => {
  const asset = new ERC20({ chainId: 8217, symbolOrAddress: ADDRESS });
  const swap = spyOn(Utils.prototype, 'getSwapscannerPrice').mockResolvedValue(3);
  expect((await asset.getUsdRate({ amount: 4 })).usdRate).toBe(12);
  spyOn(Utils.prototype, 'getTimestampFromBlock').mockResolvedValue(123);
  const llama = spyOn(Utils.prototype, 'defillamaUsdRate').mockResolvedValue(2);
  expect((await asset.getUsdRate({ amount: 4, blockNumber: 100n })).usdRate).toBe(8);
  expect(swap).toHaveBeenCalledTimes(1);
  expect(llama).toHaveBeenCalledWith({ chainId: 8217, tokenAddress: ADDRESS, timestamp: 123 });
});

test("a missing historical block never reuses a live quote as yesterday's price", async () => {
  const asset = token();
  const usd = spyOn(asset, 'getUsdRate').mockResolvedValue({ usdRate: 5, reserveToken: null, path: [] } as any);
  spyOn(Utils.prototype, 'getBlockNumber').mockResolvedValue(undefined);
  spyOn(Utils.prototype, 'defillamaUsdRate').mockResolvedValue(undefined);
  const result = await asset.get24HoursUsdRate();
  expect(result.currentUsdRate).toBe(5);
  expect(result.previousUsdRate).toBeNull();
  expect(result.changePercent).toBeNull();
  expect(usd).toHaveBeenCalledTimes(1);
});

test('token airdrops stop after failed approval before uploading the whitelist', async () => {
  spyOn(Token.prototype as any, 'contractIsApproved').mockResolvedValue(false);
  spyOn(Token.prototype as any, 'approveContract').mockResolvedValue(undefined);
  spyOn(erc20Contract, 'network').mockReturnValue({ read: async () => 18 } as any);
  const upload = spyOn(Ipfs.prototype, 'add').mockResolvedValue('test-cid');
  const create = spyOn(Airdrop.prototype, 'createAirdrop').mockResolvedValue(receipt as any);
  expect(
    await token().createAirdrop({
      title: 'Test',
      wallets: [ADDRESS],
      amountPerClaim: 1,
      endTime: new Date(),
      filebaseApiKey: 'test-key',
    }),
  ).toBeUndefined();
  expect(upload).not.toHaveBeenCalled();
  expect(create).not.toHaveBeenCalled();
});
