import { bondContract, erc1155Contract } from '../contracts';
import { CreateERC1155TokenParams } from '../types/bond.types';
import { TokenHelperConstructorParams } from '../types/token.types';
import { CommonWriteParams } from '../types/transactions.types';
import { Token } from './TokenHelper';

export class ERC1155 extends Token<'ERC1155'> {
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

  public getBondAddress() {
    return erc1155Contract.network(this.chainId).read({
      tokenAddress: this.getTokenAddress(),
      functionName: 'bond',
    });
  }

  public getContractURI() {
    return erc1155Contract.network(this.chainId).read({
      tokenAddress: this.getTokenAddress(),
      functionName: 'contractURI',
    });
  }

  public getDecimals() {
    return erc1155Contract.network(this.chainId).read({
      tokenAddress: this.getTokenAddress(),
      functionName: 'decimals',
    });
  }

  public getIsApprovedForAll(params: { owner: `0x${string}`; spender: `0x${string}` }) {
    const { owner, spender } = params;
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
    });
  }

  public getTotalSupply() {
    return erc1155Contract.network(this.chainId).read({
      tokenAddress: this.getTokenAddress(),
      functionName: 'totalSupply',
    });
  }

  public getMetadataUri() {
    return erc1155Contract.network(this.chainId).read({
      tokenAddress: this.getTokenAddress(),
      functionName: 'uri',
      args: [0n],
    });
  }

  public async getImageUri() {
    const jsonHash = await this.getMetadataUri();
    const metadataIpfsUrl = this.ipfsHelper.hashToGatewayUrl(jsonHash);
    const { image } = await fetch(metadataIpfsUrl).then((res) => res.json());
    return image;
  }

  public async create(params: CreateERC1155TokenParams & Omit<CommonWriteParams, 'value'>) {
    const { onError, metadataUrl } = params;

    try {
      const { args, fee } = await this.checkAndPrepareCreateArgs(params);

      // double check the uploaded hash
      if (metadataUrl.startsWith('ipfs://')) {
        this.ipfsHelper.validateIpfsHash(metadataUrl);
      }

      return bondContract.network(this.chainId).write({
        ...params,
        functionName: 'createMultiToken',
        args: [Object.assign(args.tokenParams, { uri: metadataUrl }), args.bondParams],
        value: fee,
      });
    } catch (e) {
      console.error(e);
      onError?.(e);
    }
  }

  public async approve(params: { spender: `0x${string}`; approved: boolean } & CommonWriteParams) {
    const { spender, approved } = params;
    return erc1155Contract.network(this.chainId).write({
      ...params,
      tokenAddress: this.getTokenAddress(),
      functionName: 'setApprovalForAll',
      args: [spender, approved],
    });
  }
}
