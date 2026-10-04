import { createPublicClient, http, mintclub, WalletClient } from '@mint.club/v2-sdk/node';

const publicClient = createPublicClient({ transport: http() });
const walletClient: WalletClient | undefined = undefined;
const connectedWallet = mintclub.wallet.getWalletClient();
void [publicClient, walletClient, connectedWallet];
