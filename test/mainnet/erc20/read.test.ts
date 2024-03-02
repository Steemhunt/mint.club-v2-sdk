import { describe, expect, test } from 'bun:test';
import { arbitrum, avalanche, base, bsc, mainnet, optimism, polygon } from 'viem/chains';
import { mintclub, MainnetChain, chainIdToString } from '../../../src';
import { createRandomAddress } from '../../../src/utils/addresses';

type ERC20Token = {
  symbol: string;
  address: `0x${string}`;
};

const TEST_ERC20_COINS: Record<MainnetChain, ERC20Token> = {
  [mainnet.id]: { symbol: 'SBNOMA', address: '0xe9cA66202233beBFb4cC3b54cD73b9f90AC6ba3f' },
  [optimism.id]: { symbol: 'TOKYO', address: '0x8046fb6b61Ac1b501a9a9aF0d8367f45eac1a84F' },
  [arbitrum.id]: { symbol: 'KUKO', address: '0x0a69068aE17882B9E50778bA9a501600a11993b2' },
  [avalanche.id]: { symbol: 'SNOW', address: '0xbb04B880714aAd2d06037c8fc92Be96F27802b43' },
  [polygon.id]: { symbol: 'MOON', address: '0x6DF5e5692247A513ab74cB45AE8b0636A43b218E' },
  [bsc.id]: { symbol: 'SBSEK', address: '0xC92603295630cfD79Edab6b461c5259CF3b5127B' },
  [base.id]: { symbol: 'CHICKEN', address: '0x13c2Bc9B3b8427791F700cB153314b487fFE8F5e' },
} as const;

function testAll(cb: (chainId: MainnetChain, token: ERC20Token) => void) {
  Object.keys(TEST_ERC20_COINS).forEach((_chainId) => {
    const chainId = Number(_chainId) as MainnetChain;
    cb(chainId, TEST_ERC20_COINS[chainId]);
  });
}

describe('ERC20 computeCreate2Address', () => {
  testAll((chainId, token) => {
    const { symbol, address } = token;
    test(`${chainIdToString(chainId)} - ${symbol} ${address}`, () => {
      const computed = mintclub.network(chainId).token(symbol).getTokenAddress();
      expect(computed).toEqual(address);
    });
  });
});

describe('ERC20 token exists', () => {
  testAll((chainId, token) => {
    const { symbol, address } = token;
    test(`${chainIdToString(chainId)} - ${symbol} ${address}`, async () => {
      const exists = await mintclub.network(chainId).token(symbol).exists();
      expect(exists).toEqual(true);
    });
  });
});

describe('ERC20 token does NOT exist', () => {
  testAll((chainId, token) => {
    const { symbol } = token;
    const fakeSymbol = symbol + Date.now();
    test(`${chainIdToString(chainId)} - ${fakeSymbol}`, async () => {
      const exists = await mintclub.network(chainId).token(fakeSymbol).exists();
      expect(exists).toEqual(false);
    });
  });
});

describe('ERC20 decimals should equal 18', () => {
  testAll((chainId, token) => {
    const { symbol, address } = token;
    test(`Chain ${chainIdToString(chainId)} - ${symbol} ${address}`, async () => {
      const decimals = await mintclub.network(chainId).token(symbol).getDecimals();
      expect(decimals).toEqual(18);
    });
  });
});

describe('ERC20 read name, symbol, and totalSupply', () => {
  testAll((chainId, token) => {
    const { symbol, address } = token;
    test(`Chain ${chainIdToString(chainId)} - ${symbol} ${address}`, async () => {
      const name = await mintclub.network(chainId).token(symbol).getName();
      const tokenSymbol = await mintclub.network(chainId).token(symbol).getSymbol();
      const totalSupply = await mintclub.network(chainId).token(symbol).getTotalSupply();

      expect(name).toBeString();
      expect(tokenSymbol).toBeString();
      expect(totalSupply).toBeDefined();
      expect(Number(totalSupply)).toBeNumber();
    });
  });
});

describe('ERC20 balance of fake address should be 0n', () => {
  testAll((chainId, token) => {
    const { symbol } = token;
    const fakeAddress = createRandomAddress();
    test(`Chain ${chainIdToString(chainId)} - ${symbol} FakeAddress: ${fakeAddress}`, async () => {
      const balance = await mintclub.network(chainId).token(symbol).getBalanceOf(fakeAddress);
      expect(balance).toEqual(0n);
    });
  });
});
