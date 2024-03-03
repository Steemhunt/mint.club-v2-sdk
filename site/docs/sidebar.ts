import type { Sidebar } from 'vocs'

export const sidebar = {
  '/docs/': [
    {
      text: 'Introduction',
      items: [
        {
          text: 'Why Mint.club?',
          link: '/docs/why-mint-club',
        },
        {
          text: 'Getting Started',
          link: '/docs/getting-started',
        },
        {
          text: 'Contracts',
          link: '/docs/contracts',
        },
        {
          text: 'Curve Design',
          link: '/docs/curve-design',
        },
        {
          text: 'FAQ',
          link: '/docs/faq',
        },
      ],
    },

    {
      text: 'Mint.club v2 SDK 📦',
      items: [
        {
          text: '️🚩 Start here',
          link: '/docs/sdk/introduction',
        },
        {
          text: '🌐 network',
          link: '/docs/sdk/network',
          collapsed: false,
        },
        {
          text: '🪙 token',
          link: '/docs/sdk/network/token',
          collapsed: false,
          items: [
            {
              text: 'create',
              link: '/docs/sdk/network/token/create',
            },
            {
              text: 'approve',
              link: '/docs/sdk/network/token/approve',
            },
            {
              text: 'buy',
              link: '/docs/sdk/network/token/buy',
            },
            {
              text: 'transfer',
              link: '/docs/sdk/network/token/transfer',
            },
            {
              text: 'getPriceForNextMint',
              link: '/docs/sdk/network/token/getPriceForNextMint',
            },
            {
              text: 'getAllowance',
              link: '/docs/sdk/network/token/getAllowance',
            },
            {
              text: 'getBalanceOf',
              link: '/docs/sdk/network/token/getBalanceOf',
            },
            {
              text: 'getBondAddress',
              link: '/docs/sdk/network/token/getBondAddress',
            },
            {
              text: 'getDecimals',
              link: '/docs/sdk/network/token/getDecimals',
            },
            {
              text: 'getName',
              link: '/docs/sdk/network/token/getName',
            },
            {
              text: 'getSymbol',
              link: '/docs/sdk/network/token/getSymbol',
            },
            {
              text: 'getTotalSupply',
              link: '/docs/sdk/network/token/getTotalSupply',
            },
          ],
        },
        {
          text: '🖼️ nft',
          link: '/docs/sdk/network/nft',
          collapsed: true,
          items: [
            {
              text: 'create',
              link: '/docs/sdk/network/nft/create',
            },
            {
              text: 'getBalanceOf',
              link: '/docs/sdk/network/nft/getBalanceOf',
            },
            {
              text: 'getBalanceOfBatch',
              link: '/docs/sdk/network/nft/getBalanceOfBatch',
            },
            {
              text: 'getContractURI',
              link: '/docs/sdk/network/nft/getContractURI',
            },
            {
              text: 'getDecimals',
              link: '/docs/sdk/network/nft/getDecimals',
            },
            {
              text: 'getIsApprovedForAll',
              link: '/docs/sdk/network/nft/getIsApprovedForAll',
            },
            {
              text: 'getName',
              link: '/docs/sdk/network/nft/getName',
            },
            {
              text: 'getSupportsInterface',
              link: '/docs/sdk/network/nft/getSupportsInterface',
            },
            {
              text: 'getSymbol',
              link: '/docs/sdk/network/nft/getSymbol',
            },
            {
              text: 'getTotalSupply',
              link: '/docs/sdk/network/nft/getTotalSupply',
            },
            {
              text: 'getUri',
              link: '/docs/sdk/network/nft/getUri',
            },
          ],
        },
        {
          text: '📈 bond',
          collapsed: true,
          items: [
            {
              text: 'getCreationFee',
              link: '/docs/sdk/network/bond/getCreationFee',
            },
          ],
        },
        {
          text: '🪂 airdrop',
          link: '/docs/sdk/network/airdrop',
          collapsed: true,
        },
        {
          text: '🔒lockup',
          link: '/docs/sdk/network/lockup',
          collapsed: true,
        },
        {
          text: '📝 Transactions',
          link: '/docs/sdk/network/transactions',
          collapsed: true,
          items: [
            {
              text: 'Introduction',
              link: '/docs/sdk/network/transactions',
            },
            {
              text: 'getPublicClient',
              link: '/docs/sdk/network/transactions/getPublicClient',
            },
            {
              text: 'getWalletClient',
              link: '/docs/sdk/network/transactions/getWalletClient',
            },
            {
              text: 'withAccount',
              link: '/docs/sdk/network/transactions/withAccount',
            },
            {
              text: 'withPublicClient',
              link: '/docs/sdk/network/transactions/withPublicClient',
            },
            {
              text: 'withWalletClient',
              link: '/docs/sdk/network/transactions/withWalletClient',
            },
            {
              text: 'withPrivateKey',
              link: '/docs/sdk/network/transactions/withPrivateKey',
            },
            {
              text: 'withProvider',
              link: '/docs/sdk/network/transactions/withProvider',
            },
            {
              text: 'TransactionReceipt',
              link: '/docs/sdk/network/transactions/receipt',
            },
            {
              text: 'RPCs',
              link: '/docs/sdk/network/transactions/rpcs',
            },
          ],
        },
        // Any additional items or categories should follow the same pattern
      ],
    },
  ],
} as const satisfies Sidebar
