import { expect, describe, test } from 'bun:test';
import { mintclub } from '../../src';

describe('Upload to ipfs', () => {
  test(`Upload to IPFS`, async () => {
    const buffer = await (await fetch('https://picsum.photos/200')).arrayBuffer();
    const hash = await mintclub.ipfs.upload({
      filebaseApiKey: process.env.FILEBASE_API_KEY!,
      media: new Blob([buffer], { type: 'image/png' }),
    });
    console.log(hash);
    expect(hash).toBeDefined();
  });
});
