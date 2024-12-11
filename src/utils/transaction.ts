import { createPublicClient, http, TransactionReceipt } from 'viem';
import { chainIdToViemChain, RPCS, SdkSupportedChainIds } from '../exports';
import { sleep } from './retry';

export async function customWaitForTransaction(chainId: SdkSupportedChainIds, tx: `0x${string}`) {
  const rpcList = RPCS.find((rpc) => rpc.id === chainId);
  const viemChain = chainIdToViemChain(chainId);
  if (!viemChain) {
    throw new Error('Chain not supported');
  }
  // default to default http transport
  let clients = [
    createPublicClient({
      chain: viemChain,
      transport: http(),
    }),
  ];

  // if we have custom rpcs defined, we use them
  if (rpcList) {
    clients = rpcList.rpcs.map((rpc) =>
      createPublicClient({
        chain: viemChain,
        transport: http(rpc),
      }),
    );
  }
  let receipt: TransactionReceipt | undefined;
  let attempts = 0;
  const MAX_TRIES = 10;

  // little buffer to make sure the transaction is mined
  await sleep(2000);
  while (!receipt && attempts < MAX_TRIES) {
    let promises: Promise<TransactionReceipt>[] = [];
    for (const client of clients) {
      promises.push(
        client.getTransactionReceipt({
          hash: tx,
        }) as unknown as Promise<TransactionReceipt>,
      );
    }

    try {
      const result = await Promise.any(promises);
      if (result.status === 'success') {
        receipt = result;
        break;
      } else {
        throw new Error('Failed to retrieve tx receipt.');
      }
    } catch (error) {
      attempts++;
      console.log('Retrying getTransaction', attempts);
      await sleep(3000);
    }
  }

  if (!receipt) {
    throw new Error('Failed to get transaction receipt');
  }

  return receipt;
}
