<p align="center">
  <img src="https://mint.club/logo.png" alt="Mint Club" width="80" />
</p>

<h1 align="center">Mint Club V2 SDK</h1>

<p align="center">
  TypeScript SDK for the <a href="https://mint.club">Mint Club</a> bonding curve protocol — read, trade, create, and manage tokens across 17 networks.
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/mint.club-v2-sdk"><img src="https://img.shields.io/npm/v/mint.club-v2-sdk.svg?style=flat-square&label=npm" alt="npm" /></a>
  <a href="https://www.npmjs.com/package/mint.club-v2-sdk"><img src="https://img.shields.io/npm/dm/mint.club-v2-sdk.svg?style=flat-square&label=downloads" alt="downloads" /></a>
  <a href="https://packagephobia.com/result?p=mint.club-v2-sdk"><img src="https://packagephobia.com/badge?p=mint.club-v2-sdk" alt="install size" /></a>
  <a href="https://github.com/Steemhunt/mint.club-v2-sdk"><img src="https://img.shields.io/github/stars/Steemhunt/mint.club-v2-sdk?style=flat-square&logo=github" alt="GitHub" /></a>
  <a href="https://opensource.org/licenses/MIT"><img src="https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square" alt="MIT" /></a>
</p>

---

## What is Mint Club V2?

[Mint Club V2](https://mint.club) is a permissionless bonding curve protocol. Launch tokens backed by any reserve asset (HUNT, ETH, USDC, …) with automated pricing — no liquidity pool required. The protocol handles minting, burning, and price discovery through audited smart contracts.

This SDK is the canonical TypeScript client for the protocol. Use it from Node.js, browsers, or any JavaScript runtime.

→ Full docs: **[sdk.mint.club](https://sdk.mint.club)**

---

## Install

```bash
npm install mint.club-v2-sdk
# or
yarn add mint.club-v2-sdk
# or
bun add mint.club-v2-sdk
```

## Quick Start

```ts
import { mintclub } from 'mint.club-v2-sdk';

// Read: token details
const detail = await mintclub.network('base').token('SIGNET').getDetail();
console.log(detail.priceForNextMint, detail.info.currentSupply);

// Read: USD price (with 1inch / DEX fallback)
const usd = await mintclub.network('base').token('HUNT').getUsdRate();

// Write: buy on the bonding curve (browser / wagmi)
await mintclub
  .network('base')
  .token('SIGNET')
  .buy({
    amount: 100n,                 // tokens to mint
    slippage: 1,                  // %
    onSuccess: (tx) => console.log(tx),
    onError: (e) => console.error(e),
  });

// Write: create a new token
await mintclub.network('base').token('MYTOKEN').create({
  name: 'My Token',
  reserveToken: { address: '0x...', decimals: 18 },
  curveData: {
    curveType: 'EXPONENTIAL',
    stepCount: 100,
    maxSupply: 1_000_000,
    initialMintingPrice: 0.0001,
    finalMintingPrice: 0.1,
  },
});
```

For Node.js / server contexts, use `withPrivateKey()`:

```ts
await mintclub
  .withPrivateKey(process.env.PRIVATE_KEY as `0x${string}`)
  .network('base')
  .token('SIGNET')
  .buy({ amount: 100n, slippage: 1 });
```

---

## Features

| | |
|---|---|
| 🪙 **Bond contract** | Buy, sell, create, and read token state |
| 🎁 **Airdrops** | Merkle-tree airdrops with IPFS-backed allowlists |
| 🔐 **Stake & lock** | Stake pools and lockups |
| ⚡ **Zap** | Swap + bond in a single transaction |
| 🦄 **Uniswap routing** | V3/V4 swap helpers via UniversalRouter |
| 💵 **USD pricing** | 1inch spot, DefiLlama, 0x fallbacks |
| 📦 **IPFS** | Upload metadata, logos, and airdrop lists via Filebase |
| 🏷️ **Metadata** | Mint Club token metadata create / update / read |

## Supported Networks

Ethereum · Base · BNB Chain · Polygon · Arbitrum · Optimism · Avalanche · Kaia · Cyber · Degen · Ham · Shibarium · Unichain · Zora · HashKey · Ape Chain · Over — plus their testnets.

---

## Running tests

```bash
npm install
npm test
```

Integration tests that require credentials (`PRIVATE_KEY`, `FILEBASE_API_KEY`) are auto-skipped when the env var is not set.

---

## Links

| | |
|---|---|
| 🌐 **App** | [mint.club](https://mint.club) |
| 📖 **SDK Docs** | [sdk.mint.club](https://sdk.mint.club) |
| 📖 **Protocol Docs** | [docs.mint.club](https://docs.mint.club) |
| 🔗 **Contracts** | [Steemhunt/mint.club-v2-contract](https://github.com/Steemhunt/mint.club-v2-contract) |
| 🤖 **AI Tools (CLI + MCP)** | [mint.club-v2-ai](https://github.com/Steemhunt/mint.club-v2-ai) |
| 💬 **Community** | [OnChat](https://onchat.sebayaki.com/mintclub) |
| 🐦 **Twitter** | [@MintClubPro](https://twitter.com/MintClubPro) |
| 🏗️ **Hunt Town** | [hunt.town](https://hunt.town) |

## License

MIT — built with 🏗️ by [Hunt Town](https://hunt.town)
