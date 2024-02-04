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
        { rangeTo: 100000, price: 2 },
        { rangeTo: 200000, price: 3 },
        { rangeTo: 500000, price: 4 },
        { rangeTo: 1000000, price: 5 },
        { rangeTo: 2000000, price: 7 },
        { rangeTo: 5000000, price: 10 },
        { rangeTo: 10000000, price: 15 },
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
