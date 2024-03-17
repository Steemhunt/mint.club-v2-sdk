// import { describe, expect, test } from 'bun:test';
// import hre from 'hardhat';
// import { TransactionReceipt, checksumAddress, getAddress, maxUint256 } from 'viem';
// import { hardhat } from 'viem/chains';
// import { mintclub as sdk } from '../../src';
// import { computeCreate2Address } from '../../src/utils/addresses';
// import { MAX_STEPS, PROTOCOL_BENEFICIARY, wei } from '../utils';

// process.env.NODE_ENV = 'hardhat';

// const publicClient = await hre.viem.getPublicClient();
// const [alice, bob] = await hre.viem.getWalletClients();
// // first wallet is used automatically to deploy

// const TokenImplementation = await hre.viem.deployContract('MCV2_Token');
// const NFTImplementation = await hre.viem.deployContract('MCV2_MultiToken');

// describe('Hardhat ERC20', async () => {
//   // 1. setup
//   const Bond = await hre.viem.deployContract('MCV2_Bond', [
//     checksumAddress(TokenImplementation.address),
//     checksumAddress(NFTImplementation.address),
//     checksumAddress(PROTOCOL_BENEFICIARY),
//     0n,
//     MAX_STEPS.base,
//   ]);

//   // @ts-ignore
//   const ReserveToken = await hre.viem.deployContract('TestToken', [wei(200_000_000, 18), 'Test Token', 'TEST', 18n]); // supply: 200M

//   alice.writeContract({
//     abi: ReserveToken.abi,
//     address: ReserveToken.address,
//     functionName: 'transfer',
//     args: [bob.account.address, wei(100_000_000, 18)],
//   } as any);

//   const mintclub = sdk.withPublicClient(publicClient);

//   function assertTxSignature() {
//     expect().pass();
//   }

//   function assertTxSuccess(receipt: TransactionReceipt) {
//     expect(receipt.status).toEqual('success');
//   }

//   // 2. test

//   const WONDERLAND_TOKEN_CURVE = {
//     name: 'Alice Token',
//     symbol: 'WONDERLAND',
//     reserveToken: {
//       address: ReserveToken.address,
//       decimals: 18,
//     },
//     curveData: {
//       curveType: 'LINEAR',
//       stepCount: 10,
//       maxSupply: 10_000,
//       creatorAllocation: 1,
//       initialMintingPrice: 0.01,
//       finalMintingPrice: 1,
//     },
//   } as const;

//   const BOB_TOKEN_STEP = {
//     name: 'Bob Token',
//     symbol: 'BOB',
//     reserveToken: {
//       address: ReserveToken.address,
//       decimals: 18,
//     },
//     stepData: [
//       { rangeTo: 100, price: 1 },
//       { rangeTo: 1000, price: 2 },
//       { rangeTo: 10000, price: 3 },
//     ],
//   };

//   global.mcv2Hardhat = {
//     ERC20: {
//       [hardhat.id]: TokenImplementation.address,
//     },

//     ERC1155: {
//       [hardhat.id]: '0x',
//     },

//     BOND: {
//       [hardhat.id]: Bond.address,
//     },

//     ZAP: {
//       [hardhat.id]: '0x',
//     },

//     LOCKER: {
//       [hardhat.id]: '0x',
//     },

//     MERKLE: {
//       [hardhat.id]: '0x',
//     },

//     ONEINCH: {
//       [hardhat.id]: '0x',
//     },
//   };

//   const wonderlandTokenAddress = computeCreate2Address(hardhat.id, 'ERC20', WONDERLAND_TOKEN_CURVE.symbol);

//   describe('basic curveData', async () => {
//     test(`Read Bob's balance`, async () => {
//       const balance = await mintclub.withWalletClient(bob).getNativeBalance();
//       expect(balance).toEqual(10000000000000000000000n);
//     });

//     test(`Alice creates a new ERC20 called ALICE with basic linear curve`, async () => {
//       await mintclub
//         .withWalletClient(alice)
//         .token(WONDERLAND_TOKEN_CURVE.symbol)
//         .create({
//           ...WONDERLAND_TOKEN_CURVE,
//           debug: (simulationArgs: any) => {
//             const { args, functionName, address } = simulationArgs;
//             const [{ name, symbol }, { mintRoyalty, burnRoyalty, reserveToken, maxSupply, stepRanges, stepPrices }] =
//               args;
//             expect(name).toEqual(WONDERLAND_TOKEN_CURVE.name);
//             expect(symbol).toEqual(WONDERLAND_TOKEN_CURVE.symbol);

//             expect(functionName).toEqual('createToken');

//             expect(address).toEqual(Bond.address);
//             expect(reserveToken).toEqual(ReserveToken.address);
//             expect(maxSupply).toEqual(wei(10000, 18));

//             expect(stepRanges[0]).toEqual(wei(1, 18));
//             expect(stepPrices[0]).toEqual(0n);

//             expect(stepRanges[stepRanges.length - 1]).toEqual(wei(10000, 18));
//             expect(stepPrices[stepPrices.length - 1]).toEqual(wei(1, 18));

//             expect(mintRoyalty).toEqual(30); // default 0.03%
//             expect(burnRoyalty).toEqual(30); // default 0.03%
//           },
//           onSignatureRequest: assertTxSignature,
//           onSuccess: assertTxSuccess,
//         });
//     });

//     test(`Check if ${WONDERLAND_TOKEN_CURVE.symbol} token is created`, async () => {
//       const exists = await mintclub.token(wonderlandTokenAddress).exists();
//       expect(exists).toEqual(true);
//     });

//     test(`Check if ${WONDERLAND_TOKEN_CURVE.symbol} token has correct data`, async () => {
//       const { reserveToken, burnRoyalty, mintRoyalty, creator } = await mintclub
//         .token(wonderlandTokenAddress)
//         .getTokenBond();
//       expect(getAddress(reserveToken, hardhat.id)).toEqual(getAddress(ReserveToken.address, hardhat.id));
//       expect(burnRoyalty).toEqual(30);
//       expect(mintRoyalty).toEqual(30);
//       expect(getAddress(creator, hardhat.id)).toEqual(getAddress(alice.account.address, hardhat.id));
//     });

//     test(`Check Alice's creator allocation of 1 ${WONDERLAND_TOKEN_CURVE.symbol}`, async () => {
//       const balance = await mintclub.token(wonderlandTokenAddress).getBalanceOf(alice.account.address);
//       // 1 creator free minting
//       expect(balance).toEqual(wei(1, 18));
//     });

//     test(`Alice tries to buy 10 more ${WONDERLAND_TOKEN_CURVE.symbol}, but did not approve the BondContract`, async () => {
//       await mintclub
//         .withWalletClient(alice)
//         .token(wonderlandTokenAddress)
//         .buy({
//           amount: wei(10, 18),
//         });
//     });

//     test(`So she approves it`, async () => {
//       await mintclub
//         .withWalletClient(alice)
//         .token(wonderlandTokenAddress)
//         .approve({
//           tradeType: 'buy',
//           onSignatureRequest: assertTxSignature,
//           onSuccess: assertTxSuccess,
//           debug: (simulation) => {
//             const {
//               args: [, amountApproved],
//             } = simulation;
//             expect(amountApproved).toEqual(maxUint256);
//           },
//         });
//     });

//     test(`Bond contract's allowance for her reserveToken is maxUint256 now`, async () => {
//       const allowance = await mintclub.withWalletClient(alice).token(ReserveToken.address).getAllowance({
//         owner: alice.account.address,
//         spender: Bond.address,
//       });
//       expect(allowance).toEqual(maxUint256);
//     });

//     test(`Before she buys, token mint price is 0.01`, async () => {
//       const price = await mintclub.token(wonderlandTokenAddress).getPriceForNextMint();
//       expect(price).toEqual(wei(1, 16));
//     });

//     test(`She tries to buy 1000 tokens now`, async () => {
//       await mintclub
//         .withWalletClient(alice)
//         .token(wonderlandTokenAddress)
//         .buy({
//           amount: wei(1000, 18),
//           onSignatureRequest: assertTxSignature,
//           onSuccess: assertTxSuccess,
//         });
//     });

//     test(`It goes through, and now she has 1,001 ${WONDERLAND_TOKEN_CURVE.symbol}`, async () => {
//       const balance = await mintclub.token(wonderlandTokenAddress).getBalanceOf(alice.account.address);
//       expect(balance).toEqual(wei(1001, 18));
//     });

//     test(`Bob has no tokens. He's sad`, async () => {
//       const balance = await mintclub.token(wonderlandTokenAddress).getBalanceOf(bob.account.address);
//       expect(balance).toEqual(0n);
//     });

//     test(`She gives one to bob`, async () => {
//       await mintclub.token(wonderlandTokenAddress).transfer({
//         recipient: bob.account.address,
//         amount: wei(1, 18),
//         onSignatureRequest: assertTxSignature,
//         onSuccess: assertTxSuccess,
//       });
//     });

//     test(`Bob is happy now`, async () => {
//       const balance = await mintclub.token(wonderlandTokenAddress).getBalanceOf(bob.account.address);
//       expect(balance).toEqual(wei(1, 18));
//     });

//     test(`Now the token mint price is 0.12`, async () => {
//       const price = await mintclub.token(wonderlandTokenAddress).getPriceForNextMint();
//       expect(price).toEqual(wei(12, 16));
//     });

//     test(`Bob feels thankful and he buys a 1,000 too`, async () => {
//       await mintclub
//         .withWalletClient(bob)
//         .token(wonderlandTokenAddress)
//         .approve({
//           tradeType: 'buy',
//           onSignatureRequest: assertTxSignature,
//           onSuccess: assertTxSuccess,
//           debug: (simulation) => {
//             const {
//               args: [, amountApproved],
//             } = simulation;
//             expect(amountApproved).toEqual(maxUint256);
//           },
//         });

//       await mintclub
//         .withWalletClient(bob)
//         .token(wonderlandTokenAddress)
//         .buy({
//           amount: wei(1000, 18),
//           onSignatureRequest: assertTxSignature,
//           onSuccess: assertTxSuccess,
//         });
//     });

//     test(`Now the token mint price is 0.23`, async () => {
//       const price = await mintclub.token(wonderlandTokenAddress).getPriceForNextMint();
//       expect(price).toEqual(wei(23, 16));
//     });

//     test(`Alice approves Bond to use her token`, async () => {
//       await mintclub.withWalletClient(alice).token(wonderlandTokenAddress).approve({
//         tradeType: 'sell',
//         onSignatureRequest: assertTxSignature,
//         onSuccess: assertTxSuccess,
//       });
//     });

//     test(`Alice stabs Bob in the back and sells 500 ${WONDERLAND_TOKEN_CURVE.symbol}`, async () => {
//       await mintclub
//         .withWalletClient(alice)
//         .token(wonderlandTokenAddress)
//         .sell({
//           amount: wei(500, 18),
//           onSignatureRequest: assertTxSignature,
//           onSuccess: assertTxSuccess,
//         });
//     });

//     test(`Now the token mint price is down to 0.12`, async () => {
//       const price = await mintclub.token(wonderlandTokenAddress).getPriceForNextMint();
//       expect(price).toEqual(wei(12, 16));
//     });

//     test(`Alice now has 500 ${WONDERLAND_TOKEN_CURVE.symbol}`, async () => {
//       const balance = await mintclub.token(wonderlandTokenAddress).getBalanceOf(alice.account.address);
//       expect(balance).toEqual(wei(500, 18));
//     });
//   });

//   describe('stepData', async () => {
//     test(`Bob creates a new ERC20 called BOB with stepData`, async () => {
//       await mintclub
//         .withWalletClient(bob)
//         .token(BOB_TOKEN_STEP.symbol)
//         .create({
//           ...BOB_TOKEN_STEP,
//           debug: (simulationArgs: any) => {
//             const { args, functionName, address } = simulationArgs;
//             const [{ name, symbol }, { mintRoyalty, burnRoyalty, reserveToken, stepRanges, stepPrices }] = args;
//             expect(name).toEqual(BOB_TOKEN_STEP.name);
//             expect(symbol).toEqual(BOB_TOKEN_STEP.symbol);

//             expect(functionName).toEqual('createToken');

//             expect(address).toEqual(Bond.address);
//             expect(reserveToken).toEqual(ReserveToken.address);

//             expect(stepRanges[0]).toEqual(wei(100, 18));
//             expect(stepPrices[0]).toEqual(wei(1, 18));

//             expect(stepRanges[1]).toEqual(wei(1000, 18));
//             expect(stepPrices[1]).toEqual(wei(2, 18));

//             expect(stepRanges[2]).toEqual(wei(10000, 18));
//             expect(stepPrices[2]).toEqual(wei(3, 18));

//             expect(mintRoyalty).toEqual(30); // default 0.03%
//             expect(burnRoyalty).toEqual(30); // default 0.03%
//           },
//           onSignatureRequest: assertTxSignature,
//           onSuccess: assertTxSuccess,
//         });
//     });

//     test(`Check if ${BOB_TOKEN_STEP.symbol} token is created`, async () => {
//       const exists = await mintclub.token(computeCreate2Address(hardhat.id, 'ERC20', BOB_TOKEN_STEP.symbol)).exists();
//       expect(exists).toEqual(true);
//     });

//     test(`Check if ${BOB_TOKEN_STEP.symbol} token has correct data`, async () => {
//       const { reserveToken, burnRoyalty, mintRoyalty, creator } = await mintclub
//         .token(computeCreate2Address(hardhat.id, 'ERC20', BOB_TOKEN_STEP.symbol))
//         .getTokenBond();
//       expect(getAddress(reserveToken, hardhat.id)).toEqual(getAddress(ReserveToken.address, hardhat.id));
//       expect(burnRoyalty).toEqual(30);
//       expect(mintRoyalty).toEqual(30);
//       expect(getAddress(creator, hardhat.id)).toEqual(getAddress(bob.account.address, hardhat.id));

//       process.env.NODE_ENV = 'test';
//     });
//   });
// });
