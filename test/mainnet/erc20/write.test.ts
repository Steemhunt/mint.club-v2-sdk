import { privateKeyToAccount } from 'viem/accounts';
import { mintclub } from '../../../src';
import { createWalletClient, http } from 'viem';
import { cyberTestnet } from 'viem/chains';
import dotenv from 'dotenv';

dotenv.config();

const PKEY = process.env.PKEY as `0x${string}` | undefined;

if (PKEY) {
  (globalThis as any).window = {};

  const wallet = privateKeyToAccount(PKEY);

  const walletClient = createWalletClient({
    transport: http(),
    chain: cyberTestnet,
    account: wallet,
  });

  await mintclub
    .withWalletClient(walletClient as any)
    .network('cybertestnet')
    .token('rrr')
    .buyWithZap({
      amount: 1n,
      onSuccess: (data) => {
        console.log(data);
      },
      debug: (args) => {
        console.log(args);
      },
      onError: (error) => {
        console.log(error);
      },
    });
}
