import { PublicClient } from 'viem';

export async function customWaitForTransaction(client: PublicClient, transactionHash: `0x${string}`) {
  let receipt;
  try {
    receipt = await client.waitForTransactionReceipt({ hash: transactionHash, checkReplacement: false });
  } catch (cause) {
    throw Object.assign(new Error('Transaction was submitted, but its outcome could not be confirmed', { cause }), {
      transactionHash,
      status: 'unconfirmed' as const,
    });
  }

  if (receipt.status === 'reverted') {
    throw Object.assign(new Error('Transaction reverted'), { transactionHash, status: 'reverted' as const, receipt });
  }
  return receipt;
}
