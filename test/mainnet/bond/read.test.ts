import { describe, expect, test } from 'bun:test';
import { ALL_CHAINS, getCreationFee } from '../../utils';
import { mintclub, type LowerCaseChainNames } from '../../../src';

function testAll(cb: (network: LowerCaseChainNames) => void) {
  ALL_CHAINS.forEach((name) => {
    cb(name);
  });
}

describe('Bond Contract', () => {
  testAll((network) => {
    test(`${network} - getCreationFee`, async () => {
      const creationFee = await mintclub.network(network).bond.getCreationFee();
      expect(creationFee).toEqual(getCreationFee(network));
    });
  });
});
