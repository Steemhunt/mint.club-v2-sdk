import { describe, expect, test } from 'bun:test';
import hre from 'hardhat';
import { TransactionReceipt, checksumAddress } from 'viem';
import { hardhat } from 'viem/chains';
import { mintclub as sdk } from '../../src';
import { MAX_STEPS, PROTOCOL_BENEFICIARY, wei } from '../utils';

process.env.NODE_ENV = 'hardhat';

const publicClient = await hre.viem.getPublicClient();

// first wallet is used automatically to deploy
const [_deployer, alice, bob] = await hre.viem.getWalletClients();

const TokenImplementation = await hre.viem.deployContract('MCV2_Token');
const NFTImplementation = await hre.viem.deployContract('MCV2_MultiToken');

describe('Hardhat ERC20', async () => {
  // 1. setup
  const Bond = await hre.viem.deployContract('MCV2_Bond', [
    checksumAddress(TokenImplementation.address),
    checksumAddress(NFTImplementation.address),
    checksumAddress(PROTOCOL_BENEFICIARY),
    0n,
    MAX_STEPS.base,
  ]);

  const contract = await hre.viem.getContractAt('MCV2_Bond', Bond.address);

  // @ts-ignore
  const ReserveToken = await hre.viem.deployContract('TestToken', [wei(200000000, 9), 'Test Token', 'TEST', 18n]); // supply: 200M

  global.mcv2Hardhat = {
    BOND: {
      [hardhat.id]: contract.address,
    },
  };

  const mintclub = sdk.withPublicClient(publicClient);

  function assertTxSignature() {
    expect().pass();
  }

  function assertTxSuccess(receipt: TransactionReceipt) {
    expect(receipt.status).toEqual('success');
  }

  // 2. test

  test(`Read Alice's balance`, async () => {
    const balance = await mintclub.withWalletClient(alice).getNativeBalance();
    expect(balance).toEqual(10000000000000000000000n);
  });

  test(`Read Bob's balance`, async () => {
    const balance = await mintclub.withWalletClient(bob).getNativeBalance();
    expect(balance).toEqual(10000000000000000000000n);
  });

  test(`Alice creates a new ERC20 called ALICE with basic curveData`, async () => {
    await mintclub.token('ALICE').create({
      name: 'Alice Token',
      reserveToken: {
        address: ReserveToken.address,
        decimals: 18,
      },
      curveData: {
        curveType: 'LINEAR',
        stepCount: 10,
        maxSupply: 10000,
        creatorAllocation: 1,
        initialMintingPrice: 0.01,
        finalMintingPrice: 1,
      },
      debug: (simulationArgs: any) => {
        const { args, functionName, address } = simulationArgs;
        const [{ name, symbol }, { mintRoyalty, burnRoyalty, reserveToken, maxSupply, stepRanges, stepPrices }] = args;
        expect(name).toEqual('Alice Token');
        expect(symbol).toEqual('ALICE');

        expect(functionName).toEqual('createToken');

        expect(address).toEqual(Bond.address);
        expect(reserveToken).toEqual(ReserveToken.address);
        expect(maxSupply).toEqual(wei(10000, 18));

        expect(stepRanges[0]).toEqual(wei(1, 18));
        expect(stepPrices[0]).toEqual(0n);

        expect(stepRanges[stepRanges.length - 1]).toEqual(wei(10000, 18));
        expect(stepPrices[stepPrices.length - 1]).toEqual(wei(1, 18));

        expect(mintRoyalty).toEqual(30); // default 0.03%
        expect(burnRoyalty).toEqual(30); // default 0.03%
      },
      onRequestSignature: assertTxSignature,
      onSuccess: assertTxSuccess,
    });
  });
});
