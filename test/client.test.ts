import { describe, expect, test } from 'bun:test';
import { base, mainnet } from 'viem/chains';
import { MintClubSDK } from '../src/MintClubSDK';

const TEST_PRIVATE_KEY = `0x${'01'.repeat(32)}` as const;

describe('SDK client configuration', () => {
  test('uses the selected network for a private-key wallet client', () => {
    const sdk = new MintClubSDK();

    const baseClient = sdk.network('base').withPrivateKey(TEST_PRIVATE_KEY);
    expect(baseClient.getWalletClient()?.chain?.id).toBe(base.id);

    const mainnetClient = sdk.network('ethereum').withPrivateKey(TEST_PRIVATE_KEY);
    expect(mainnetClient.getWalletClient()?.chain?.id).toBe(mainnet.id);
  });
});
