import { Client, defaultClient } from './ClientHelper';
import { SdkSupportedChainIds } from '../constants/contracts';
import { bondContract } from '../contracts';
import { CommonWriteParams } from '../types/transactions.types';

export class Bond {
  protected chainId: SdkSupportedChainIds;

  constructor(
    chainId: SdkSupportedChainIds,
    protected clientHelper: Client = defaultClient,
  ) {
    this.chainId = chainId;
  }

  public getCreationFee() {
    return bondContract.network(this.chainId, this.clientHelper).read({
      functionName: 'creationFee',
    });
  }

  public getTokensByReserveToken(params: { reserveToken: `0x${string}`; start?: number; end?: number }) {
    const { reserveToken, start = 0, end = 1000 } = params;
    return bondContract.network(this.chainId, this.clientHelper).read({
      functionName: 'getTokensByReserveToken',
      args: [reserveToken, BigInt(start), BigInt(end)],
    });
  }

  public getTokensByCreator(params: { creator: `0x${string}`; start?: number; end?: number }) {
    const { creator, start = 0, end = 1000 } = params;
    return bondContract.network(this.chainId, this.clientHelper).read({
      functionName: 'getTokensByCreator',
      args: [creator, BigInt(start), BigInt(end)],
    });
  }

  public getList(params: { start?: number; end?: number }) {
    const { start = 0, end = 1000 } = params;
    return bondContract.network(this.chainId, this.clientHelper).read({
      functionName: 'getList',
      args: [BigInt(start), BigInt(end)],
    });
  }

  public getRoyaltyInfo(params: { wallet: `0x${string}`; reserveToken: `0x${string}` }) {
    const { wallet, reserveToken } = params;
    return bondContract.network(this.chainId, this.clientHelper).read({
      functionName: 'getRoyaltyInfo',
      args: [wallet, reserveToken],
    });
  }

  public claimRoyalties(params: { reserveToken: `0x${string}` } & CommonWriteParams) {
    const { reserveToken, ...writeParams } = params;
    return bondContract.network(this.chainId, this.clientHelper).write({
      ...writeParams,
      functionName: 'claimRoyalties',
      args: [reserveToken],
    });
  }
}
