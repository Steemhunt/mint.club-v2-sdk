import { expect, test } from 'bun:test';
import { binaryReverseBurn, binaryReverseMint } from '../src/utils/trade';

const bondSteps = [{ rangeTo: 100n, price: 3n }];
const shared = { bondSteps, multiFactor: 1n, slippage: 0 };

test('reverse burning rounds up to the minimum amount that reaches a non-exact refund target', () => {
  expect(binaryReverseBurn({ ...shared, currentSupply: 10n, reserveAmount: 5n, burnRoyalty: 0 })).toBe(2n);
  expect(binaryReverseBurn({ ...shared, currentSupply: 10n, reserveAmount: 6n, burnRoyalty: 0 })).toBe(2n);
  expect(binaryReverseBurn({ ...shared, currentSupply: 10n, reserveAmount: 31n, burnRoyalty: 0 })).toBe(10n);
});

test('reverse minting finds the maximum affordable amount across rounded-price plateaus', () => {
  const args = {
    bondSteps: [{ rangeTo: 100n, price: 1n }],
    multiFactor: 10n,
    currentSupply: 0n,
    maxSupply: 100n,
    slippage: 0,
    mintRoyalty: 0,
  };
  expect(binaryReverseMint({ ...args, reserveAmount: 1n })).toBe(10n);
  expect(binaryReverseMint({ ...args, reserveAmount: 2n })).toBe(20n);
  expect(binaryReverseMint({ ...args, reserveAmount: 100n })).toBe(100n);
});

test('reverse burning picks the first amount reaching a rounded refund rather than the middle of the plateau', () => {
  const args = {
    bondSteps: [{ rangeTo: 100n, price: 1n }],
    multiFactor: 10n,
    currentSupply: 100n,
    slippage: 0,
    burnRoyalty: 0,
  };
  expect(binaryReverseBurn({ ...args, reserveAmount: 1n })).toBe(10n);
  expect(binaryReverseBurn({ ...args, reserveAmount: 0n })).toBe(0n);
});

test('reverse quotes handle multiple steps and their mint or burn royalties', () => {
  const steps = [
    { rangeTo: 5n, price: 2n },
    { rangeTo: 10n, price: 4n },
  ];
  expect(
    binaryReverseMint({
      bondSteps: steps,
      multiFactor: 1n,
      currentSupply: 4n,
      maxSupply: 10n,
      reserveAmount: 7n,
      mintRoyalty: 1000,
      slippage: 0,
    }),
  ).toBe(2n);
  expect(
    binaryReverseBurn({
      bondSteps: steps,
      multiFactor: 1n,
      currentSupply: 7n,
      reserveAmount: 9n,
      burnRoyalty: 1000,
      slippage: 0,
    }),
  ).toBe(3n);
});
