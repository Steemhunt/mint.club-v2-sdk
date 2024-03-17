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

  public getTokensByReserveToken(reserveToken: `0x${string}`) {
    return bondContract.network(this.chainId).read({
      functionName: 'getTokensByReserveToken',
      args: [reserveToken, 0n, 1000n],
    });
  }

  public getTokensByCreator(reserveToken: `0x${string}`) {
    return bondContract.network(this.chainId).read({
      functionName: 'getTokensByCreator',
      args: [reserveToken, 0n, 1000n],
    });
  }
}
