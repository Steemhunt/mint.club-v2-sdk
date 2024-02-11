import { parseUnits } from 'viem';
import { handleScientificNotation } from './numbers';

export function wei(num: number | string, decimals = 18) {
  const stringified = handleScientificNotation(num.toString());
  return parseUnits(stringified, decimals);
}
