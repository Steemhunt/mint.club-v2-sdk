import type { Sidebar } from 'vocs';

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
      collapsed: false,
      items: [
        { text: 'Introduction', link: '/docs/main/sdk/introduction' },

        {
          text: 'mintclub',
          collapsed: false,
          items: [
            {
              text: 'network',
              items: [
                {
                  text: 'createToken',
                  link: '/docs/main/sdk/getBalance',
                },
                {
                  text: 'createNFT',
                  link: '/docs/main/sdk/getBalance',
                },
                {
                  text: 'token',
                  collapsed: true,
                  items: [
                    {
                      text: 'createToken',
                      link: '/docs/main/sdk/getBalance',
                    },
                    {
                      text: 'createNFT',
                      link: '/docs/main/sdk/getBalance',
                    },
                    {
                      text: 'token',
                      collapsed: true,
                      link: '/docs/main/sdk/getBalance',
                    },
                    {
                      text: 'nft',
                      collapsed: true,
                      link: '/docs/main/sdk/getBalance',
                    },
                  ],
                },
                {
                  text: 'nft',
                  collapsed: true,
                  items: [
                    {
                      text: 'createToken',
                      link: '/docs/main/sdk/getBalance',
                    },
                    {
                      text: 'createNFT',
                      link: '/docs/main/sdk/getBalance',
                    },
                    {
                      text: 'token',
                      collapsed: true,
                      link: '/docs/main/sdk/getBalance',
                    },
                    {
                      text: 'nft',
                      collapsed: true,
                      link: '/docs/main/sdk/getBalance',
                    },
                  ],
                },
              ],
            },
          ],
        },

        {
          text: 'utilities',
          collapsed: true,
          items: [
            {
              text: 'a',
              link: '/docs/main/sdk/getBalance',
            },
            {
              text: 'b',
              link: '/docs/main/sdk/getBalance',
            },
          ],
        },
      ],
    },
  ],
} as const satisfies Sidebar;
