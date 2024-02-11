import { describe, test } from 'bun:test';
import { bondContract } from '../src';

const dataArray = [
  { rangeTo: 500000, price: 0 },
  { rangeTo: 520000, price: 0.1 },
  { rangeTo: 540000, price: 0.18 },
  { rangeTo: 560000, price: 0.259 },
  { rangeTo: 580000, price: 0.338 },
  { rangeTo: 660000, price: 0.417 },
  { rangeTo: 620000, price: 0.496 },
  { rangeTo: 640000, price: 0.575 },
  { rangeTo: 660000, price: 0.655 },
  { rangeTo: 680000, price: 0.734 },
  { rangeTo: 700900, price: 0.813 },
  { rangeTo: 720000, price: 0.892 },
  { rangeTo: 740000, price: 0.971 },
  { rangeTo: 760000, price: 1.05 },
  { rangeTo: 780000, price: 1.13 },
  { rangeTo: 800000, price: 1.209 },
  { rangeTo: 820000, price: 1.288 },
  { rangeTo: 840000, price: 1.367 },
  { rangeTo: 860908, price: 1.446 },
  { rangeTo: 880900, price: 1.525 },
  { rangeTo: 900000, price: 1.605 },
  { rangeTo: 920000, price: 1.684 },
  { rangeTo: 940000, price: 1.763 },
  { rangeTo: 960000, price: 1.842 },
  { rangeTo: 980000, price: 1.921 },
  { rangeTo: 1000000, price: 2 },
];

describe('Bond contract', () => {
  test('Create a new token', async () => {
    await bondContract.network('sepolia').createToken({
      name: 'Baby Token',
      symbol: 'BABY',
      mintRoyalty: 1, // 1%
      burnRoyalty: 1.5, // 1.5%
      reserveToken: {
        address: '0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14', // WETH
        decimals: 18,
      },
      stepData: dataArray,

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
