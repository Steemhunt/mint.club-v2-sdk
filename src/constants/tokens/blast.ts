export const BLAST_TOKENS = {
  '0x4300000000000000000000000000000000000004': {
    name: 'Wrapped Ether',
    symbol: 'WETH',
    address: '0x4300000000000000000000000000000000000004',
    decimals: 18,
    image: {
      small: 'https://mint.club/assets/tokens/small/weth.png',
      large: 'https://mint.club/assets/tokens/large/weth.png',
    },
  },
  '0x4300000000000000000000000000000000000003': {
    name: 'USDBlast',
    symbol: 'USDB',
    address: '0x4300000000000000000000000000000000000003',
    decimals: 18,
    image: {
      small: 'https://mint.club/assets/tokens/small/blast.png',
      large: 'https://mint.club/assets/tokens/large/blast.png',
    },
  },
} as const;
