import { beforeEach, describe, expect, test } from 'bun:test';
import hre from 'hardhat';
import { base, hardhat } from 'viem/chains';
import { mintclub as sdk } from '../../src';
import { TokenAlreadyExistsError } from '../../src/errors/sdk.errors';
import { MAX_STEPS, PROTOCOL_BENEFICIARY, wei } from '../utils';
import { checksumAddress } from 'viem';

const publicClient = await hre.viem.getPublicClient();

// first wallet is used automatically to deploy
const [_deployer, alice] = await hre.viem.getWalletClients();

const TokenImplementation = await hre.viem.deployContract('MCV2_Token');
const NFTImplementation = await hre.viem.deployContract('MCV2_MultiToken');

describe('Hardhat ERC20', async () => {
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
    ERC20: {
      [hardhat.id]: ReserveToken.address,
    },
  };

  const mintclub = sdk.withPublicClient(publicClient).withWalletClient(alice);

  test(`Read Alice's balance`, async () => {
    const balance = await mintclub.getNativeBalance();
    expect(balance).toEqual(10000000000000000000000n);
  });

  test(`So, Alice creates a new ERC20 called JOKBAL`, async () => {
    await mintclub.token('JOKBAL').create({
      name: 'JOKBAL',
      reserveToken: {
        address: ReserveToken.address,
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
      debug: (a) => console.log(a),
      onRequestSignature: async () => {
        console.log('signature requested');
      },
      onSuccess: (receipt) => {
        console.log('success', receipt);
      },
    });
  });
});
