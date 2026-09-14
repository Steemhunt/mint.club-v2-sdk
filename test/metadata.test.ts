import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createWalletClient, custom } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { base } from 'viem/chains';
import { MintClubSDK } from '../src/MintClubSDK';
import { MetadataValidationError } from '../src/errors/sdk.errors';

const TEST_PRIVATE_KEY = `0x${'01'.repeat(32)}` as const;
const TOKEN_ADDRESS = '0x1111111111111111111111111111111111111111';
const authorization = { message: 'Test metadata update', signature: '0x1234' };

function connectedToken() {
  const network = new MintClubSDK()
    .withWalletClient(
      createWalletClient({
        account: privateKeyToAccount(TEST_PRIVATE_KEY),
        chain: base,
        transport: custom({
          request: async () => {
            throw new Error('Unexpected RPC call');
          },
        }),
      }),
    )
    .network('base');
  return { token: network.token(TOKEN_ADDRESS), wallet: network.getWalletClient()! };
}

test('metadata update preserves supplied authorization and adds the connected wallet address', async (t) => {
  const { token, wallet } = connectedToken();
  const sign = t.mock.method(wallet, 'signMessage', async () => {
    throw new Error('Unexpected signature request');
  });
  const logo = new File(['logo bytes'], 'logo.png', { type: 'image/png' });
  const fetch = t.mock.method(globalThis, 'fetch', async (input: RequestInfo | URL, init?: RequestInit) => {
    assert.equal(String(input), 'https://mint.club/api/metadata');
    assert.equal(init?.method, 'PUT');
    assert.ok(init.body instanceof FormData);
    assert.deepEqual(Object.fromEntries(init.body), {
      chainId: '8453',
      tokenAddress: TOKEN_ADDRESS,
      walletAddress: wallet.account!.address,
      ...authorization,
      logo,
      website: '',
      backgroundImage: '',
      miniappUrls: '[]',
    });
    return Response.json({ website: null });
  });
  const result = await token.updateMintClubMetadata({
    ...authorization,
    logo,
    website: '',
    backgroundImage: null,
    miniappUrls: [],
  });
  assert.deepEqual(result, { website: null });
  assert.equal(fetch.mock.callCount(), 1);
  assert.equal(sign.mock.callCount(), 0);
});

test('initial metadata uses authenticated PUT and clears unspecified placeholder fields', async (t) => {
  const { token, wallet } = connectedToken();
  const fetch = t.mock.method(globalThis, 'fetch', async (input: RequestInfo | URL, init?: RequestInit) => {
    assert.equal(String(input), 'https://mint.club/api/metadata');
    assert.equal(init?.method, 'PUT');
    assert.ok(init.body instanceof FormData);
    assert.deepEqual(Object.fromEntries(init.body), {
      chainId: '8453',
      tokenAddress: TOKEN_ADDRESS,
      walletAddress: wallet.account!.address,
      ...authorization,
      website: 'https://example.com',
      logo: '',
      backgroundImage: '',
      distributionPlan: '',
      creatorComment: '',
      externalDexUrl: '',
      miniappUrls: '[]',
    });
    return Response.json({});
  });
  await token.createMintClubMetadata({
    ...authorization,
    website: 'https://example.com',
    logo: undefined,
    miniappUrls: undefined,
  });
  assert.equal(fetch.mock.callCount(), 1);
});

test('initial metadata and updates reject missing authorization before sending requests', async (t) => {
  const { token } = connectedToken();
  const fetch = t.mock.method(globalThis, 'fetch', async () => {
    throw new Error('Unexpected request');
  });
  for (const save of [token.createMintClubMetadata.bind(token), token.updateMintClubMetadata.bind(token)]) {
    await assert.rejects(
      save({ ...authorization, signature: '', website: 'https://example.com' }),
      MetadataValidationError,
    );
    await assert.rejects(
      save({ ...authorization, message: '', website: 'https://example.com' }),
      MetadataValidationError,
    );
  }
  assert.equal(fetch.mock.callCount(), 0);
});

test('failed metadata saves preserve image inputs for a retry after deployment', async (t) => {
  const { token } = connectedToken();
  const fetch = t.mock.method(globalThis, 'fetch', async () => Response.json({}, { status: 503 }));
  const logo = new File(['logo'], 'logo.png', { type: 'image/png' });
  const input = { ...authorization, logo, website: 'https://example.com' };
  await assert.rejects(token.createMintClubMetadata(input), /status: 503/);
  assert.equal(fetch.mock.callCount(), 1);
  assert.equal(await input.logo.text(), 'logo');
  assert.deepEqual(input, { ...authorization, logo, website: 'https://example.com' });
});
