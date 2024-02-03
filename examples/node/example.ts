import {
  supportedChains,
  supportedChainsMap, // or you can use a map
  bondContract,
} from 'test-mint.club-v2-sdk';

for (const name of supportedChains) {
  const fee = await bondContract.network(name).read({
    functionName: 'creationFee',
    args: [],
  });
  console.log(name, `creation fee:`, fee);
}

// or you can pass an id
const chainId = supportedChainsMap['ethereum']; // 1

const fee = await bondContract.network(chainId).read({
  functionName: 'creationFee',
  args: [],
});

console.log(chainId, `creation fee:`, fee);

process.exit(0);
