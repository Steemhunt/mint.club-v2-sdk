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

export function getTwentyFourHoursAgoTimestamp(): number {
  const date = new Date();
  date.setTime(date.getTime() - 24 * 60 * 60 * 1000);
  const seconds = Math.floor(date.getTime() / 1000);
  const tenMinutesInSeconds = 10 * 60;
  return Math.round(seconds / tenMinutesInSeconds) * tenMinutesInSeconds;
}
