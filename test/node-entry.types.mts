import { createPublicClient, http, mintclub, WalletClient } from '@mint.club/v2-sdk/node';

const publicClient = createPublicClient({ transport: http() });
const walletClient: WalletClient | undefined = mintclub.wallet.getWalletClient();
void [publicClient, walletClient];
