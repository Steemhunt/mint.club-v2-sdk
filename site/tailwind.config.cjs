/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./docs/**/*.{html,md,mdx,tsx,js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#15e6b7',
        bg: '#0b0c1b',
        borderGrey: '#2e3c51',
        buttonBorder: '#2e3c51',
        ethereum: '#627eea',
        btc: '#E19A2F',
        buttonBg: '#161e29',
        darkBg: '#191919',
        blue: 'rgba(72, 161, 255, 1)',
        grey: '#848795',
        twitter: '#08a0e9',
        darkGrey: '#4a4a4a',
        warning: '#ff9f1c',
        error: '#f82121',
        plus: '#f82121',
        burn: '#f82121',
        minus: '#1261c4',
        erc20: '#1261C4',
        erc1155: '#009369',
        freemint: '#c6f120',
        warpcast: '#794aee'
      }
    }
  },
  plugins: []
}
