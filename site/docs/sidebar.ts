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
      text: 'Main SDK',
      collapsed: true,
      items: [
        { text: 'Introduction', link: '/docs/main/sdk/introduction' },
        {
          text: 'mintclub',
          items: [
            {
              text: 'getBalance',
              link: '/docs/main/sdk/getBalance',
            },
          ],
        },
        {
          text: 'token',
          items: [
            {
              text: 'getBalance',
              link: '/docs/main/sdk/getBalance',
            },
            {
              text: 'getTransactionCount',
              link: '/docs/main/sdk/getTransactionCount',
            },
          ],
        },
        {
          text: 'nft',
          items: [
            { text: 'getBlock', link: '/docs/main/sdk/getBlock' },
            {
              text: 'getBlockNumber',
              link: '/docs/main/sdk/getBlockNumber',
            },
            {
              text: 'getBlockTransactionCount',
              link: '/docs/main/sdk/getBlockTransactionCount',
            },
            {
              text: 'watchBlockNumber',
              link: '/docs/main/sdk/watchBlockNumber',
            },
            {
              text: 'watchBlocks',
              link: '/docs/main/sdk/watchBlocks',
            },
          ],
        },
      ],
    },
  ],
} as const satisfies Sidebar;
