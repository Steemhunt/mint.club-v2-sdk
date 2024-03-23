import { describe, test } from 'bun:test';
import { mintclub } from '../../../src';

describe('Wallet test', () => {
  test(`Private key`, async () => {
    await mintclub
      .network('sepolia')
      .withPrivateKey(process.env.PRIVATE_KEY as `0x${string}`)
      .token('TESTING')
      .create({
        name: 'yoooooooooooooo',
        // Base Network WETH
        reserveToken: {
          address: '0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14',
          decimals: 18,
        },
        // Bonding curve data
        curveData: {
          curveType: 'EXPONENTIAL',
          stepCount: 5, // how granular the curve is
          maxSupply: 10_000, // token max supply
          initialMintingPrice: 0.01, // starting price, 0.01 WETH
          finalMintingPrice: 0.1, // ending price, 0.1 WETH
        },
        onSigned(tx) {
          console.log(tx);
        },
        debug: (args) => {
          // console.log(args);
        },
        onSuccess(tx) {
          console.log(tx);
        },
        onError: (e) => {
          console.log(e);
        },
      });
  });
});
