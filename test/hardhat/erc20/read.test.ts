import { describe, expect, test } from 'bun:test';
import hre from 'hardhat';
import { base } from 'viem/chains';
import { mintclub as sdk } from '../../../src';
import { TokenAlreadyExistsError } from '../../../src/errors/sdk.errors';

const publicClient = await hre.viem.getPublicClient({
  chain: base,
});

const [alice, bob] = await hre.viem.getWalletClients({
  chain: base,
});

describe('Hardhat ERC20', async () => {
  const mintclub = sdk.withPublicClient(publicClient).withWalletClient(alice);

  test(`Read Alice's balance`, async () => {
    const balance = await mintclub.getNativeBalance();
    expect(balance).toEqual(10000000000000000000000n);
  });

  test(`Read a deployed CHICKEN token on base chain`, async () => {
    const maxSupply = await mintclub.token('CHICKEN').getMaxSupply();
    expect(maxSupply).toEqual(82000000000000000000000000000n);
  });

  return;

  test(`Alice can't create a new token named CHICKEN since it exists`, async () => {
    await mintclub.token('CHICKEN').create({
      name: 'CHICKEN',
      reserveToken: {
        address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2', // mainnet WETH token address
        decimals: 18,
      },
      curveData: {
        curveType: 'LINEAR',
        stepCount: 10,
        maxSupply: 10_000,
        initialMintingPrice: 0.01, // 0.01 WETH
        finalMintingPrice: 0.1, // 0.1 WETH
        creatorAllocation: 100,
      },
      onError: (error) => {
        expect(error).toBeInstanceOf(TokenAlreadyExistsError);
      },
    });
  });

  test(`So, Alice creates a new ERC20 called JOKBAL`, async () => {
    await mintclub.token('JOKBAL').create({
      name: 'JOKBAL',
      reserveToken: {
        address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2', // mainnet WETH token address
        decimals: 18,
      },
      curveData: {
        curveType: 'LINEAR',
        stepCount: 10,
        maxSupply: 10_000,
        initialMintingPrice: 0.01, // 0.01 WETH
        finalMintingPrice: 0.1, // 0.1 WETH
        creatorAllocation: 100,
      },
      onError: (error) => {
        expect(error).toBeInstanceOf(TokenAlreadyExistsError);
      },
    });
  });

  test(`Alice creates a new ERC20 called JOKBAL`, async () => {
    await mintclub
      .withPublicClient(publicClient)
      .withWalletClient(alice)
      .token('CHICKEN')
      .create({
        name: 'CHICKEN',
        reserveToken: {
          address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2', // mainnet WETH token address
          decimals: 18,
        },
        curveData: {
          curveType: 'LINEAR',
          stepCount: 10,
          maxSupply: 10_000,
          initialMintingPrice: 0.01, // 0.01 WETH
          finalMintingPrice: 0.1, // 0.1 WETH
          creatorAllocation: 100,
        },
        onError: (error) => {
          expect(error).toBeInstanceOf(TokenAlreadyExistsError);
        },
      });
  });
});
