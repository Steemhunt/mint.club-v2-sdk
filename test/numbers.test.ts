import { expect, test } from 'bun:test';
import { countDecimals, handleScientificNotation, wei } from '../src/utils/numbers';

test('positive scientific exponents produce ungrouped, exact decimal strings', () => {
  expect(handleScientificNotation(1e21)).toBe('1000000000000000000000');
  expect(wei(1e21)).toBe(10n ** 39n);
  expect(wei('1.234567890123456789012345e25', 0)).toBe(12345678901234567890123450n);
});

test('negative scientific exponents preserve the coefficient without floating-point rounding', () => {
  expect(handleScientificNotation('1.234567890123456789e-3')).toBe('0.001234567890123456789');
  expect(wei('1.234567890123456789e-3', 21)).toBe(1234567890123456789n);
  expect(wei('1E-18')).toBe(1n);
  expect(wei('-2.5e3', 0)).toBe(-2500n);
  expect(countDecimals('1.23e-5')).toBe(7);
});

test('ordinary decimal inputs retain their existing conversion behavior', () => {
  expect(handleScientificNotation('123.456')).toBe('123.456');
  expect(wei('123.456', 3)).toBe(123456n);
  expect(wei(0)).toBe(0n);
});
