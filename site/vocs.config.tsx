import { defineConfig } from 'vocs'
import { sidebar } from './docs/sidebar'

export default defineConfig({
  head: (
    <>
      <link rel="icon" href="https://mint.club/favicon.ico" type="image/x-icon" sizes="16x16" />
      <meta property="og:type" content="website" />
      <meta property="og:title" content="Mint Club V2 SDK" />
      <meta property="og:image" content="https://vocs.dev/api/og?logo=%logo&title=%title&description=%description" />
      <meta property="og:url" content="https://sdk.mint.club" />
      <meta
        property="og:description"
        content="TypeScript tools for creating, trading, and managing Mint Club bonding curve assets."
      />
    </>
  ),
  ogImageUrl: 'https://vocs.dev/api/og?logo=%logo&title=%title&description=%description',
  title: 'Mint Club V2 SDK',
  description: 'TypeScript tools for creating, trading, and managing Mint Club bonding curve assets.',
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
