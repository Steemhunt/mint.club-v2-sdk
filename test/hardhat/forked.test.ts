import { expect } from 'chai';
import dotenv from 'dotenv';
import hre from 'hardhat';
import { TransactionReceipt, getAddress, maxUint256 } from 'viem';
import { mainnet } from 'viem/chains';
import { TOKENS, getMintClubContractAddress, mintclub as sdk } from '../../src';
import { BondInsufficientAllowanceError } from '../../src/errors/sdk.errors';
import { computeCreate2Address } from '../../src/utils/addresses';
import { wei } from '../utils';
dotenv.config();

// locally run hardhat node first

const publicClient = await hre.viem.getPublicClient({
  chain: mainnet,
});
const [alice, bob] = await hre.viem.getWalletClients({
  chain: mainnet,
});

describe('Hardhat ERC20', async () => {
  const mintclub = sdk.withPublicClient(publicClient);
  const Bond = {
    address: getMintClubContractAddress('BOND', mainnet.id),
  };

  const WETH = TOKENS[mainnet.id]['0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2'];

  function assertTxSignature() {
    expect(true).equal(true);
  }

  function assertTxSuccess(receipt: TransactionReceipt) {
    expect(receipt.status).equal('success');
  }
  const wethABI = [
    {
      inputs: [],
      name: 'deposit',
      outputs: [],
      stateMutability: 'payable',
      type: 'function',
    },
  ] as const;

  // wrap 10 ETH for alice and bob
  const wrapTx1 = await alice.writeContract({
    abi: wethABI,
    address: WETH.address,
    functionName: 'deposit',
    value: wei(10, 18),
  });

  const wrapTx2 = await bob.writeContract({
    abi: wethABI,
    address: WETH.address,
    functionName: 'deposit',
    value: wei(10, 18),
  });

  await publicClient.waitForTransactionReceipt({
    hash: wrapTx1,
  });
  await publicClient.waitForTransactionReceipt({
    hash: wrapTx2,
  });

  // 2. test

  const WONDERLAND_TOKEN_CURVE = {
    name: 'Alice Token',
    symbol: 'WONDERLAND',
    reserveToken: {
      address: WETH.address,
      decimals: 18,
    },
    curveData: {
      curveType: 'LINEAR',
      stepCount: 10,
      maxSupply: 10_000,
      creatorAllocation: 1,
      initialMintingPrice: 0.01,
      finalMintingPrice: 1,
    },
  } as const;

  const BOB_TOKEN_STEP = {
    name: 'Bob Token',
    symbol: 'BOB',
    reserveToken: {
      address: WETH.address,
      decimals: 18,
    },
    stepData: [
      { rangeTo: 100, price: 1 },
      { rangeTo: 1000, price: 2 },
      { rangeTo: 10000, price: 3 },
    ],
  };

  const wonderlandTokenAddress = computeCreate2Address(mainnet.id, 'ERC20', WONDERLAND_TOKEN_CURVE.symbol);

  describe('basic curveData', async () => {
    test(`Read Bob's WETH balance`, async () => {
      const balance = await mintclub.withWalletClient(bob).token(WETH.address).getBalanceOf(bob.account.address);
      expect(balance).equal(wei(10, 18));
    });

    test(`Alice creates a new ERC20 called ALICE with basic linear curve`, async () => {
      await mintclub
        .withWalletClient(alice)
        .token(WONDERLAND_TOKEN_CURVE.symbol)
        .create({
          ...WONDERLAND_TOKEN_CURVE,
          debug: (simulationArgs: any) => {
            const { args, functionName, address } = simulationArgs;
            const [{ name, symbol }, { mintRoyalty, burnRoyalty, reserveToken, maxSupply, stepRanges, stepPrices }] =
              args;
            expect(name).equal(WONDERLAND_TOKEN_CURVE.name);
            expect(symbol).equal(WONDERLAND_TOKEN_CURVE.symbol);

            expect(functionName).equal('createToken');

            expect(address).equal(Bond.address);
            expect(reserveToken).equal(WETH.address);
            expect(maxSupply).equal(wei(10000, 18));

            expect(stepRanges[0]).equal(wei(1, 18));
            expect(stepPrices[0]).equal(0n);

            expect(stepRanges[stepRanges.length - 1]).equal(wei(10000, 18));
            expect(stepPrices[stepPrices.length - 1]).equal(wei(1, 18));

            expect(mintRoyalty).equal(30); // default 0.03%
            expect(burnRoyalty).equal(30); // default 0.03%
          },
          onSignatureRequest: assertTxSignature,
          onSuccess: assertTxSuccess,
        });
    });

    test(`Check if ${WONDERLAND_TOKEN_CURVE.symbol} token is created`, async () => {
      const exists = await mintclub.token(wonderlandTokenAddress).exists();
      expect(exists).equal(true);
    });

    test(`Check if ${WONDERLAND_TOKEN_CURVE.symbol} token has correct data`, async () => {
      const { reserveToken, burnRoyalty, mintRoyalty, creator } = await mintclub
        .token(wonderlandTokenAddress)
        .getTokenBond();
      expect(getAddress(reserveToken, mainnet.id)).equal(getAddress(WETH.address, mainnet.id));
      expect(burnRoyalty).equal(30);
      expect(mintRoyalty).equal(30);
      expect(getAddress(creator, mainnet.id)).equal(getAddress(alice.account.address, mainnet.id));
    });

    test(`Check Alice's creator allocation of 1 ${WONDERLAND_TOKEN_CURVE.symbol}`, async () => {
      const balance = await mintclub.token(wonderlandTokenAddress).getBalanceOf(alice.account.address);
      // 1 creator free minting
      expect(balance).equal(wei(1, 18));
    });

    test(`Alice tries to buy 10 more ${WONDERLAND_TOKEN_CURVE.symbol}, but did not approve the BondContract`, async () => {
      await mintclub
        .withWalletClient(alice)
        .token(wonderlandTokenAddress)
        .buy({
          amount: wei(10, 18),
          onError: (e: any) => {
            expect(e).instanceOf(BondInsufficientAllowanceError);
          },
        });
    });

    test(`So she approves it`, async () => {
      await mintclub
        .withWalletClient(alice)
        .token(wonderlandTokenAddress)
        .approve({
          tradeType: 'buy',
          onSignatureRequest: assertTxSignature,
          onSuccess: assertTxSuccess,
          debug: (simulation) => {
            const {
              args: [, amountApproved],
            } = simulation;
            expect(amountApproved).equal(maxUint256);
          },
          onError: (e: any) => {
            expect(e).instanceOf(BondInsufficientAllowanceError);
          },
        });
    });

    test(`Bond contract's allowance for her reserveToken is maxUint256 now`, async () => {
      const allowance = await mintclub.withWalletClient(alice).token(WETH.address).getAllowance({
        owner: alice.account.address,
        spender: Bond.address,
      });
      expect(allowance).equal(maxUint256);
    });

    test(`Before she buys, token mint price is 0.01`, async () => {
      const price = await mintclub.token(wonderlandTokenAddress).getPriceForNextMint();
      expect(price).equal(wei(1, 16));
    });

    test(`She tries to buy 1000 tokens now`, async () => {
      await mintclub
        .withWalletClient(alice)
        .token(wonderlandTokenAddress)
        .buy({
          amount: wei(1000, 18),
          onSignatureRequest: assertTxSignature,
          onSuccess: assertTxSuccess,
        });
    });

    test(`It goes through, and now she has 1,001 ${WONDERLAND_TOKEN_CURVE.symbol}`, async () => {
      const balance = await mintclub.token(wonderlandTokenAddress).getBalanceOf(alice.account.address);
      expect(balance).equal(wei(1001, 18));
    });

    test(`Bob has no tokens. He's sad`, async () => {
      const balance = await mintclub.token(wonderlandTokenAddress).getBalanceOf(bob.account.address);
      expect(balance).equal(0n);
    });

    test(`She gives one to bob`, async () => {
      await mintclub.token(wonderlandTokenAddress).transfer({
        recipient: bob.account.address,
        amount: wei(1, 18),
        onSignatureRequest: assertTxSignature,
        onSuccess: assertTxSuccess,
      });
    });

    test(`Bob is happy now`, async () => {
      const balance = await mintclub.token(wonderlandTokenAddress).getBalanceOf(bob.account.address);
      expect(balance).equal(wei(1, 18));
    });

    test(`Now the token mint price is 0.12`, async () => {
      const price = await mintclub.token(wonderlandTokenAddress).getPriceForNextMint();
      expect(price).equal(wei(12, 16));
    });

    test(`Bob feels thankful and he buys a 1,000 too`, async () => {
      await mintclub
        .withWalletClient(bob)
        .token(wonderlandTokenAddress)
        .approve({
          tradeType: 'buy',
          onSignatureRequest: assertTxSignature,
          onSuccess: assertTxSuccess,
          debug: (simulation) => {
            const {
              args: [, amountApproved],
            } = simulation;
            expect(amountApproved).equal(maxUint256);
          },
        });

      await mintclub
        .withWalletClient(bob)
        .token(wonderlandTokenAddress)
        .buy({
          amount: wei(1000, 18),
          onSignatureRequest: assertTxSignature,
          onSuccess: assertTxSuccess,
        });
    });

    test(`Now the token mint price is 0.23`, async () => {
      const price = await mintclub.token(wonderlandTokenAddress).getPriceForNextMint();
      expect(price).equal(wei(23, 16));
    });

    test(`Alice approves Bond to use her token`, async () => {
      await mintclub.withWalletClient(alice).token(wonderlandTokenAddress).approve({
        tradeType: 'sell',
        onSignatureRequest: assertTxSignature,
        onSuccess: assertTxSuccess,
      });
    });

    test(`Alice stabs Bob in the back and sells 500 ${WONDERLAND_TOKEN_CURVE.symbol}`, async () => {
      await mintclub
        .withWalletClient(alice)
        .token(wonderlandTokenAddress)
        .sell({
          amount: wei(500, 18),
          onSignatureRequest: assertTxSignature,
          onSuccess: assertTxSuccess,
        });
    });

    test(`Now the token mint price is down to 0.12`, async () => {
      const price = await mintclub.token(wonderlandTokenAddress).getPriceForNextMint();
      expect(price).equal(wei(12, 16));
    });

    test(`Alice now has 500 ${WONDERLAND_TOKEN_CURVE.symbol}`, async () => {
      const balance = await mintclub.token(wonderlandTokenAddress).getBalanceOf(alice.account.address);
      expect(balance).equal(wei(500, 18));
    });
  });

  describe('stepData', async () => {
    test(`Bob creates a new ERC20 called BOB with stepData`, async () => {
      await mintclub
        .withWalletClient(bob)
        .token(BOB_TOKEN_STEP.symbol)
        .create({
          ...BOB_TOKEN_STEP,
          debug: (simulationArgs: any) => {
            const { args, functionName, address } = simulationArgs;
            const [{ name, symbol }, { mintRoyalty, burnRoyalty, reserveToken, stepRanges, stepPrices }] = args;
            expect(name).equal(BOB_TOKEN_STEP.name);
            expect(symbol).equal(BOB_TOKEN_STEP.symbol);

            expect(functionName).equal('createToken');

            expect(address).equal(Bond.address);
            expect(reserveToken).equal(WETH.address);

            expect(stepRanges[0]).equal(wei(100, 18));
            expect(stepPrices[0]).equal(wei(1, 18));

            expect(stepRanges[1]).equal(wei(1000, 18));
            expect(stepPrices[1]).equal(wei(2, 18));

            expect(stepRanges[2]).equal(wei(10000, 18));
            expect(stepPrices[2]).equal(wei(3, 18));

            expect(mintRoyalty).equal(30); // default 0.03%
            expect(burnRoyalty).equal(30); // default 0.03%
          },
          onSignatureRequest: assertTxSignature,
          onSuccess: assertTxSuccess,
        });
    });

    test(`Check if ${BOB_TOKEN_STEP.symbol} token is created`, async () => {
      const exists = await mintclub.token(computeCreate2Address(mainnet.id, 'ERC20', BOB_TOKEN_STEP.symbol)).exists();
      expect(exists).equal(true);
    });

    test(`Check if ${BOB_TOKEN_STEP.symbol} token has correct data`, async () => {
      const { reserveToken, burnRoyalty, mintRoyalty, creator } = await mintclub
        .token(computeCreate2Address(mainnet.id, 'ERC20', BOB_TOKEN_STEP.symbol))
        .getTokenBond();
      expect(getAddress(reserveToken, mainnet.id)).equal(getAddress(WETH.address, mainnet.id));
      expect(burnRoyalty).equal(30);
      expect(mintRoyalty).equal(30);
      expect(getAddress(creator, mainnet.id)).equal(getAddress(bob.account.address, mainnet.id));
    });
  });
});
