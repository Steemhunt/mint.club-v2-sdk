export const UNICHAIN_TOKENS = {
  '0x4200000000000000000000000000000000000006': {
    name: 'Wrapped Ether',
    symbol: 'WETH',
    address: '0x4200000000000000000000000000000000000006',
    decimals: 18,
    image: '/assets/tokens/weth.png',
  },
  '0x078D782b760474a361dDA0AF3839290b0EF57AD6': {
    name: 'USD Coin',
    symbol: 'USDC',
    address: '0x078D782b760474a361dDA0AF3839290b0EF57AD6',
    decimals: 6,
    image: '/assets/tokens/usdc.png',
  },
  '0x8f187aA05619a017077f5308904739877ce9eA21': {
    name: 'Uniswap',
    symbol: 'UNI',
    address: '0x8f187aA05619a017077f5308904739877ce9eA21',
    decimals: 18,
    image: '/assets/tokens/uni.png',
  },
  '0x20CAb320A855b39F724131C69424240519573f81': {
    name: 'Dai Stablecoin',
    symbol: 'DAI',
    address: '0x20CAb320A855b39F724131C69424240519573f81',
    decimals: 18,
    image: '/assets/tokens/dai.png',
  },
} as const;
