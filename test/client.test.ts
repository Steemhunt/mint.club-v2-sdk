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

test('independent roots keep their signer and RPC ownership through every helper', async () => {
  const first = new MintClubSDK();
  const second = new MintClubSDK();
  const makeClient = (result: bigint) =>
    ({
      chain: base,
      readContract: async () => result,
      getBlock: async () => ({ timestamp: result }),
    }) as unknown as PublicClient;
  first.withPublicClient(makeClient(111n));
  const firstNetwork = first.network('base').withPrivateKey(TEST_PRIVATE_KEY);
  const address = await firstNetwork.account();
  const token = firstNetwork.token('ISOLATED');
  const secondNetwork = second.network('base').withPrivateKey(`0x${'02'.repeat(32)}`);
  second.withPublicClient(makeClient(222n));
  for (const [network, value] of [
    [firstNetwork, 111n],
    [secondNetwork, 222n],
  ] as const) {
    expect(await network.token('ISOLATED').getBalanceOf(address!)).toBe(value);
    expect(await network.nft('ISOLATED').getBalanceOf(address!)).toBe(value);
    expect(await network.bond.getCreationFee()).toBe(value);
    expect(await network.airdrop.getTotalAirdropCount()).toBe(value);
    expect(await network.lockup.getTotalLockUpCount()).toBe(value);
    expect(await network.stake.getPoolCount()).toBe(value);
  }
  expect(await first.utils.getTimestampFromBlock({ chainId: base.id, blockNumber: 1n })).toBe(111);
  expect(await second.utils.getTimestampFromBlock({ chainId: base.id, blockNumber: 1n })).toBe(222);
  second.wallet.disconnect();
  expect(await firstNetwork.account()).toBe(address);
  expect(await token.getBalanceOf(address!)).toBe(111n);
});

test('the public default SDK and contract wrappers share only the explicit default client', async () => {
  const { mintclub, bondContract, MintClubSDK: ExportedSDK } = await import('../src');
  expect(ExportedSDK).toBe(MintClubSDK);
  mintclub.withPublicClient({ chain: base, readContract: async () => 42n } as unknown as PublicClient);
  const independent = new MintClubSDK().withPublicClient({
    chain: base,
    readContract: async () => 7n,
  } as unknown as PublicClient);
  expect(await bondContract.network('base').read({ functionName: 'creationFee' })).toBe(42n);
  expect(await mintclub.network('base').bond.getCreationFee()).toBe(42n);
  expect(await independent.network('base').bond.getCreationFee()).toBe(7n);
});

test('private-key writes use the selected owner and chain RPC even after interleaved network calls', async () => {
  const { createPublicClient, custom } = await import('viem');
  const requests: Array<[string, string]> = [];
  const first = new MintClubSDK();
  const second = new MintClubSDK();
  for (const [sdk, owner] of [
    [first, 'first'],
    [second, 'second'],
  ] as const) {
    for (const chain of [base, mainnet]) {
      sdk.withPublicClient(
        createPublicClient({
          chain,
          transport: custom({
            request: async ({ method }) => {
              requests.push([`${owner}:${chain.id}`, method]);
              return '0x1';
            },
          }),
        }),
      );
    }
  }
  first.network('base').withPrivateKey(TEST_PRIVATE_KEY);
  second.network('ethereum').withPrivateKey(`0x${'02'.repeat(32)}`);
  await first.wallet.getWalletClient()!.request({ method: 'eth_chainId' });
  const wallet = first.wallet._getWalletClientForChain(mainnet.id)!;
  await wallet.request({ method: 'eth_chainId' });
  expect(wallet.chain?.id).toBe(mainnet.id);
  expect(wallet.account?.address).toBe(first.wallet.getWalletClient()?.account?.address);
  expect(wallet.account?.address).not.toBe(second.wallet.getWalletClient()?.account?.address);
  expect(requests).toEqual([
    ['first:8453', 'eth_chainId'],
    ['first:1', 'eth_chainId'],
  ]);
});
