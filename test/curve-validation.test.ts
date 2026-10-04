import { expect, test } from 'bun:test';
import { generateSteps } from '../src/utils/graph';
import { generateCreateArgs } from '../src/utils/bond';
import { GenerateStepArgs } from '../src/types/bond.types';
import fixtures from './curve-fixtures.json';

const form = fixtures[0].form as GenerateStepArgs;
for (const fixture of fixtures) {
  const { curveType, initialMintingPrice } = fixture.form.curveData;
  test(`${fixture.form.tokenType} ${curveType} preserves existing output at starting price ${initialMintingPrice}`, () => {
    expect(generateSteps(fixture.form as GenerateStepArgs)).toEqual(fixture.expected);
  });
}

for (const curveType of ['FLAT', 'EXPONENTIAL'] as const) {
  test(`${curveType} rejects a zero starting price without recursive or undefined-property errors`, () => {
    expect(() =>
      generateSteps({ ...form, curveData: { ...form.curveData, curveType, initialMintingPrice: 0 } }),
    ).toThrow('require a positive initial minting price');
  });
}

for (const curveType of ['LINEAR', 'LOGARITHMIC'] as const) {
  test(`${curveType} rejects normalization that remains zero or becomes non-finite`, () => {
    for (const finalMintingPrice of [0, NaN]) {
      expect(() =>
        generateSteps({
          ...form,
          curveData: { ...form.curveData, curveType, initialMintingPrice: 0, finalMintingPrice },
        }),
      ).toThrow('cannot produce a positive initial minting price');
    }
  });
}

test('manual free steps and creator allocation remain supported', () => {
  const params = { name: 'Test', symbol: 'TEST', tokenType: 'ERC20' as const, reserveToken: form.reserveToken };
  const manual = generateCreateArgs({
    ...params,
    stepData: [
      { rangeTo: 5, price: 0 },
      { rangeTo: 100, price: 1 },
    ],
  });
  expect(manual.bondParams.stepPrices).toEqual([0n, 1000000n]);
  const generated = generateCreateArgs({ ...params, curveData: form.curveData });
  expect(generated.bondParams.stepPrices[0]).toBe(0n);
  expect(generated.bondParams.stepRanges[0]).toBe(5n * 10n ** 18n);
});
