import { expect, mock, test } from 'bun:test';
import { createPublicClient, custom, PublicClient } from 'viem';
import { base } from 'viem/chains';
import { MintClubSDK } from '../src';
import { customWaitForTransaction } from '../src/utils/transaction';

const hash = `0x${'11'.repeat(32)}` as const;
const account = '0x1111111111111111111111111111111111111111';
const receipt = { transactionHash: hash, status: 'success' } as const;

for (const outcome of ['success', 'reverted', 'timeout', 'rpc'] as const) {
  test(`writes retain configured-client callbacks and classify ${outcome}`, async () => {
    const wait = mock(async () => {
      if (outcome === 'timeout' || outcome === 'rpc') throw new Error(outcome);
      return { ...receipt, status: outcome };
    });
    const write = mock(async () => hash);
    const sdk = new MintClubSDK()
      .withPublicClient({
        chain: base,
        simulateContract: async () => ({ request: {} }),
        waitForTransactionReceipt: wait,
      } as unknown as PublicClient)
      .withWalletClient({ chain: base, account: { address: account }, writeContract: write } as any);
    const onSuccess = mock();
    const onError = mock();
    const onSigned = mock();
    const onSignatureRequest = mock();
    const result = await sdk
      .network('base')
      .token('TEST')
      .approve({ spender: account, amount: 1n, onSuccess, onError, onSigned, onSignatureRequest });
    expect(write).toHaveBeenCalledTimes(1);
    expect(onSigned).toHaveBeenCalledWith(hash);
    expect(onSignatureRequest).toHaveBeenCalledTimes(1);
    expect(wait).toHaveBeenCalledWith({ hash, checkReplacement: false });
    if (outcome === 'success') {
      expect(result).toEqual(receipt);
      expect(onSuccess).toHaveBeenCalledWith(receipt);
      expect(onError).not.toHaveBeenCalled();
    } else {
      expect(result).toBeUndefined();
      expect(onSuccess).not.toHaveBeenCalled();
      expect(onError.mock.calls[0][0]).toMatchObject({
        transactionHash: hash,
        status: outcome === 'reverted' ? 'reverted' : 'unconfirmed',
      });
    }
  });
}

test('the native waiter polls pending receipts until success without replacement tracking', async () => {
  let attempts = 0;
  const client = createPublicClient({
    chain: base,
    pollingInterval: 1,
    transport: custom({
      request: async ({ method }) => {
        if (method === 'eth_blockNumber') return '0x10';
        if (method === 'eth_getTransactionReceipt') {
          if (++attempts === 1) return null;
          return {
            ...receipt,
            status: '0x1',
            blockNumber: '0x10',
            transactionIndex: '0x0',
            cumulativeGasUsed: '0x1',
            gasUsed: '0x1',
            effectiveGasPrice: '0x1',
            logs: [],
            type: '0x2',
          };
        }
        throw new Error(`Unexpected method ${method}`);
      },
    }),
  });
  expect((await customWaitForTransaction(client, hash)).status).toBe('success');
  expect(attempts).toBeGreaterThan(1);
});

test('a rejected signature retains pre-submission error behavior without a submitted hash', async () => {
  const rejected = new Error('User rejected the signature');
  const waiter = mock();
  const sdk = new MintClubSDK()
    .withPublicClient({
      chain: base,
      simulateContract: async () => ({ request: {} }),
      waitForTransactionReceipt: waiter,
    } as unknown as PublicClient)
    .withWalletClient({
      chain: base,
      account: { address: account },
      writeContract: async () => {
        throw rejected;
      },
    } as any);
  const onError = mock();
  const onSigned = mock();
  expect(
    await sdk.network('base').token('TEST').approve({ spender: account, amount: 1n, onError, onSigned }),
  ).toBeUndefined();
  expect(onError).toHaveBeenCalledWith(rejected);
  expect(rejected).not.toHaveProperty('transactionHash');
  expect(waiter).not.toHaveBeenCalled();
  expect(onSigned).not.toHaveBeenCalled();
});
