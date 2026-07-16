<p align="center">
  <img src="https://mint.club/logo.png" alt="Mint Club" width="80" />
</p>

<h1 align="center">Mint Club V2 SDK</h1>

<p align="center">
  The TypeScript SDK for creating, trading, and managing assets on the <a href="https://mint.club">Mint Club</a> bonding curve protocol.
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@mint.club/v2-sdk"><img src="https://img.shields.io/npm/v/%40mint.club%2Fv2-sdk.svg?style=flat-square&label=npm" alt="npm" /></a>
  <a href="https://www.npmjs.com/package/@mint.club/v2-sdk"><img src="https://img.shields.io/npm/dm/%40mint.club%2Fv2-sdk.svg?style=flat-square&label=downloads" alt="downloads" /></a>
  <a href="https://packagephobia.com/result?p=%40mint.club%2Fv2-sdk"><img src="https://packagephobia.com/badge?p=%40mint.club%2Fv2-sdk" alt="install size" /></a>
  <a href="https://github.com/Steemhunt/mint.club-v2-sdk"><img src="https://img.shields.io/github/stars/Steemhunt/mint.club-v2-sdk?style=flat-square&logo=github" alt="GitHub" /></a>
  <a href="https://opensource.org/license/bsd-3-clause"><img src="https://img.shields.io/badge/License-BSD--3--Clause-blue.svg?style=flat-square" alt="BSD-3-Clause" /></a>
</p>

---

## What is Mint Club V2?

[Mint Club V2](https://mint.club) is a permissionless bonding curve protocol. Launch tokens backed by any reserve asset (HUNT, ETH, USDC, …) with automated pricing — no liquidity pool required. The protocol handles minting, burning, and price discovery through audited smart contracts.

This SDK is the canonical TypeScript client for the protocol. Use it from Node.js, browsers, or any JavaScript runtime.

→ Full docs: **[sdk.mint.club](https://sdk.mint.club)**

---

## Install

Version 2 moved the SDK from `mint.club-v2-sdk` to the official Mint Club scope. Use `@mint.club/v2-sdk` for all new installations.

```bash
npm install @mint.club/v2-sdk
# or
yarn add @mint.club/v2-sdk
# or
bun add @mint.club/v2-sdk
```

## Quick Start

```ts
import { mintclub } from '@mint.club/v2-sdk';

// Read token state without connecting a wallet.
const signet = mintclub.network('base').token('SIGNET');
const [details, nextMintPrice] = await Promise.all([
  signet.getDetail(),
  signet.getPriceForNextMint(),
]);

// Resolve the current USD price and its quote path.
const { usdRate, path } = await mintclub.network('base').token('HUNT').getUsdRate();
```

For trusted Node.js environments, configure a private key after selecting the network. Never expose a private key in browser code.

```ts
import { mintclub, wei } from '@mint.club/v2-sdk';

const serverToken = mintclub
  .network('base')
  .withPrivateKey(process.env.PRIVATE_KEY as `0x${string}`)
  .token('SIGNET');

const serverAmount = wei(100, await serverToken.getDecimals());
await serverToken.buy({ amount: serverAmount, slippage: 1 });
```

Browser applications should pass a viem wallet client from their wallet integration to `mintclub.withWalletClient()`. See the [getting started guide](https://sdk.mint.club/docs/getting-started) for a complete example.

---

## Features

| | |
|---|---|
| **Bonding curves** | Create, buy, sell, estimate, and inspect ERC-20 and ERC-1155 assets |
| **Wallet integration** | Use viem wallet clients, injected wallets, or a server-side private key |
| **Airdrops** | Create and claim Merkle airdrops with IPFS-backed allowlists |
| **Lockups and staking** | Create token lockups and interact with staking pools |
| **Wrapped-native Zap** | Buy with or sell to the native asset when the reserve is its wrapped token |
| **USD pricing** | Resolve token prices through bonding curves and supported price providers |
| **IPFS and metadata** | Upload and resolve asset metadata and airdrop lists |

## Supported Networks

The SDK accepts a chain ID or the lowercase network key shown below.

| Environment | Network keys |
|---|---|
| Mainnet | `ethereum`, `base`, `blast`, `optimism`, `arbitrum`, `polygon`, `bnbchain`, `avalanche`, `kaia`, `cyber`, `degen`, `ham`, `shibarium`, `unichain`, `zora`, `apechain`, `hashkey`, `robinhood`, `over` |
| Testnet | `sepolia`, `basesepolia`, `blastsepolia`, `avalanchefuji`, `cybertestnet`, `puppynet` |

Contract availability differs by feature and network. Use `getMintClubContractAddress()` or the [contract repository](https://github.com/Steemhunt/mint.club-v2-contract) when you need a specific deployment.

---

## Development

```bash
npm install
npm run typecheck
npm test
npm run build
```

Integration tests that require credentials (`PRIVATE_KEY`, `FILEBASE_API_KEY`) are auto-skipped when the env var is not set.

---

## Links

| | |
|---|---|
| **App** | [mint.club](https://mint.club) |
| **SDK docs** | [sdk.mint.club](https://sdk.mint.club) |
| **Protocol docs** | [docs.mint.club](https://docs.mint.club) |
| **Contracts** | [Steemhunt/mint.club-v2-contract](https://github.com/Steemhunt/mint.club-v2-contract) |
| **CLI and MCP** | [Steemhunt/mint.club-v2-ai](https://github.com/Steemhunt/mint.club-v2-ai) |
| **Community** | [OnChat](https://onchat.sebayaki.com/mintclub) |
| **X / Twitter** | [@MintClubPro](https://twitter.com/MintClubPro) |

## License

BSD-3-Clause — built with 🏗️ by [Hunt Town](https://hunt.town)
