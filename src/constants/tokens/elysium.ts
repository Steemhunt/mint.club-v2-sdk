// Canonical Elysium tokens: the Arbitrum-bridge representations of HyperEVM tokens, verified on-chain on 2026-11-09.
// Look-alike tokens with the same symbols exist on the explorer, so keep these addresses pinned.
// Their HyperEVM originals, which DefiLlama prices, are mapped in ../usd/fallbackUsdMap.ts.
// Ref: https://elysium.kinetiq.xyz/tokens?canonical=true
export const ELYSIUM_TOKENS = {
  '0xbA876237B0F021A6c6D852d6c26E107997cC5E81': {
    name: 'Wrapped HYPE',
    symbol: 'WHYPE',
    address: '0xbA876237B0F021A6c6D852d6c26E107997cC5E81',
    decimals: 18,
    image: 'https://assets.coingecko.com/coins/images/50882/standard/hyperliquid.jpg?1729431300',
  },
  '0xb47c4C8F73F009CC0C0d3f92B388d13E293F0B65': {
    name: 'USD Coin',
    symbol: 'USDC',
    address: '0xb47c4C8F73F009CC0C0d3f92B388d13E293F0B65',
    decimals: 6,
    image: 'https://mint.club/assets/tokens/usdc.png',
  },
  '0xe45a355d9e9cAd2aD85F2d03E3eE3102A036acF0': {
    name: 'Kinetiq Governance Token',
    symbol: 'KNTQ',
    address: '0xe45a355d9e9cAd2aD85F2d03E3eE3102A036acF0',
    decimals: 18,
    image: 'https://assets.coingecko.com/coins/images/70252/standard/kntq.png?1761279547',
  },
  '0x248888D396A546A69A188f3Deb476964e581E9d0': {
    name: 'Kinetiq Staked HYPE',
    symbol: 'kHYPE',
    address: '0x248888D396A546A69A188f3Deb476964e581E9d0',
    decimals: 18,
    image: 'https://assets.coingecko.com/coins/images/67388/standard/khype.png?1752632397',
  },
  '0x3BdE42a1dA8F1D95564f2c4a51a0cF73a725674C': {
    name: 'USDT0',
    symbol: 'USDT0',
    address: '0x3BdE42a1dA8F1D95564f2c4a51a0cF73a725674C',
    decimals: 6,
    image: 'https://assets.coingecko.com/coins/images/53705/standard/usdt0.jpg?1737086183',
  },
  '0xE9C29585EAe4B9a55b02a9605AEa892B40d972E8': {
    name: 'Unit Bitcoin',
    symbol: 'UBTC',
    address: '0xE9C29585EAe4B9a55b02a9605AEa892B40d972E8',
    decimals: 8,
    image: 'https://assets.coingecko.com/coins/images/55066/standard/ubtc.jpg?1743580113',
  },
  '0x7A66A75fe41Bc26867C17fe1bc7D1C076EBd4eCd': {
    name: 'Unit Ethereum',
    symbol: 'UETH',
    address: '0x7A66A75fe41Bc26867C17fe1bc7D1C076EBd4eCd',
    decimals: 18,
    image: 'https://assets.coingecko.com/coins/images/55069/standard/eth.jpg?1743582414',
  },
} as const;
