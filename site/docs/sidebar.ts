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
          text: '👛 wallet',
          collapsed: true,
          items: [
            {
              text: 'connect',
              link: '/docs/sdk/wallet/connect',
            },
            {
              text: 'disconnect',
              link: '/docs/sdk/wallet/disconnect',
            },
            {
              text: 'change',
              link: '/docs/sdk/wallet/change',
            },
            {
              text: 'account',
              link: '/docs/sdk/wallet/account',
            },
            {
              text: 'getNativeBalance',
              link: '/docs/sdk/wallet/getNativeBalance',
            },
            {
              text: 'Using a custom wallet provider',
              link: '/docs/sdk/wallet/custom',
            },
          ],
        },

        {
          text: '📦 ipfs',
          collapsed: true,
          items: [
            {
              text: 'Getting Started',
              link: '/docs/sdk/ipfs',
            },
            {
              text: 'upload',
              link: '/docs/sdk/ipfs/upload',
            },
            {
              text: 'uploadMetadata',
              link: '/docs/sdk/ipfs/uploadMetadata',
            },
            {
              text: 'hashToGatewayUrl',
              link: '/docs/sdk/ipfs/hashToGatewayUrl',
            },
            {
              text: 'gatewayUrlToHash',
              link: '/docs/sdk/ipfs/gatewayUrlToHash',
            },
          ],
        },

        {
          text: '🌐 network',
          link: '/docs/sdk/network',
          collapsed: true,
          items: [
            {
              text: 'getPublicClient',
              link: '/docs/sdk/network/getPublicClient',
            },
            {
              text: 'getWalletClient',
              link: '/docs/sdk/network/getWalletClient',
            },
            {
              text: 'withAccount',
              link: '/docs/sdk/network/withAccount',
            },
            {
              text: 'withPublicClient',
              link: '/docs/sdk/network/withPublicClient',
            },
            {
              text: 'withWalletClient',
              link: '/docs/sdk/network/withWalletClient',
            },
            {
              text: 'withPrivateKey',
              link: '/docs/sdk/network/withPrivateKey',
            },
            {
              text: 'withProvider',
              link: '/docs/sdk/network/withProvider',
            },
          ],
        },
        {
          text: '🪙 token',
          link: '/docs/sdk/network/token',
          collapsed: true,
          items: [
            {
              text: 'create',
              link: '/docs/sdk/network/token/create',
            },
            {
              text: 'buy',
              link: '/docs/sdk/network/token/buy',
            },
            {
              text: 'sell',
              link: '/docs/sdk/network/token/sell',
            },
            {
              text: 'transfer',
              link: '/docs/sdk/network/token/transfer',
            },
            {
              text: 'exists',
              link: '/docs/sdk/network/token/exists',
            },
            {
              text: 'getDetail',
              link: '/docs/sdk/network/token/getDetail',
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
              text: 'buy',
              link: '/docs/sdk/network/nft/buy',
            },
            {
              text: 'sell',
              link: '/docs/sdk/network/nft/sell',
            },
            {
              text: 'transfer',
              link: '/docs/sdk/network/nft/transfer',
            },
            {
              text: 'exists',
              link: '/docs/sdk/network/nft/exists',
            },
            {
              text: 'getDetail',
              link: '/docs/sdk/network/nft/getDetail',
            },
            {
              text: 'getMetadataUri',
              link: '/docs/sdk/network/nft/getMetadataUri',
            },
            {
              text: 'getImageUri',
              link: '/docs/sdk/network/nft/getImageUri',
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
            {
              text: 'getTokensByReserveToken',
              link: '/docs/sdk/network/bond/getTokensByReserveToken',
            },
            {
              text: 'getTokensByCreator',
              link: '/docs/sdk/network/bond/getTokensByCreator',
            },
          ],
        },
        {
          text: '🪂 airdrop',
          link: '/docs/sdk/network/airdrop',
          collapsed: true,
        },
        {
          text: '🔒 lockup',
          link: '/docs/sdk/network/lockup',
          collapsed: true,
        },
        {
          text: '🎁 bonus',
          collapsed: true,
          items: [
            {
              text: 'Getting the most juice 🧃',
              link: '/docs/sdk/bonus/juice',
            },
            {
              text: 'TransactionReceipt',
              link: '/docs/sdk/bonus/receipt',
            },
            {
              text: 'RPCs',
              link: '/docs/sdk/bonus/rpcs',
            },
          ],
        },

        // Any additional items or categories should follow the same pattern
      ],
    },
  ],
} as const satisfies Sidebar
