# Mint Club V2 Bond Contract SDK

This SDK enables seamless interaction with Mint Club's smart contracts, offering both read and write capabilities across multiple blockchain networks.

## Quick Start

**Installation:**

```bash
npm install test-mint.club-v2-sdk
```

**Basic Usage:**

**Read Contract:**

To query contract details such as `creationFee` and `tokenCount`:

```typescript
import { bondContract } from 'test-mint.club-v2-sdk';
import { LowerCaseChainNames } from 'test-mint.club-v2-sdk/constants/chains';

async function readContract() {
  // chain can be ['ethereum', 'optimism', 'arbitrum', 'avalanche', 'polygon', 'bnbchain', 'base']

  // reads the bond contract fee on ethereum network
  const fee = await bondContract.network('ethereum').read({
    functionName: 'creationFee',
    args: [],
  });
  console.log(`${chain} creation fee:`, fee);

  // counts the tokens on base network
  const count = await bondContract.network('base').read({
    functionName: 'tokenCount',
    args: [],
  });
  console.log(`${chain} token count:`, count);
}
```

**Write Contract:**

To execute write operations, such as minting tokens:

```typescript
async function mintToken() {
  // write call should automatically prompt the user to connect wallet & switch chains
  const txReceipt = await bondContract.network('sepolia').write({
    functionName: 'mint',
    args: ['0x...', 1n, 1n, '0x...'],
    onRequestSignature: () => {},
    onSigned: (tx) => console.log(`Transaction signed: ${tx}`),
    onSuccess: (receipt) => console.log(`Transaction successful: ${receipt}`),
    onError: (error) => console.log(`Error: ${error}`),
  });

  // you could also pass the connected address
  const txReceipt = await bondContract
    .network('sepolia')
    .withAccount('0x...')
    .write({
      functionName: 'mint',
      args: ['0x...', 0n, 0n, '0x...'],
      onRequestSignature: () => {},
      onSigned: (tx) => console.log(`Transaction signed: ${tx}`),
      onSuccess: (receipt) => console.log(`Transaction successful: ${receipt}`),
      onError: (error) => console.log(`Error: ${error}`),
    });

  // you could also call it with a private key
  const txReceipt = await bondContract
    .network('sepolia')
    .withPrivateKey('0x...') // with private key
    .write({
      functionName: 'mint',
      args: ['0x...', 0n, 0n, '0x...'],
      onRequestSignature: () => {},
      onSigned: (tx) => console.log(`Transaction signed: ${tx}`),
      onSuccess: (receipt) => console.log(`Transaction successful: ${receipt}`),
      onError: (error) => console.log(`Error: ${error}`),
    });
}
```

## Disclaimer

This version is a test only version, and can be changed any time.
