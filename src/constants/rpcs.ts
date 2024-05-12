import { Chain, FallbackTransportConfig, HttpTransportConfig, http } from 'viem';
import {
  arbitrum,
  avalanche,
  base,
  blast,
  bsc,
  cyber,
  cyberTestnet,
  degen,
  klaytn,
  mainnet,
  optimism,
  polygon,
  sepolia,
  zora,
} from 'viem/chains';

export type RPCList = {
  readonly id: number;
  readonly rpcs: string[];
};

export const RPCS: Array<RPCList> = [
  {
    id: mainnet.id,
    rpcs: [
      'https://ethereum-rpc.publicnode.com',
      'https://eth-mainnet.nodereal.io/v1/1659dfb40aa24bbb8153a677b98064d7',
      'https://public.stackup.sh/api/v1/node/ethereum-mainnet',
      'https://rpc.flashbots.net',
      // 'https://api.zmok.io/mainnet/oaen6dy8ff6hju9k', // NOTE: 503 error
      'https://rpc.mevblocker.io',
      'https://rpc.mevblocker.io/fast',
      // 'https://go.getblock.io/d9fde9abc97545f4887f56ae54f3c2c0', // NOTE: 429 error
      'https://rpc.mevblocker.io/noreverts',
      'https://rpc.mevblocker.io/fullprivacy',
      'https://eth1.lava.build/lava-referer-ed07f753-8c19-4309-b632-5a4a421aa589',
      'https://rpc.flashbots.net/fast',
      'https://eth1.lava.build/lava-referer-16223de7-12c0-49f3-8d87-e5f1e6a0eb3b',
      'https://core.gashawk.io/rpc',
      'https://eth.meowrpc.com',
      'https://gateway.subquery.network/rpc/eth',
      'https://eth-pokt.nodies.app',
      // 'https://gateway.tenderly.co/public/mainnet', // NOTE: 400 on `eth_getFilterChanges`
      // 'https://mainnet.gateway.tenderly.co', // NOTE: 400 on `eth_getFilterChanges`
      'https://eth-mainnet.rpcfast.com?api_key=xbhWBI1Wkguk8SNMu1bvvLurPGLXmgwYeC4S6g2H7WdwFigZSmPWVZRxrskEQwIf',
      'https://rpc.builder0x69.io',
    ],
  },
  {
    id: base.id,
    rpcs: [
      'https://mainnet.base.org',
      'https://base-pokt.nodies.app',
      // 'https://base.gateway.tenderly.co', // NOTE: 400 on `eth_getFilterChanges`
      // 'https://gateway.tenderly.co/public/base', // NOTE: 400 on `eth_getFilterChanges`
      'https://base-rpc.publicnode.com',
      'https://developer-access-mainnet.base.org',
      'https://base.meowrpc.com',
    ],
  },
  {
    id: cyber.id,
    rpcs: ['https://cyber.alt.technology/', 'https://rpc.cyber.co/'],
  },
  {
    id: cyberTestnet.id,
    rpcs: ['https://cyber-testnet.alt.technology'],
  },
  {
    id: optimism.id,
    rpcs: [
      // 'https://api.tatum.io/v3/blockchain/node/optimism-mainnet', // NOTE: CORS issue
      // 'https://optimism.drpc.org', // NOTE: 400 on `eth_getFilterChanges`
      // 'https://gateway.tenderly.co/public/optimism', // NOTE: 400 on `eth_getFilterChanges`
      // 'https://optimism.gateway.tenderly.co', // NOTE: 400 on `eth_getFilterChanges`
      'https://optimism-rpc.publicnode.com',
      'https://op-pokt.nodies.app',
      'https://optimism.meowrpc.com',
    ],
  },
  {
    id: arbitrum.id,
    rpcs: [
      'https://arbitrum-one.publicnode.com',
      'https://arbitrum.rpc.subquery.network/public',
      'https://public.stackup.sh/api/v1/node/arbitrum-one',
      'https://arbitrum.meowrpc.com',
      'https://arb-pokt.nodies.app',
      'https://arbitrum-one-rpc.publicnode.com',
      // 'https://arb-mainnet.g.alchemy.com/v2/654scodAkt2_QjvbCk8oPbAV6wJHoR8j', // Alchemy private API because public RPCs are often unstable
    ],
  },
  {
    id: polygon.id,
    rpcs: [
      'https://polygon-bor-rpc.publicnode.com',
      'https://polygon-pokt.nodies.app',
      'https://public.stackup.sh/api/v1/node/polygon-mainnet',
      'https://rpc-mainnet.matic.quiknode.pro',
      // 'https://gateway.tenderly.co/public/polygon', // NOTE: 400 on `eth_getFilterChanges`
      // 'https://polygon.gateway.tenderly.co', // NOTE: 400 on `eth_getFilterChanges`
      'https://polygon.meowrpc.com',
      'https://polygon-mainnet.rpcfast.com?api_key=xbhWBI1Wkguk8SNMu1bvvLurPGLXmgwYeC4S6g2H7WdwFigZSmPWVZRxrskEQwIf',
      'https://polygon.rpc.subquery.network/public',
    ],
  },
  {
    id: bsc.id,
    rpcs: [
      'https://bsc-dataseed4.ninicoin.io',
      'https://bsc.rpc.blxrbdn.com',
      'https://bsc-dataseed1.bnbchain.org',
      'https://bsc-dataseed2.bnbchain.org',
      'https://bsc-dataseed1.defibit.io',
      'https://bsc-dataseed3.defibit.io',
      'https://bsc-dataseed3.ninicoin.io',
      // 'https://bsc-mainnet.nodereal.io/v1/64a9df0874fb4a93b9d0a3849de012d3', // NOTE: 429 error
      'https://bsc-dataseed2.defibit.io',
      'https://bsc-dataseed.bnbchain.org',
      'https://bsc-dataseed3.bnbchain.org',
      'https://bsc-dataseed4.bnbchain.org',
      'https://binance.nodereal.io',
      'https://bsc-dataseed1.ninicoin.io',
      'https://bsc-dataseed4.defibit.io',
      'https://bsc-dataseed2.ninicoin.io',
      'https://bsc-pokt.nodies.app',
      'https://public.stackup.sh/api/v1/node/bsc-mainnet',
      'https://bsc-mainnet.rpcfast.com?api_key=xbhWBI1Wkguk8SNMu1bvvLurPGLXmgwYeC4S6g2H7WdwFigZSmPWVZRxrskEQwIf',
      'https://rpc-bsc.48.club',
      'https://koge-rpc-bsc.48.club',
      'https://bsc.meowrpc.com',
    ],
  },
  {
    id: avalanche.id,
    rpcs: [
      'https://avalanche-c-chain-rpc.publicnode.com',
      // 'https://api.tatum.io/v3/blockchain/node/avax-mainnet', // NOTE: CORS issue
      'https://avax-pokt.nodies.app/ext/bc/C/rpc',
      'https://avax.meowrpc.com',
      'https://api.avax.network/ext/bc/C/rpc',
    ],
  },
  {
    id: blast.id,
    rpcs: [
      'https://rpc.blast.io',
      // 'https://blast.din.dev/rpc' // NOTE: 503 error
    ],
  },
  {
    id: sepolia.id,
    rpcs: [
      'https://ethereum-sepolia-rpc.publicnode.com',
      'https://rpc2.sepolia.org',
      // 'https://sepolia.gateway.tenderly.co', // NOTE: 400 on `eth_getFilterChanges`
      // 'https://gateway.tenderly.co/public/sepolia', // NOTE: 400 on `eth_getFilterChanges`
      'https://public.stackup.sh/api/v1/node/ethereum-sepolia',
      'https://eth-sepolia-public.unifra.io',
      'https://sepolia.drpc.org',
      'https://rpc-sepolia.rockx.com',
      'https://ethereum-sepolia.rpc.subquery.network/public',
    ],
  },
  {
    id: degen.id,
    rpcs: ['https://rpc.degen.tips', 'https://nitrorpc-degen-mainnet-1.t.conduit.xyz'],
  },
  {
    id: zora.id,
    rpcs: ['https://rpc.zora.energy'],
  },
  {
    id: klaytn.id,
    rpcs: [
      'https://public-en-cypress.klaytn.net',
      'https://klaytn.api.onfinality.io/public',
      'https://klaytn-pokt.nodies.app',
      'https://klaytn-mainnet-rpc.allthatnode.com:8551',
    ],
  },
];

function customTransport(params: { rpc?: string; fetchOptions?: HttpTransportConfig['fetchOptions'] }) {
  const { rpc, fetchOptions } = params;
  return http(rpc, {
    key: rpc,
    name: rpc,
    fetchOptions,
    retryCount: 0,
    timeout: 4_000,
  });
}

export function chainRPCFallbacks(
  chain: Chain,
  fetchOptions: HttpTransportConfig['fetchOptions'] = {
    cache: 'no-store',
  },
) {
  return (
    RPCS.find((c) => c.id === chain.id)?.rpcs.map((rpc) =>
      customTransport({
        rpc,
        fetchOptions,
      }),
    ) || [http()]
  );
}

export const DEFAULT_RANK_OPTIONS: FallbackTransportConfig = {
  retryCount: 0,
  rank: {
    interval: 100_000,
    sampleCount: 5,
    timeout: 4_000,
    weights: {
      latency: 0.3,
      stability: 0.7,
    },
  },
};
