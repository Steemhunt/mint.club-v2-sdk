import { SdkSupportedChainIds } from '../constants/contracts';
import { bondContract } from '../contracts';

export class Bond {
  protected chainId: SdkSupportedChainIds;

  constructor(chainId: SdkSupportedChainIds) {
    this.chainId = chainId;
  }

  public getCreationFee() {
    return bondContract.network(this.chainId).read({
      functionName: 'creationFee',
    });
  }

  public getTokensByReserveToken(params: { reserveToken: `0x${string}`; start?: number; end?: number }) {
    const { reserveToken, start = 0, end = 1000 } = params;
    return bondContract.network(this.chainId).read({
      functionName: 'getTokensByReserveToken',
      args: [reserveToken, BigInt(start), BigInt(end)],
    });
  }

  public getTokensByCreator(params: { creator: `0x${string}`; start?: number; end?: number }) {
    const { creator, start = 0, end = 1000 } = params;
    return bondContract.network(this.chainId).read({
      functionName: 'getTokensByCreator',
      args: [creator, BigInt(start), BigInt(end)],
    });
  }
}
