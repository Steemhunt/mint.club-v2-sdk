import { TokenHelper, TokenHelperConstructorParams } from './TokenHelper';
import { erc1155Contract } from '../contracts';

export class ERC1155Helper extends TokenHelper {
  constructor(params: Omit<TokenHelperConstructorParams, 'tokenType'>) {
    super({
      ...params,
      tokenType: 'ERC1155',
    });
  }

  public getBalanceOf(walletAddress: `0x${string}`) {
    return erc1155Contract.network(this.chainId).read({
      tokenAddress: this.getTokenAddress(),
      functionName: 'balanceOf',
      args: [walletAddress, 0n],
    });
  }

  public getBalanceOfBatch(walletAddresses: `0x${string}`[]) {
    const ids: bigint[] = Array(walletAddresses.length).fill(0n);
    return erc1155Contract.network(this.chainId).read({
      tokenAddress: this.getTokenAddress(),
      functionName: 'balanceOfBatch',
      args: [walletAddresses, ids],
    });
  }

  public getContrctURI() {
    return erc1155Contract.network(this.chainId).read({
      tokenAddress: this.getTokenAddress(),
      functionName: 'contractURI',
      args: [],
    });
  }

  public getDecimals() {
    return erc1155Contract.network(this.chainId).read({
      tokenAddress: this.getTokenAddress(),
      functionName: 'decimals',
      args: [],
    });
  }

  public getIsApprovedForAll(owner: `0x${string}`, spender: `0x${string}`) {
    return erc1155Contract.network(this.chainId).read({
      tokenAddress: this.getTokenAddress(),
      functionName: 'isApprovedForAll',
      args: [owner, spender],
    });
  }

  public getName() {
    return erc1155Contract.network(this.chainId).read({
      tokenAddress: this.getTokenAddress(),
      functionName: 'name',
      args: [],
    });
  }

  public getSupportsInterface(interfaceId: `0x${string}`) {
    return erc1155Contract.network(this.chainId).read({
      tokenAddress: this.getTokenAddress(),
      functionName: 'supportsInterface',
      args: [interfaceId],
    });
  }

  public getSymbol() {
    return erc1155Contract.network(this.chainId).read({
      tokenAddress: this.getTokenAddress(),
      functionName: 'symbol',
      args: [],
    });
  }

  public getTotalSupply() {
    return erc1155Contract.network(this.chainId).read({
      tokenAddress: this.getTokenAddress(),
      functionName: 'totalSupply',
      args: [],
    });
  }

  public getUri() {
    return erc1155Contract.network(this.chainId).read({
      tokenAddress: this.getTokenAddress(),
      functionName: 'uri',
      args: [0n],
    });
  }
}
