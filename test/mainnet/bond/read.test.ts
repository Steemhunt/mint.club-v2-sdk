import { describe, expect, test } from 'bun:test';
import { ALL_CHAINS } from '../../utils';
import { mintclub, type LowerCaseChainNames } from '../../../src';

function testAll(cb: (network: LowerCaseChainNames) => void) {
  ALL_CHAINS.forEach((name) => {
    cb(name);
  });
}

describe('Bond Contract', () => {
  testAll((network) => {
    test(
      `${network} - getCreationFee`,
      async () => {
        const creationFee = await mintclub.network(network).bond.getCreationFee();
        expect(typeof creationFee).toBe('bigint');
        expect(creationFee).toBeGreaterThan(0n);
      },
      15000,
    );
  });
});
