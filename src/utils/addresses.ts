import { randomBytes } from 'crypto';
import { bytesToHex, getAddress, hexToBytes, hexToString, keccak256, stringToHex } from 'viem';
import { getMintClubContractAddress, SdkSupportedChainIds, TokenType } from '../constants/contracts';

// our test code uses web3 library's soliditySha3 method
// below is our code to generate the same hash using "viem" library
// https://github.com/web3/web3.js/blob/f860b0481d7c1ef09ddaeb33098b2253ca694150/packages/web3-utils/src/hash.ts#L346C17-L346C17
export function computeCreate2Address(chainId: number, tokenType: TokenType, tokenSymbol: string) {
  const bondAddress = getMintClubContractAddress('BOND', chainId as SdkSupportedChainIds);
  const tokenImplementation = getMintClubContractAddress(
    tokenType === 'ERC20' ? 'ERC20' : 'ERC1155',
    chainId as SdkSupportedChainIds,
  );
  const hexedSymbol = stringToHex(tokenSymbol);

  const packed: `0x${string}` = `0x${[bondAddress, hexedSymbol]
    .map((x) => x?.replace('0x', ''))
    .join('')
    .toLowerCase()}`;

  const salt = keccak256(packed);

  const creationCode = [
    '0x3d602d80600a3d3981f3363d3d373d3d3d363d73',
    tokenImplementation?.replace(/0x/, '').toLowerCase(),
    '5af43d82803e903d91602b57fd5bf3',
  ].join('') as `0x${string}`;

  const params: `0x${string}` = `0x${['ff', bondAddress, salt, keccak256(creationCode)]
    .map((x) => x?.replace(/0x/, ''))
    .join('')}`;

  const hexed = hexToBytes(params);
  const hash = keccak256(hexed);
  const address = getAddress(`0x${hash.slice(-40)}`);

  return address;
}

export function createRandomAddress() {
  const randBytes = randomBytes(20);
  return bytesToHex(randBytes);
}
