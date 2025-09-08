import { describe, expect, test } from 'bun:test';
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

  test(`Upload JSON array of wallet addresses to IPFS`, async () => {
    // Create sample wallet addresses array (similar to airdrop scenario)
    const walletAddresses = [
      '0x742d35Cc6597C0539fB4738c6f7F8c6a9E5c1b8b',
      '0x8ba1f109551bD4328030126452610d884f94C8288',
      '0x1234567890123456789012345678901234567890',
      '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd',
      '0x1111111111111111111111111111111111111111',
    ];

    // Convert to JSON string (similar to TokenHelper.createAirdrop)
    const json = JSON.stringify(walletAddresses, null, 2);

    // Convert to Uint8Array for IPFS upload (as implemented in the fix)
    const blob = new Blob([json], { type: 'application/json' });
    const arrayBuffer = await blob.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);

    // Upload to IPFS
    const hash = await mintclub.ipfs.upload({
      filebaseApiKey: process.env.FILEBASE_API_KEY!,
      media: uint8Array,
    });

    console.log('Wallet addresses IPFS hash:', hash);
    expect(hash).toBeDefined();
    expect(hash).toStartWith('ipfs://');
    expect(hash.length).toBeGreaterThan(7); // ipfs:// + hash
  });
});
