export const BLAST_SEPOLIA_TOKENS = {
  '0x4200000000000000000000000000000000000023': {
    name: 'Wrapped Ether',
    symbol: 'WETH',
    address: '0x4200000000000000000000000000000000000023',
    decimals: 18,
    image: {
      small: 'https://mint.club/assets/tokens/small/weth.png',
      large: 'https://mint.club/assets/tokens/large/weth.png',
    },
  },
  '0x4200000000000000000000000000000000000022': {
    name: 'USDBlast',
    symbol: 'USDB',
    address: '0x4200000000000000000000000000000000000022',
    decimals: 18,
    image: {
      small: 'https://mint.club/assets/tokens/small/blast.png',
      large: 'https://mint.club/assets/tokens/large/blast.png',
    },
  },
} as const;
