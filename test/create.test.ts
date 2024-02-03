import { describe, test } from 'bun:test';
import { bondContract } from '../src';

describe('Bond contract', () => {
  test('Create a new token', async () => {
    await bondContract.network('sepolia').createToken({
      tokenType: 'ERC20',
      name: 'Baby Token',
      symbol: 'BABY',
      mintRoyalty: 1, // 1%
      burnRoyalty: 1.5, // 1.5%
      reserveToken: {
        address: '0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14', // WETH
        decimals: 18,
      },
      maxSupply: 10_000_000, // supply: 10M
      creatorAllocation: 10_000,
      stepData: [
        { x: 100000, y: 2 },
        { x: 200000, y: 3 },
        { x: 500000, y: 4 },
        { x: 1000000, y: 5 },
        { x: 2000000, y: 7 },
        { x: 5000000, y: 10 },
        { x: 10000000, y: 15 },
      ],

      onError: (error) => {
        console.dir(error);
      },
      onSuccess: (txHash) => {
        console.log(txHash);
      },
      onRequestSignature: () => {
        console.log('signature');
      },
      onSigned: (txHash) => {
        console.log(txHash);
      },
    });
  });
});
