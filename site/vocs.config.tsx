import * as React from 'react'
import { defineConfig } from 'vocs'
import { sidebar } from './docs/sidebar'

export default defineConfig({
  head: (
    <>
      <link rel="icon" href="https://mint.club/favicon.ico" type="image/x-icon" sizes="16x16" />
      <meta property="og:type" content="website" />
      <meta property="og:title" content="Mint.club V2 SDK Documentation" />
      <meta property="og:image" content="https://vocs.dev/api/og?logo=%logo&title=%title&description=%description" />
      <meta property="og:url" content="https://sdk.mint.club" />
      <meta property="og:description" content="Create and Trade Bonding Curve Tokens / NFTs with Automated Liquidity" />
    </>
  ),
  ogImageUrl: 'https://vocs.dev/api/og?logo=%logo&title=%title&description=%description',
  title: 'Mint.club V2 SDK Documentation',
  description: 'Create and Trade Bonding Curve Tokens / NFTs with Automated Liquidity',
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
