import { parseUnits } from 'viem';
import { handleScientificNotation } from './numbers';
import pkg from '../../package.json';

export function wei(num: number | string, decimals = 18) {
  const stringified = handleScientificNotation(num.toString());
  return parseUnits(stringified, decimals);
}

export function getVersion() {
  return pkg.version;
}
