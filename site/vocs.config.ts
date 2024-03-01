import { defineConfig } from 'vocs'
import { sidebar } from './docs/sidebar'

export default defineConfig({
  ogImageUrl: 'https://vocs.dev/api/og?logo=%logo&title=%title&description=%description',
  title: 'Mint.club V2 SDK Documentation',
  description:
    'Create a custom bonding curve token/NFT on mint.club using your preferred ERC20, instantly tradable & monetizable.',
  logoUrl: 'https://mint.club/assets/icons/mint-logo.png',
  sidebar,
  theme: {
    accentColor: '#15e6b7',
    colorScheme: 'dark',
  },
  // font: {
  //   google: 'Raleway',
  // },
})
