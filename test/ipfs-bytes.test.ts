import { afterEach, expect, mock, spyOn, test } from 'bun:test';
import { Ipfs } from '../src/helpers/IpfsHelper';

afterEach(() => mock.restore());

test('IPFS uploads only the selected byte view, including sliced Node Buffers', async () => {
  const backing = Uint8Array.from([99, 1, 2, 3, 88]);
  const inputs = [backing.subarray(1, 4), Buffer.from(backing).subarray(1, 4)];
  const fetch = spyOn(globalThis, 'fetch').mockImplementation(async (url, options) => {
    expect(String(url)).toBe('https://rpc.filebase.io/api/v0/add');
    expect(options?.method).toBe('POST');
    expect(options?.headers).toEqual({ Authorization: 'Bearer test-key' });
    const file = (options?.body as FormData).get('file') as File;
    expect(Array.from(new Uint8Array(await file.arrayBuffer()))).toEqual([1, 2, 3]);
    return Response.json({ Hash: 'test-cid', Name: 'blob', Size: '3' });
  });
  for (const input of inputs) expect(await new Ipfs().add('test-key', input)).toBe('test-cid');
  expect(fetch).toHaveBeenCalledTimes(2);
});

test('Blob uploads preserve their contents and media type', async () => {
  spyOn(globalThis, 'fetch').mockImplementation(async (url, options) => {
    expect(String(url)).toBe('https://rpc.filebase.io/api/v0/add');
    expect(options?.method).toBe('POST');
    expect(options?.headers).toEqual({ Authorization: 'Bearer test-key' });
    const file = (options?.body as FormData).get('file') as File;
    expect(await file.text()).toBe('image-bytes');
    expect(file.type).toBe('image/png');
    return Response.json({ Hash: 'image-cid', Name: 'blob', Size: '11' });
  });
  expect(await new Ipfs().add('test-key', new Blob(['image-bytes'], { type: 'image/png' }))).toBe('image-cid');
});

test('metadata HTTP URLs remain usable while IPFS hashes resolve through the gateway', () => {
  const ipfs = new Ipfs();
  expect(ipfs.hashToGatewayUrl('https://example.com/nft.json')).toBe('https://example.com/nft.json');
  expect(ipfs.hashToGatewayUrl('http://example.com/nft.json')).toBe('http://example.com/nft.json');
  expect(ipfs.hashToGatewayUrl('ipfs://test-cid')).toBe('https://ipfs.io/ipfs/test-cid');
  expect(ipfs.hashToGatewayUrl('test-cid', 'https://gateway.example/ipfs/')).toBe(
    'https://gateway.example/ipfs/test-cid',
  );
});

test('upload failures and missing hashes reject before an invalid IPFS URL can be returned', async () => {
  const upload = spyOn(globalThis, 'fetch').mockImplementation(
    async () => new Response('Unavailable', { status: 503 }),
  );
  await expect(new Ipfs().add('test-key', new Blob(['bytes']))).rejects.toThrow(
    'Filebase upload failed: 503 Unavailable',
  );
  upload.mockResolvedValue(Response.json({ Name: 'blob' }));
  await expect(new Ipfs().add('test-key', new Blob(['bytes']))).rejects.toThrow('did not include an IPFS hash');
});
