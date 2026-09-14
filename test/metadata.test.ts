import { afterEach, expect, mock, spyOn, test } from 'bun:test';
import { createWalletClient, custom, verifyMessage } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { base } from 'viem/chains';
import { MintClubSDK } from '../src/MintClubSDK';
import { MetadataValidationError } from '../src/errors/sdk.errors';

const TEST_PRIVATE_KEY = `0x${'01'.repeat(32)}` as const;
const TOKEN_ADDRESS = '0x1111111111111111111111111111111111111111';

afterEach(() => mock.restore());

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

async function signMetadata({ token, wallet }: ReturnType<typeof connectedToken>) {
  const message = await token.getMetadataSignatureMessage();
  return { message, signature: await wallet.signMessage({ account: wallet.account!, message }) };
}

test('metadata message identifies the action, target, wallet and exact ten-minute validity window', async () => {
  const { token, wallet } = connectedToken();
  const issuedAt = 1_900_000_000_000;
  spyOn(Date, 'now').mockReturnValue(issuedAt);
  expect(await token.getMetadataSignatureMessage()).toBe(
    [
      'Mint Club token authorization',
      'Domain: mint.club',
      'Action: metadata',
      'Chain ID: 8453',
      `Token: ${TOKEN_ADDRESS.toLowerCase()}`,
      `Wallet: ${wallet.account!.address.toLowerCase()}`,
      `Issued at: ${issuedAt}`,
      `Expires at: ${issuedAt + 600000}`,
    ].join('\n'),
  );
});

test('metadata update preserves supplied authorization and adds the connected wallet address', async () => {
  const context = connectedToken();
  const { token, wallet } = context;
  const authorization = await signMetadata(context);
  const sign = spyOn(wallet, 'signMessage').mockImplementation(async () => {
    throw new Error('Unexpected signature request');
  });
  const logo = new File(['logo bytes'], 'logo.png', { type: 'image/png' });
  const fetch = spyOn(globalThis, 'fetch').mockImplementation(async (input: RequestInfo | URL, init?: RequestInit) => {
    expect(String(input)).toBe('https://mint.club/api/metadata');
    expect(init?.method).toBe('PUT');
    expect(init?.body).toBeInstanceOf(FormData);
    const { logo: uploadedLogo, ...fields } = Object.fromEntries(init!.body as FormData);
    expect(await (uploadedLogo as File).text()).toBe('logo bytes');
    expect(fields).toEqual({
      chainId: '8453',
      tokenAddress: TOKEN_ADDRESS,
      walletAddress: wallet.account!.address,
      ...authorization,
      website: '',
      backgroundImage: '',
      miniappUrls: '[]',
    });
    expect(await verifyMessage({ address: wallet.account!.address, ...authorization })).toBe(true);
    return Response.json({ website: null });
  });
  expect(
    await token.updateMintClubMetadata({ ...authorization, logo, website: '', backgroundImage: null, miniappUrls: [] }),
  ).toEqual({ website: null });
  expect(fetch).toHaveBeenCalledTimes(1);
  expect(sign).not.toHaveBeenCalled();
});

test('initial metadata uses authenticated PUT and clears unspecified placeholder fields', async () => {
  const context = connectedToken();
  const { token, wallet } = context;
  const authorization = await signMetadata(context);
  const fetch = spyOn(globalThis, 'fetch').mockImplementation(async (input: RequestInfo | URL, init?: RequestInit) => {
    expect(String(input)).toBe('https://mint.club/api/metadata');
    expect(init?.method).toBe('PUT');
    expect(init?.body).toBeInstanceOf(FormData);
    expect(Object.fromEntries(init!.body as FormData)).toEqual({
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
  expect(fetch).toHaveBeenCalledTimes(1);
});

test('initial metadata and updates reject missing authorization before sending requests', async () => {
  const context = connectedToken();
  const { token } = context;
  const authorization = await signMetadata(context);
  const fetch = spyOn(globalThis, 'fetch').mockImplementation(async () => {
    throw new Error('Unexpected request');
  });
  for (const save of [token.createMintClubMetadata.bind(token), token.updateMintClubMetadata.bind(token)]) {
    await expect(save({ ...authorization, signature: '', website: 'https://example.com' })).rejects.toBeInstanceOf(
      MetadataValidationError,
    );
    await expect(save({ ...authorization, message: '', website: 'https://example.com' })).rejects.toBeInstanceOf(
      MetadataValidationError,
    );
  }
  expect(fetch).not.toHaveBeenCalled();
});

test('failed metadata saves preserve image inputs for a retry after deployment', async () => {
  const context = connectedToken();
  const { token } = context;
  const authorization = await signMetadata(context);
  const fetch = spyOn(globalThis, 'fetch').mockImplementation(async () => Response.json({}, { status: 503 }));
  const logo = new File(['logo'], 'logo.png', { type: 'image/png' });
  const input = { ...authorization, logo, website: 'https://example.com' };
  await expect(token.createMintClubMetadata(input)).rejects.toThrow('status: 503');
  expect(fetch).toHaveBeenCalledTimes(1);
  expect(await input.logo.text()).toBe('logo');
  expect(input).toEqual({ ...authorization, logo, website: 'https://example.com' });
});
