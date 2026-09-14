import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createWalletClient, custom, verifyMessage, type Hex } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { base } from 'viem/chains';
import { MintClubSDK } from '../src/MintClubSDK';

const TEST_PRIVATE_KEY = `0x${'01'.repeat(32)}` as const;
const TOKEN_ADDRESS = '0x1111111111111111111111111111111111111111';
const challenge = {
  message: 'A prepared, token-specific authorization returned by the server',
  nonce: '3d6d9552-bd08-4acf-afd3-e68f9e692f2b',
  expiresAt: 1_900_000_000_000,
};

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

test('metadata update prepares and signs the exact returned message before authenticated PUT', async (t) => {
  const { token, wallet } = connectedToken();
  const requests: { url: string; method?: string; fields: Record<string, FormDataEntryValue> }[] = [];
  t.mock.method(globalThis, 'fetch', async (input: RequestInfo | URL, init?: RequestInit) => {
    assert.ok(init?.body instanceof FormData);
    requests.push({ url: String(input), method: init.method, fields: Object.fromEntries(init.body) });
    return Response.json(requests.length === 1 ? challenge : { website: '' });
  });
  const logo = new File(['logo bytes'], 'logo.png', { type: 'image/png' });
  const result = await token.updateMintClubMetadata({ logo, website: '', backgroundImage: null, miniappUrls: [] });
  assert.deepEqual(result, { website: '' });
  assert.deepEqual(
    requests.map(({ url, method }) => [url, method]),
    [
      ['https://mint.club/api/metadata/prepare', 'POST'],
      ['https://mint.club/api/metadata', 'PUT'],
    ],
  );
  const [prepare, update] = requests;
  assert.equal(prepare.fields.chainId, '8453');
  assert.equal(prepare.fields.tokenAddress, TOKEN_ADDRESS);
  assert.equal(prepare.fields.walletAddress, wallet.account?.address);
  assert.equal(prepare.fields.logo, logo);
  assert.equal(prepare.fields.website, '');
  assert.equal(prepare.fields.backgroundImage, '');
  assert.equal(prepare.fields.miniappUrls, '[]');
  assert.equal(prepare.fields.creatorComment, undefined);
  assert.equal(prepare.fields.signature, undefined);
  assert.equal(update.fields.nonce, challenge.nonce);
  assert.equal(update.fields.expiresAt, String(challenge.expiresAt));
  assert.equal(update.fields.message, undefined);
  assert.equal(
    await verifyMessage({
      address: wallet.account!.address,
      message: challenge.message,
      signature: update.fields.signature as Hex,
    }),
    true,
  );
  for (const [key, value] of Object.entries(prepare.fields)) assert.equal(update.fields[key], value);
});

test('initial metadata uses authenticated PUT and clears unspecified placeholder fields', async (t) => {
  const { token } = connectedToken();
  const requests: Record<string, FormDataEntryValue>[] = [];
  t.mock.method(globalThis, 'fetch', async (input: RequestInfo | URL, init?: RequestInit) => {
    assert.ok(init?.body instanceof FormData);
    requests.push(Object.fromEntries(init.body));
    assert.equal(
      String(input),
      requests.length === 1 ? 'https://mint.club/api/metadata/prepare' : 'https://mint.club/api/metadata',
    );
    assert.equal(init.method, requests.length === 1 ? 'POST' : 'PUT');
    return Response.json(requests.length === 1 ? challenge : {});
  });
  await token.createMintClubMetadata({ website: 'https://example.com', logo: undefined, miniappUrls: undefined });
  assert.equal(requests.length, 2);
  for (const fields of requests) {
    assert.equal(fields.website, 'https://example.com');
    for (const key of ['logo', 'backgroundImage', 'distributionPlan', 'creatorComment', 'externalDexUrl']) {
      assert.equal(fields[key], '');
    }
    assert.equal(fields.miniappUrls, '[]');
  }
});

test('prepare failure does not prompt for a signature or attempt an update', async (t) => {
  const { token, wallet } = connectedToken();
  const sign = t.mock.method(wallet, 'signMessage', async () => {
    throw new Error('Unexpected signature request');
  });
  const fetch = t.mock.method(globalThis, 'fetch', async () =>
    Response.json({ message: 'Token not deployed' }, { status: 400 }),
  );
  await assert.rejects(token.updateMintClubMetadata({ website: 'https://example.com' }), /status: 400/);
  assert.equal(fetch.mock.callCount(), 1);
  assert.equal(sign.mock.callCount(), 0);
});

test('signature cancellation leaves input reusable and does not submit metadata', async (t) => {
  const { token, wallet } = connectedToken();
  t.mock.method(wallet, 'signMessage', async () => {
    throw new Error('Signature cancelled');
  });
  const fetch = t.mock.method(globalThis, 'fetch', async () => Response.json(challenge));
  const input = { logo: new File(['logo'], 'logo.png', { type: 'image/png' }), website: 'https://example.com' };
  await assert.rejects(token.createMintClubMetadata(input), /Signature cancelled/);
  assert.equal(fetch.mock.callCount(), 1);
  assert.equal(await input.logo.text(), 'logo');
  assert.deepEqual(Object.keys(input), ['logo', 'website']);
});

test('browser wallets switch to the token chain before preparing and signing metadata', async (t) => {
  const account = privateKeyToAccount(TEST_PRIVATE_KEY);
  let chainId = 1;
  const events: string[] = [];
  const wallet = createWalletClient({
    account: account.address,
    chain: base,
    transport: custom({
      async request({ method, params }: { method: string; params?: readonly unknown[] }) {
        events.push(method);
        if (method === 'eth_chainId') return `0x${chainId.toString(16)}`;
        if (method === 'eth_accounts') return [account.address];
        if (method === 'wallet_switchEthereumChain') {
          assert.deepEqual(params, [{ chainId: '0x2105' }]);
          chainId = base.id;
          return null;
        }
        assert.equal(method, 'personal_sign');
        assert.equal(chainId, base.id);
        assert.equal(String(params?.[1]).toLowerCase(), account.address.toLowerCase());
        return account.signMessage({ message: { raw: params![0] as Hex } });
      },
    }),
  });
  const token = new MintClubSDK().withWalletClient(wallet).network('base').token(TOKEN_ADDRESS);
  t.mock.method(globalThis, 'fetch', async (input: RequestInfo | URL) => {
    const prepare = String(input).endsWith('/prepare');
    events.push(prepare ? 'prepare' : 'update');
    assert.equal(chainId, base.id);
    return Response.json(prepare ? challenge : {});
  });
  await token.updateMintClubMetadata({ website: 'https://example.com' });
  assert.ok(events.indexOf('wallet_switchEthereumChain') < events.indexOf('prepare'));
  assert.ok(events.indexOf('prepare') < events.indexOf('personal_sign'));
  assert.ok(events.indexOf('personal_sign') < events.indexOf('update'));
});

test('metadata is not signed when the selected wallet changes after preparation', async (t) => {
  const { token, wallet } = connectedToken();
  const sign = t.mock.method(wallet, 'signMessage', async () => {
    throw new Error('Unexpected signature request');
  });
  const fetch = t.mock.method(globalThis, 'fetch', async () => {
    t.mock.method(wallet, 'getAddresses', async () => [TOKEN_ADDRESS]);
    return Response.json(challenge);
  });
  await assert.rejects(token.updateMintClubMetadata({ website: 'https://example.com' }), /connected wallet changed/);
  assert.equal(fetch.mock.callCount(), 1);
  assert.equal(sign.mock.callCount(), 0);
});
