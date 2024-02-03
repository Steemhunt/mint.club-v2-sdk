import { sepolia, mainnet, base, optimism, arbitrum, polygon, bsc, avalanche } from 'viem/chains';
import { HttpTransport, HttpTransportConfig, http } from 'viem';

export type RPCList = {
  readonly id: number;
  readonly rpcs: string[];
};

export const CHAINS: Array<RPCList> = [
  {
    id: mainnet.id,
    rpcs: [
      'https://rpc.ankr.com/eth',
      'https://endpoints.omniatech.io/v1/eth/mainnet/public',
      'https://ethereum.publicnode.com',
      'https://1rpc.io/eth',
      'https://rpc.builder0x69.io',
      'https://eth.drpc.org',
      'https://eth.merkle.io',
      'https://rpc.flashbots.net',
    ],
  },
  {
    id: base.id,
    rpcs: ['https://1rpc.io/base', 'https://base.meowrpc.com', 'https://base.publicnode.com', 'https://base.drpc.org'],
  },
  {
    id: optimism.id,
    rpcs: [
      'https://1rpc.io/op',
      'https://optimism.publicnode.com',
      'https://optimism.drpc.org',
      'https://optimism.meowrpc.com',
    ],
  },
  {
    id: arbitrum.id,
    rpcs: [
      'https://arbitrum.llamarpc.com',
      'https://arb1.arbitrum.io/rpc',
      'https://endpoints.omniatech.io/v1/arbitrum/one/public',
      'https://arbitrum-one.publicnode.com',
      'https://arbitrum.meowrpc.com',
      'https://arbitrum.drpc.org',
    ],
  },
  {
    id: polygon.id,
    rpcs: [
      'https://1rpc.io/matic',
      'https://polygon-bor.publicnode.com',
      'https://polygon.drpc.org',
      'https://polygon.meowrpc.com',
    ],
  },
  {
    id: bsc.id,
    rpcs: [
      'https://bsc-dataseed.bnbchain.org',
      'https://bsc-dataseed1.bnbchain.org',
      'https://bsc-dataseed2.bnbchain.org',
      'https://bsc-dataseed3.bnbchain.org',
      'https://bsc-dataseed4.bnbchain.org',
      'https://1rpc.io/bnb',
      'https://bsc.publicnode.com',
      'https://bsc.meowrpc.com',
      'https://bsc.drpc.org',
    ],
  },
  {
    id: avalanche.id,
    rpcs: [
      'https://api.avax.network/ext/bc/C/rpc',
      'https://avalanche.public-rpc.com',
      'https://rpc.ankr.com/avalanche',
      'https://avalanche-c-chain.publicnode.com',
      'https://avax.meowrpc.com',
      'https://avalanche.drpc.org',
    ],
  },
  {
    id: sepolia.id,
    rpcs: ['https://eth-sepolia.g.alchemy.com/v2/q7Z7WPqq0Vl9p1B5_7l6g-mX6LaEwMsZ'],
  },
];

export function chainRPCFallbacks(
  chainId: number,
  fetchOptions?: HttpTransportConfig['fetchOptions'],
): HttpTransport[] {
  return (
    CHAINS.find((chain) => chain.id === chainId)?.rpcs.map((rpc) =>
      http(rpc, {
        fetchOptions,
      }),
    ) || [
      http(undefined, {
        fetchOptions,
      }),
    ]
  );
}
