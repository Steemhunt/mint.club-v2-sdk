import { apeChain, base, hashkey, ham, hyperEvm, mainnet, unichain, cyber } from 'viem/chains';
import { elysium, over, robinhood } from '../contracts';

type Address = `0x${string}`;
export type FallbackUsdMap = Record<number, Record<Address, { network: number; address: Address }>>;

export const FALLBACK_USD_MAP: FallbackUsdMap = {
  [hashkey.id]: {
    // WHSK -> mainnet HSK price
    '0xB210D2120d57b758EE163cFfb43e73728c471Cf1': {
      network: mainnet.id,
      address: '0xE7C6BF469e97eEB0bFB74C8dbFF5BD47D4C1C98a',
    },
  },
  [apeChain.id]: {
    // APE -> mainnet APE price
    '0x48b62137EdfA95a428D35C09E44256a739F6B557': {
      network: mainnet.id,
      address: '0x4d224452801ACEd8B2F0aebE155379bb5D594381',
    },
  },
  [ham.id]: {
    // HAM native token -> base remap
    '0xe8dd44D0791B73aFE9066C3A77721F42D0844bEB': {
      network: base.id,
      address: '0x5B5dee44552546ECEA05EDeA01DCD7Be7aa6144A',
    },
  },
  [unichain.id]: {
    // Unichain WETH -> Mainnet WETH
    '0x4200000000000000000000000000000000000006': {
      network: mainnet.id,
      address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
    },
  },
  [robinhood.id]: {
    // Robinhood WETH -> Mainnet WETH
    '0x0Bd7D308f8E1639FAb988df18A8011f41EAcAD73': {
      network: mainnet.id,
      address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
    },
  },
  [cyber.id]: {
    // Cyber WETH -> Mainnet WETH
    '0x4200000000000000000000000000000000000006': {
      network: mainnet.id,
      address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
    },
  },
  [elysium.id]: {
    // Elysium tokens are canonical bridges of HyperEVM tokens. DefiLlama does not index Elysium yet
    // (DefiLlama/DefiLlama-Adapters#22090), so each one is priced as its HyperEVM original.
    // WHYPE -> HyperEVM WHYPE
    '0xbA876237B0F021A6c6D852d6c26E107997cC5E81': {
      network: hyperEvm.id,
      address: '0x5555555555555555555555555555555555555555',
    },
    // USDC -> HyperEVM USDC
    '0xb47c4C8F73F009CC0C0d3f92B388d13E293F0B65': {
      network: hyperEvm.id,
      address: '0xb88339CB7199b77E23DB6E890353E22632Ba630f',
    },
    // KNTQ -> HyperEVM KNTQ
    '0xe45a355d9e9cAd2aD85F2d03E3eE3102A036acF0': {
      network: hyperEvm.id,
      address: '0x000000000000780555bD0BCA3791f89f9542c2d6',
    },
    // kHYPE -> HyperEVM kHYPE
    '0x248888D396A546A69A188f3Deb476964e581E9d0': {
      network: hyperEvm.id,
      address: '0xfD739d4e423301CE9385c1fb8850539D657C296D',
    },
    // USDT0 -> HyperEVM USDT0
    '0x3BdE42a1dA8F1D95564f2c4a51a0cF73a725674C': {
      network: hyperEvm.id,
      address: '0xB8CE59FC3717ada4C02eaDF9682A9e934F625ebb',
    },
    // UBTC -> HyperEVM UBTC
    '0xE9C29585EAe4B9a55b02a9605AEa892B40d972E8': {
      network: hyperEvm.id,
      address: '0x9FDBdA0A5e284c32744D2f17Ee5c74B284993463',
    },
    // UETH -> HyperEVM UETH
    '0x7A66A75fe41Bc26867C17fe1bc7D1C076EBd4eCd': {
      network: hyperEvm.id,
      address: '0xBe6727B535545C67d5cAa73dEa54865B92CF7907',
    },
  },
};
