import { cloneDeep } from 'lodash-es';
import { parseUnits } from 'viem';
import { handleScientificNotation } from './numbers';

export function restructureStepData(data?: { rangeTo: number; price: number }[] | null) {
  if (!data) return [];
  // we shift the y values to the right
  const cloned = cloneDeep(data);
  for (let i = cloned.length - 1; i > 0; i--) {
    cloned[i].price = cloned[i - 1]?.price;
  }
  // remove the first element as it is not needed
  cloned.shift();
  return cloned;
}

export function wei(num: number | string, decimals = 18) {
  const stringified = handleScientificNotation(num.toString());
  return parseUnits(stringified, decimals);
}
