import { afterEach, expect, mock, spyOn, test } from 'bun:test';
import { Ipfs } from '../src/helpers/IpfsHelper';

afterEach(() => mock.restore());

test('IPFS uploads only the selected byte view, including sliced Node Buffers', async () => {
  const backing = Uint8Array.from([99, 1, 2, 3, 88]);
  const inputs = [backing.subarray(1, 4), Buffer.from(backing).subarray(1, 4)];
  const fetch = spyOn(globalThis, 'fetch').mockImplementation(async (_url, options) => {
    const file = (options?.body as FormData).get('file') as File;
    expect(Array.from(new Uint8Array(await file.arrayBuffer()))).toEqual([1, 2, 3]);
    return Response.json({ cid: 'test-cid' });
  });
  for (const input of inputs) expect(await new Ipfs().add('test-key', input)).toBe('test-cid');
  expect(fetch).toHaveBeenCalledTimes(2);
});

test('Blob uploads preserve their contents and media type', async () => {
  spyOn(globalThis, 'fetch').mockImplementation(async (_url, options) => {
    const file = (options?.body as FormData).get('file') as File;
    expect(await file.text()).toBe('image-bytes');
    expect(file.type).toBe('image/png');
    return Response.json({ cid: 'image-cid' });
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
