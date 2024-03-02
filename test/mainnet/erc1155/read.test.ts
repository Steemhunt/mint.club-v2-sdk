import { describe, expect, test } from 'bun:test';
import { arbitrum, avalanche, base, bsc, mainnet, optimism, polygon } from 'viem/chains';
import { mintclub, MainnetChain, chainIdToString } from '../../../src';
import { createRandomAddress } from '../../../src/utils/addresses';

type ERC1155Token = {
  symbol: string;
  address: `0x${string}`;
};

const TEST_ERC1155_COINS: Record<MainnetChain, ERC1155Token> = {
  [mainnet.id]: { symbol: '1ETH', address: '0x1AAfCa30fC30CbE54aCcCB96824A491dF4bCC0a8' },
  [optimism.id]: { symbol: 'GMFRIENDS', address: '0xF8c3E0f551Ba9278e743Dd0962c9130Ec6dd8fD0' },
  [arbitrum.id]: { symbol: 'KKD', address: '0x646786E02dfD36597F9bd300B30105E6076A6d85' },
  [avalanche.id]: { symbol: 'POST', address: '0x05F6844b96c00D86Df6F74797884bBFBfF7c1B63' },
  [polygon.id]: { symbol: 'SATO', address: '0xe67511c1151A94b90BecFFCfe1fBd463584D2116' },
  [bsc.id]: { symbol: 'BNBC', address: '0xEe959cB446a21B90eB79167421F64557c513Fd96' },
  [base.id]: { symbol: 'COINGERKN', address: '0x944D61812c0fd1791869C369DA1a1836b88AeB62' },
} as const;

function testAll(cb: (chainId: MainnetChain, token: ERC1155Token) => void) {
  Object.keys(TEST_ERC1155_COINS).forEach((_chainId) => {
    const chainId = Number(_chainId) as MainnetChain;
    cb(chainId, TEST_ERC1155_COINS[chainId]);
  });
}

describe('ERC1155 computeCreate2Address', () => {
  testAll((chainId, token) => {
    const { symbol, address } = token;
    test(`${chainIdToString(chainId)} - ${symbol} ${address}`, () => {
      const computed = mintclub.network(chainId).nft(symbol).getTokenAddress();
      expect(computed).toEqual(address);
    });
  });
});

describe('ERC1155 token exists', () => {
  testAll((chainId, token) => {
    const { symbol, address } = token;
    test(`${chainIdToString(chainId)} - ${symbol} ${address}`, async () => {
      const exists = await mintclub.network(chainId).nft(symbol).exists();
      expect(exists).toEqual(true);
    });
  });
});

describe('ERC1155 token does NOT exist', () => {
  testAll((chainId, token) => {
    const { symbol } = token;
    const fakeSymbol = symbol + Date.now();
    test(`${chainIdToString(chainId)} - ${fakeSymbol}`, async () => {
      const exists = await mintclub.network(chainId).nft(fakeSymbol).exists();
      expect(exists).toEqual(false);
    });
  });
});

describe('ERC1155 decimals should equal 0', () => {
  testAll((chainId, token) => {
    const { symbol, address } = token;
    test(`Chain ${chainIdToString(chainId)} - ${symbol} ${address}`, async () => {
      const decimals = await mintclub.network(chainId).nft(symbol).getDecimals();
      expect(decimals).toEqual(0);
    });
  });
});

describe('ERC1155 read name, symbol, and totalSupply', () => {
  testAll((chainId, token) => {
    const { symbol, address } = token;
    test(`Chain ${chainIdToString(chainId)} - ${symbol} ${address}`, async () => {
      const name = await mintclub.network(chainId).nft(symbol).getName();
      const tokenSymbol = await mintclub.network(chainId).nft(symbol).getSymbol();
      const totalSupply = await mintclub.network(chainId).nft(symbol).getTotalSupply();

      expect(name).toBeString();
      expect(tokenSymbol).toBeString();
      expect(totalSupply).toBeDefined();
      expect(Number(totalSupply)).toBeNumber();
    });
  });
});

describe('ERC1155 balance of fake address should be 0n', () => {
  testAll((chainId, token) => {
    const { symbol } = token;
    const fakeAddress = createRandomAddress();
    test(`Chain ${chainIdToString(chainId)} - ${symbol} FakeAddress: ${fakeAddress}`, async () => {
      const balance = await mintclub.network(chainId).nft(symbol).getBalanceOf(fakeAddress);
      expect(balance).toEqual(0n);
    });
  });
});
