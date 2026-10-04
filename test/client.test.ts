import { describe, expect, test } from 'bun:test';
import { PublicClient } from 'viem';
import { base, mainnet } from 'viem/chains';
import { MintClubSDK } from '../src/MintClubSDK';
import { CHAIN_MAP, chainIdToViemChain } from '../src/constants/chains';
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

test('retained network handles keep their selected chain after other network calls', async () => {
  const sdk = new MintClubSDK();
  const baseClient = sdk.network('base');
  const baseTokenAddress = baseClient.token('HANDLE_TEST').getTokenAddress();
  const ethereumClient = sdk.network('ethereum');
  expect(baseClient).not.toBe(ethereumClient);
  expect(baseClient.token('HANDLE_TEST').getTokenAddress()).toBe(baseTokenAddress);
  baseClient.withPublicClient({ chain: base, readContract: async () => base.id } as unknown as PublicClient);
  ethereumClient.withPublicClient({ chain: mainnet, readContract: async () => mainnet.id } as unknown as PublicClient);
  expect(await baseClient.token('HANDLE_TEST').getDetail()).toBe(base.id);
  expect(await ethereumClient.token('HANDLE_TEST').getDetail()).toBe(mainnet.id);
  expect(baseClient.getPublicClient().chain?.id).toBe(base.id);
  expect(ethereumClient.getPublicClient().chain?.id).toBe(mainnet.id);
  expect(baseClient.withPrivateKey(TEST_PRIVATE_KEY)).toBe(baseClient);
  expect(baseClient.getWalletClient()?.chain?.id).toBe(base.id);
});

test('private-key connect preserves the configured client without requesting accounts', async () => {
  const network = new MintClubSDK().network('base').withPrivateKey(TEST_PRIVATE_KEY);
  const walletClient = network.getWalletClient();
  expect(await network.connect()).toBe(walletClient?.account?.address);
  expect(network.getWalletClient()).toBe(walletClient);
  expect(network.getWalletClient()?.chain?.id).toBe(base.id);
});

test('Node wallet discovery and disconnect work without a browser window', async () => {
  const sdk = new MintClubSDK();
  expect(typeof window).toBe('undefined');
  sdk.wallet.disconnect();
  expect(await sdk.wallet.account()).toBeNull();
  await expect(sdk.wallet.connect()).rejects.toThrow('window.ethereum not found');
});

test('the Base Sepolia chain definition matches its selected network', () => {
  const sdk = new MintClubSDK();
  expect(sdk.network('basesepolia').getPublicClient().chain?.id).toBe(84532);
  expect(chainIdToViemChain(84532)?.id).toBe(84532);
  expect(CHAIN_MAP[84532].chain.id).toBe(84532);
});

test('explicitly configured wallets remain usable after a previous disconnect', async () => {
  const sdk = new MintClubSDK();
  const originalWindow = globalThis.window;
  const values = new Map<string, string>();
  globalThis.window = {
    localStorage: {
      getItem: (key: string) => values.get(key),
      setItem: (key: string, value: string) => values.set(key, value),
    },
  } as any;
  try {
    sdk.wallet.disconnect();
    const network = sdk.network('base').withPrivateKey(TEST_PRIVATE_KEY);
    expect(await network.account()).toBe(network.getWalletClient()?.account?.address);
  } finally {
    if (originalWindow === undefined) delete (globalThis as any).window;
    else globalThis.window = originalWindow;
  }
});

test('connect uses an explicitly supplied provider instead of requesting accounts from the old wallet', async () => {
  const sdk = new MintClubSDK();
  const oldAddress = '0x1111111111111111111111111111111111111111';
  const newAddress = '0x2222222222222222222222222222222222222222';
  sdk.wallet.withWalletClient({
    chain: base,
    account: { address: oldAddress },
    requestAddresses: async () => {
      throw new Error('Unexpected old provider request');
    },
    transport: {
      request: async () => {
        throw new Error('Unexpected old provider request');
      },
    },
  } as any);
  expect(await sdk.wallet.connect({ request: async () => [newAddress] })).toBe(newAddress);
  expect(sdk.wallet.getWalletClient()?.account?.address).toBe(newAddress);
  expect(sdk.wallet.getWalletClient()?.chain?.id).toBe(base.id);
});
