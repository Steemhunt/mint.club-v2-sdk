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
      text: 'SDK',
      items: [
        {
          text: 'Overview',
          link: '/docs/sdk/introduction',
        },
        {
          text: 'Recipes',
          collapsed: true,
          items: [
            {
              text: 'Calculating reverse input',
              link: '/docs/recipes/snippets/reverse-calculation',
            },
          ],
        },
        // {
        //   text: '👛 wallet',
        //   collapsed: true,
        //   items: [
        //     {
        //       text: 'connect',
        //       link: '/docs/sdk/wallet/connect',
        //     },
        //     {
        //       text: 'disconnect',
        //       link: '/docs/sdk/wallet/disconnect',
        //     },
        //     {
        //       text: 'change',
        //       link: '/docs/sdk/wallet/change',
        //     },
        //     {
        //       text: 'account',
        //       link: '/docs/sdk/wallet/account',
        //     },
        //     {
        //       text: 'getNativeBalance',
        //       link: '/docs/sdk/wallet/getNativeBalance',
        //     },
        //     {
        //       text: 'Using a custom wallet provider',
        //       link: '/docs/sdk/wallet/custom',
        //     },
        //   ],
        // },

        {
          text: 'IPFS',
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
          text: 'Network and clients',
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
          ],
        },
        {
          text: 'Assets',
          collapsed: true,
          items: [
            {
              text: 'ERC-20 token',
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
              text: 'ERC-1155 asset',
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
              text: 'Shared operations',
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
                  text: 'get24HoursUsdRate',
                  link: '/docs/sdk/network/token-nft/get24HoursUsdRate',
                },
                {
                  text: 'get24HoursUsdCacheKey',
                  link: '/docs/sdk/network/token-nft/get24HoursUsdCacheKey',
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
                  text: 'getTokenLogoUrl',
                  link: '/docs/sdk/network/token-nft/getTokenLogoUrl',
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
          text: 'Bond',
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
            {
              text: 'getList',
              link: '/docs/sdk/network/bond/getList',
            },
            {
              text: 'getRoyaltyInfo',
              link: '/docs/sdk/network/bond/getRoyaltyInfo',
            },
            {
              text: 'claimRoyalties',
              link: '/docs/sdk/network/bond/claimRoyalties',
            },
          ],
        },
        {
          text: 'Airdrop',
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
          text: 'Lockup',
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
          text: 'Stake',
          collapsed: true,
          items: [
            {
              text: 'Getting Started',
              link: '/docs/sdk/stake',
            },
            {
              text: 'createPool',
              link: '/docs/sdk/stake/createPool',
            },
            {
              text: 'stake',
              link: '/docs/sdk/stake/stake',
            },
            {
              text: 'unstake',
              link: '/docs/sdk/stake/unstake',
            },
            {
              text: 'claim',
              link: '/docs/sdk/stake/claim',
            },
            {
              text: 'cancelPool',
              link: '/docs/sdk/stake/cancelPool',
            },
            {
              text: 'emergencyUnstake',
              link: '/docs/sdk/stake/emergencyUnstake',
            },
            {
              text: 'getCreationFee',
              link: '/docs/sdk/stake/getCreationFee',
            },
            {
              text: 'getClaimFee',
              link: '/docs/sdk/stake/getClaimFee',
            },
            {
              text: 'getPoolCount',
              link: '/docs/sdk/stake/getPoolCount',
            },
            {
              text: 'getPool',
              link: '/docs/sdk/stake/getPool',
            },
            {
              text: 'getPools',
              link: '/docs/sdk/stake/getPools',
            },
            {
              text: 'getPoolsByCreator',
              link: '/docs/sdk/stake/getPoolsByCreator',
            },
            {
              text: 'getUserPoolStake',
              link: '/docs/sdk/stake/getUserPoolStake',
            },
            {
              text: 'getClaimableReward',
              link: '/docs/sdk/stake/getClaimableReward',
            },
            {
              text: 'getClaimableRewardBulk',
              link: '/docs/sdk/stake/getClaimableRewardBulk',
            },
            {
              text: 'getMinRewardDuration',
              link: '/docs/sdk/stake/getMinRewardDuration',
            },
            {
              text: 'getMaxRewardDuration',
              link: '/docs/sdk/stake/getMaxRewardDuration',
            },
            {
              text: 'getProtocolBeneficiary',
              link: '/docs/sdk/stake/getProtocolBeneficiary',
            },
          ],
        },
        {
          text: 'Advanced usage',
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

        {
          text: 'Utilities',
          collapsed: true,
          items: [
            { text: 'Getting Started', link: '/docs/sdk/utils' },
            { text: 'generateMerkleRoot', link: '/docs/sdk/utils/generateMerkleRoot' },
            { text: 'defillamaUsdRate', link: '/docs/sdk/utils/defillamaUsdRate' },
            { text: 'defillama24HoursPercentage', link: '/docs/sdk/utils/defillama24HoursPercentage' },
            { text: 'getBlockNumber', link: '/docs/sdk/utils/getBlockNumber' },
            { text: 'getSwapscannerPrice', link: '/docs/sdk/utils/getSwapscannerPrice' },
            { text: 'oneinchUsdRate', link: '/docs/sdk/utils/oneinchUsdRate' },
            { text: 'zeroXUsdRate', link: '/docs/sdk/utils/zeroXUsdRate' },
          ],
        },

        {
          text: 'Implementation guides',
          collapsed: true,
          items: [
            {
              text: 'Overview',
              link: '/docs/vibe-coders',
            },
            {
              text: 'LLM guide',
              link: '/docs/vibe-coders/llm-guide',
            },
            {
              text: 'Quick reference',
              link: '/docs/vibe-coders/cheat-sheet',
            },
            {
              text: 'Patterns and snippets',
              link: '/docs/vibe-coders/patterns',
            },
            {
              text: 'Environment setup',
              link: '/docs/vibe-coders/setup',
            },
            {
              text: 'Debugging',
              link: '/docs/vibe-coders/debugging',
            },
            {
              text: 'Token and NFT operations',
              link: '/docs/vibe-coders/token-nft-guide',
            },
            {
              text: 'Airdrop operations',
              link: '/docs/vibe-coders/airdrop-guide',
            },
            {
              text: 'Lockup operations',
              link: '/docs/vibe-coders/lockup-guide',
            },
            {
              text: 'Bond operations',
              link: '/docs/vibe-coders/bond-guide',
            },
            {
              text: 'Staking operations',
              link: '/docs/vibe-coders/stake-guide',
            },
          ],
        },
      ],
    },
    {
      text: 'HTTP API',
      collapsed: false,
      items: [
        {
          text: 'Endpoints',
          link: '/docs/api',
        },
      ],
    },
  ],
} as const satisfies Sidebar
