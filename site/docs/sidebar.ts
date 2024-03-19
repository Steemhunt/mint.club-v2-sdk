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
              text: 'add',
              link: '/docs/sdk/ipfs/add',
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
          text: '💎 token & nft',
          collapsed: true,
          items: [
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
                  text: 'approve',
                  link: '/docs/sdk/network/token/approve',
                },
                {
                  text: 'getAllowance',
                  link: '/docs/sdk/network/token/getAllowance',
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
                  text: 'approve',
                  link: '/docs/sdk/network/nft/approve',
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
                  text: 'getBalanceOfBatch',
                  link: '/docs/sdk/network/nft/getBalanceOfBatch',
                },
                {
                  text: 'getContractURI',
                  link: '/docs/sdk/network/nft/getContractURI',
                },
                {
                  text: 'getIsApprovedForAll',
                  link: '/docs/sdk/network/nft/getIsApprovedForAll',
                },
                {
                  text: 'getSupportsInterface',
                  link: '/docs/sdk/network/nft/getSupportsInterface',
                },
              ],
            },
            {
              text: '🔗 common',
              collapsed: true,
              items: [
                {
                  text: 'buy',
                  link: '/docs/sdk/network/token-nft/buy',
                },
                {
                  text: 'sell',
                  link: '/docs/sdk/network/token-nft/sell',
                },
                {
                  text: 'transfer',
                  link: '/docs/sdk/network/token-nft/transfer',
                },
                {
                  text: 'exists',
                  link: '/docs/sdk/network/token-nft/exists',
                },
                {
                  text: 'getBuyEstimation',
                  link: '/docs/sdk/network/token-nft/getBuyEstimation',
                },
                {
                  text: 'getSellEstimation',
                  link: '/docs/sdk/network/token-nft/getSellEstimation',
                },
                {
                  text: 'getUsdRate',
                  link: '/docs/sdk/network/token-nft/getUsdRate',
                },
                {
                  text: 'getDetail',
                  link: '/docs/sdk/network/token-nft/getDetail',
                },
                {
                  text: 'getSteps',
                  link: '/docs/sdk/network/token-nft/getSteps',
                },
                {
                  text: 'getPriceForNextMint',
                  link: '/docs/sdk/network/token-nft/getPriceForNextMint',
                },
                {
                  text: 'getBalanceOf',
                  link: '/docs/sdk/network/token-nft/getBalanceOf',
                },
                {
                  text: 'getTokenAddress',
                  link: '/docs/sdk/network/token-nft/getTokenAddress',
                },
                {
                  text: 'getReserveTokenAddress',
                  link: '/docs/sdk/network/token-nft/getReserveTokenAddress',
                },
                {
                  text: 'getBondAddress',
                  link: '/docs/sdk/network/token-nft/getBondAddress',
                },
                {
                  text: 'getDecimals',
                  link: '/docs/sdk/network/token-nft/getDecimals',
                },
                {
                  text: 'getName',
                  link: '/docs/sdk/network/token-nft/getName',
                },
                {
                  text: 'getSymbol',
                  link: '/docs/sdk/network/token-nft/getSymbol',
                },
                {
                  text: 'getTotalSupply',
                  link: '/docs/sdk/network/token-nft/getTotalSupply',
                },
                {
                  text: 'getMaxSupply',
                  link: '/docs/sdk/network/token-nft/getMaxSupply',
                },
              ],
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
          collapsed: true,
          items: [
            {
              text: 'claimAirdrop',
              link: '/docs/sdk/airdrop/claimAirdrop',
            },
            {
              text: 'createAirdrop',
              link: '/docs/sdk/airdrop/createAirdrop',
            },
            {
              text: 'cancelAirdrop',
              link: '/docs/sdk/airdrop/cancelAirdrop',
            },
            {
              text: 'getTotalAirdropCount',
              link: '/docs/sdk/airdrop/getTotalAirdropCount',
            },
            {
              text: 'getAirdropById',
              link: '/docs/sdk/airdrop/getAirdropById',
            },
            {
              text: 'getAmountClaimed',
              link: '/docs/sdk/airdrop/getAmountClaimed',
            },
            {
              text: 'getAmountLeft',
              link: '/docs/sdk/airdrop/getAmountLeft',
            },
            {
              text: 'getAirdropIdsByOwner',
              link: '/docs/sdk/airdrop/getAirdropIdsByOwner',
            },
            {
              text: 'getAirdropIdsByToken',
              link: '/docs/sdk/airdrop/getAirdropIdsByToken',
            },
            {
              text: 'getIsClaimed',
              link: '/docs/sdk/airdrop/getIsClaimed',
            },
            {
              text: 'getIsWhitelistOnly',
              link: '/docs/sdk/airdrop/getIsWhitelistOnly',
            },
            {
              text: 'getIsWhitelisted',
              link: '/docs/sdk/airdrop/getIsWhitelisted',
            },
          ],
        },
        {
          text: '🔒 lockup',
          collapsed: true,
          items: [
            {
              text: 'createLockUp',
              link: '/docs/sdk/lockup/createLockUp',
            },
            {
              text: 'unlock',
              link: '/docs/sdk/lockup/unlock',
            },
            {
              text: 'getTotalLockUpCount',
              link: '/docs/sdk/lockup/getTotalLockUpCount',
            },
            {
              text: 'getLockUpIdsByReceiver',
              link: '/docs/sdk/lockup/getLockUpIdsByReceiver',
            },
            {
              text: 'getLockUpIdsByToken',
              link: '/docs/sdk/lockup/getLockUpIdsByToken',
            },
            {
              text: 'getLockUpById',
              link: '/docs/sdk/lockup/getLockUpById',
            },
          ],
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
            {
              text: 'Debugging',
              link: '/docs/sdk/bonus/debugging',
            },
          ],
        },

        // Any additional items or categories should follow the same pattern
      ],
    },
  ],
} as const satisfies Sidebar
