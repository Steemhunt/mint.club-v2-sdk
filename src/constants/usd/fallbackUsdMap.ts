import { apeChain, base, degen, hashkey, ham, mainnet, unichain, cyber } from 'viem/chains';
import { over } from '../contracts';

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
  [degen.id]: {
    // DEGEN -> mainnet DEGEN price
    '0xEb54dACB4C2ccb64F8074eceEa33b5eBb38E5387': {
      network: base.id,
      address: '0x4ed4E862860beD51a9570b96d89aF5E1B0Efefed',
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
  [cyber.id]: {
    // Cyber WETH -> Mainnet WETH
    '0x4200000000000000000000000000000000000006': {
      network: mainnet.id,
      address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
    },
  },
};
