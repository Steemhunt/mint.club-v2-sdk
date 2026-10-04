import { afterEach, expect, mock, spyOn, test } from 'bun:test';
import { PublicClient, TransactionReceipt, WalletClient } from 'viem';
import { base } from 'viem/chains';
import { Client } from '../src/helpers/ClientHelper';
import { bondContract } from '../src/contracts';
import * as transaction from '../src/utils/transaction';

const ADDRESS = '0x1111111111111111111111111111111111111111';
const TX = `0x${'01'.repeat(32)}` as const;

afterEach(() => mock.restore());

test('the first contract write continues after connecting the wallet', async () => {
  const client = new Client();
  client.disconnect();
  const writeContract = mock(async () => TX);
  spyOn(client, 'connect').mockImplementation(async () => {
    client.withWalletClient({ account: { address: ADDRESS }, chain: base, writeContract } as unknown as WalletClient);
    return ADDRESS;
  });
  const simulateContract = mock(async () => ({ request: { account: ADDRESS } }));
  client.withPublicClient({ chain: base, simulateContract } as unknown as PublicClient);
  const receipt = { status: 'success', transactionHash: TX } as TransactionReceipt;
  spyOn(transaction, 'customWaitForTransaction').mockResolvedValue(receipt);
  const onSuccess = mock();
  expect(
    await bondContract.network('base', client).write({ functionName: 'claimRoyalties', args: [ADDRESS], onSuccess }),
  ).toBe(receipt);
  expect(simulateContract).toHaveBeenCalledTimes(1);
  expect(writeContract).toHaveBeenCalledTimes(1);
  expect(onSuccess).toHaveBeenCalledWith(receipt);
});
