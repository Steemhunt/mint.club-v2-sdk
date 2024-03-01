import type { Sidebar } from 'vocs'

export const sidebar = {
  '/docs/': [
    {
      text: 'Introduction',
      items: [
        {
          text: 'Why Mint.club?',
          link: '/docs/why-mint-club'
        },
        {
          text: 'Getting Started',
          link: '/docs/getting-started'
        },
        {
          text: 'Contracts',
          link: '/docs/contracts'
        },
        {
          text: 'Curve Design',
          link: '/docs/curve-design'
        },
        {
          text: 'FAQ',
          link: '/docs/faq'
        }
      ]
    },

    {
      text: 'SDK',
      collapsed: false,
      items: [
        {
          text: 'mintclub',
          collapsed: false,
          link: '/docs/sdk/introduction',
          items: [
            {
              text: 'network',
              link: '/docs/sdk/network',
              items: [
                {
                  text: 'token',
                  link: '/docs/sdk/network/token',
                  collapsed: false,
                  items: [
                    {
                      text: 'create',
                      link: '/docs/sdk/network/token/create'
                    },
                    {
                      text: 'getAllowance',
                      link: '/docs/sdk/network/token/getAllowance'
                    },
                    {
                      text: 'getBalanceOf',
                      link: '/docs/sdk/network/token/getBalanceOf'
                    },
                    {
                      text: 'getGetBondAddress',
                      link: '/docs/sdk/network/token/getGetBondAddress'
                    },
                    {
                      text: 'getDecimals',
                      link: '/docs/sdk/network/token/getDecimals'
                    },
                    {
                      text: 'getName',
                      link: '/docs/sdk/network/token/getName'
                    },
                    {
                      text: 'getSymbol',
                      link: '/docs/sdk/network/token/getSymbol'
                    },
                    {
                      text: 'getTotalSupply',
                      link: '/docs/sdk/network/token/getTotalSupply'
                    }
                  ]
                },
                {
                  text: 'nft',
                  collapsed: false,
                  items: [
                    {
                      text: 'createToken',
                      link: '/docs/sdk/network/getBalance'
                    },
                    {
                      text: 'createNFT',
                      link: '/docs/sdk/network/getBalance'
                    }
                  ]
                },
                {
                  text: 'bond',
                  collapsed: true,
                  link: '/docs/sdk/network/getBalance'
                },
                {
                  text: 'airdrop',
                  collapsed: true,
                  link: '/docs/sdk/network/getBalance'
                },
                {
                  text: 'lockup',
                  collapsed: true,
                  link: '/docs/sdk/network/getBalance'
                },
                {
                  text: 'Making Write Calls',
                  collapsed: true,
                  link: '/docs/sdk/network/write',
                  items: [
                    {
                      text: 'getConnectedAddress',
                      link: '/docs/sdk/network/write/getConnectedAddress'
                    },
                    {
                      text: 'getWalletClient',
                      link: '/docs/sdk/network/write/getWalletClient'
                    },
                    {
                      text: 'getPublicClient',
                      link: '/docs/sdk/network/write/getPublicClient'
                    },
                    {
                      text: 'withConfig',
                      link: '/docs/sdk/network/write/withConfig'
                    },
                    {
                      text: 'withPrivateKey',
                      link: '/docs/sdk/network/write/withPrivateKey'
                    },
                    {
                      text: 'withAccount',
                      link: '/docs/sdk/network/write/withAccount'
                    },
                    {
                      text: 'withProvider',
                      link: '/docs/sdk/network/write/withProvider'
                    }
                  ]
                }
              ]
            }
          ]
        },

        {
          text: 'utilities',
          collapsed: true,
          items: [
            {
              text: 'a',
              link: '/docs/sdk/network/getBalance'
            },
            {
              text: 'b',
              link: '/docs/sdk/network/getBalance'
            }
          ]
        }
      ]
    }
  ]
} as const satisfies Sidebar
