import { expect, describe, test } from 'bun:test';
import { mintclub } from '../../src';

describe('Upload to ipfs', () => {
  test(`Upload to IPFS`, async () => {
    const buffer = await (await fetch('https://picsum.photos/200')).arrayBuffer();
    const hash = await mintclub.uploadToIpfs(process.env.FILEBASE_API_KEY!, new Blob([buffer]));
    console.log(hash);
    expect(hash).toBeDefined();
  });
});
