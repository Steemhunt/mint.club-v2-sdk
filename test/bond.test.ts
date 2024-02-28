import { describe, expect, test } from 'bun:test';
import { bondContract, mintclub } from '../src';
import { LowerCaseChainNames } from '../src/constants/chains';
import { ALL_CHAINS, getCreationFee } from './utils';

/************************
           _       _   
 _ __ ___ (_)_ __ | |_ 
| '_ ` _ \| | '_ \| __|
| | | | | | | | | | |_ 
|_| |_| |_|_|_| |_|\__|
(_)__| |_   _| |__     
 / __| | | | | '_ \    
| (__| | |_| | |_) |   
 \___|_|\__,_|_.__/  

Made with ❤️ by @0xggoma

**************************/

// I'm only going to focus on how to call the SDK.
// If you are unsure about what to pass to the function, please refer to the test file below
// check: https://github.com/Steemhunt/mint.club-v2-contract/blob/main/test/Bond.test.js

// all the read/write functions are available below
// https://etherscan.io/address/0xc5a076cad94176c2996b32d8466be1ce757faa27#readContract
// typescript autocomplete will help you with the function names and arguments needed

// 1. READ CALL EXAMPLES
describe('Checking validity of contracts', () => {
  ALL_CHAINS.forEach((chain) => {
    test(`Checking ${chain} creationFee`, async () => {
      const fee = await mintclub.network(chain).read({
        functionName: 'creationFee',
        args: [],
      });

      expect(fee).toEqual(getCreationFee(chain));
    });
  });
});

describe('Read token counts', () => {
  ALL_CHAINS.forEach((chain) => {
    test(`Checking ${chain} token count`, async () => {
      const count = await mintclub.network(chain).read({
        functionName: 'tokenCount',
        args: [],
      });

      console.log(chain, count, 'tokens');
      expect(count).toBeGreaterThanOrEqual(0);
    });
  });
});

// 2. WRITE CALL EXAMPLES
// if you want further details on what to pass
// check: https://github.com/Steemhunt/mint.club-v2-contract/blob/main/test/Bond.test.js
// docs: https://docs.mint.club/

async function writeCalls() {
  // write call should automatically prompt the user to connect wallet & switch chains
  const account = await bondContract.network('sepolia').write({
    functionName: 'mint',
    args: ['0x...', 0n, 0n, '0x...'],
    onRequestSignature: () => {},
    onSigned: (tx) => {},
    onSuccess: (receipt) => {},
    onError: (error) => {},
  });

  // you could also pass the connected address
  const passed = await bondContract
    .network('sepolia')
    .withAccount('0x...')
    .write({
      functionName: 'mint',
      args: ['0x...', 0n, 0n, '0x...'],
      onRequestSignature: () => {},
      onSigned: (tx) => {},
      onSuccess: (receipt) => {},
      onError: (error) => {},
    });

  // you could also call it with a private key
  const privatekey = await bondContract
    .network('sepolia')
    .withPrivateKey('0x...') // with private key
    .write({
      functionName: 'mint',
      args: ['0x...', 0n, 0n, '0x...'],
      onRequestSignature: () => {},
      onSigned: (tx) => {},
      onSuccess: (receipt) => {},
      onError: (error) => {},
    });
}
