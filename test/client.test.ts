import { describe, expect, test } from 'bun:test';
import { base, mainnet } from 'viem/chains';
import { MintClubSDK } from '../src/MintClubSDK';
import { ChainNotSupportedError } from '../src/errors/sdk.errors';

const TEST_PRIVATE_KEY = `0x${'01'.repeat(32)}` as const;

describe('SDK client configuration', () => {
  test('rejects unsupported network names and IDs', () => {
    const sdk = new MintClubSDK();

    // @ts-expect-error Retired networks must also be rejected for JavaScript callers.
    expect(() => sdk.network('degen')).toThrow(ChainNotSupportedError);
    // @ts-expect-error Numeric IDs must not bypass the supported network list.
    expect(() => sdk.network(666666666)).toThrow(ChainNotSupportedError);
  });

  test('uses the selected network for a private-key wallet client', () => {
    const sdk = new MintClubSDK();

    const baseClient = sdk.network('base').withPrivateKey(TEST_PRIVATE_KEY);
    expect(baseClient.getWalletClient()?.chain?.id).toBe(base.id);

    const mainnetClient = sdk.network('ethereum').withPrivateKey(TEST_PRIVATE_KEY);
    expect(mainnetClient.getWalletClient()?.chain?.id).toBe(mainnet.id);
  });
});
