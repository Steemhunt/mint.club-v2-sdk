import { bondContract, erc1155Contract, erc20Contract } from '../contracts';
import { FilebaseKeyNeededErrror, SymbolNotDefinedError, TokenAlreadyExistsError } from '../errors/sdk.errors';
import { CHAIN_MAP, chainIdToString } from '../exports';
import { CreateERC1155TokenParams } from '../types/bond.types';
import { IpfsHashUrl, MetadataUploadParams } from '../types/ipfs.types';
import { TokenHelperConstructorParams } from '../types/token.types';
import { CommonWriteParams } from '../types/transactions.types';
import { IpfsHelper } from './IpfsHelper';
import { TokenHelper } from './TokenHelper';

export class ERC1155Helper extends TokenHelper<'ERC1155'> {
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

  public getUri() {
    return erc1155Contract.network(this.chainId).read({
      tokenAddress: this.getTokenAddress(),
      functionName: 'uri',
      args: [0n],
    });
  }

  private async uploadMetadata(data: CreateERC1155TokenParams): Promise<IpfsHashUrl> {
    const { name, reserveToken, image, metadata, video } = data;
    const chainString = chainIdToString(this.chainId);
    const chainName = CHAIN_MAP[this.chainId].name;

    const reserveTokenName = await erc20Contract.network(this.chainId).read({
      tokenAddress: reserveToken.address,
      functionName: 'name',
    });

    const reserveTokenSymbol = await erc20Contract.network(this.chainId).read({
      tokenAddress: reserveToken.address,
      functionName: 'symbol',
    });

    const defaultExternalLink = `https://mint.club/nft/${chainString}/${this.symbol}`;
    const defaultDescription = [
      `${name} (${this.symbol}) is a Bonding Curved ERC-1155 token created on mint.club.`,
      `Backed by ${reserveTokenName} (${reserveTokenSymbol}) on ${chainName} chain.`,
      defaultExternalLink,
    ].join('\n\n');

    const finalMetadata: MetadataUploadParams = {
      name,
      description: defaultDescription,
      image,
      video,
      external_url: defaultExternalLink,
    };

    if (metadata?.description) finalMetadata.description = metadata.description;
    if (metadata?.external_url) finalMetadata.external_url = metadata.external_url;
    if (metadata?.attributes) finalMetadata.attributes = metadata.attributes;

    return await IpfsHelper.uploadERC1155Metadata(finalMetadata);
  }

  public async create(params: CreateERC1155TokenParams & Omit<CommonWriteParams, 'value'>) {
    const {
      image,
      video,
      filebaseApiKey,
      onError,
      onIpfsUploadStart: onIPFSUploadStart,
      onIpfsUploadComplete: onIPFSUploadComplete,
    } = params;

    try {
      const { args, fee } = await this.checkAndPrepareCreateArgs(params);
      const filebaseUsed = image instanceof File || video instanceof File;
      if (filebaseUsed && !filebaseApiKey) {
        onError?.(new FilebaseKeyNeededErrror());
        return;
      }

      if (filebaseUsed) onIPFSUploadStart?.();
      const uri = await this.uploadMetadata(params);
      // double check the uploaded hash
      IpfsHelper.validateIpfsHash(uri);
      if (filebaseUsed) onIPFSUploadComplete?.();

      return bondContract.network(this.chainId).write({
        ...params,
        functionName: 'createMultiToken',
        args: [Object.assign(args.tokenParams, { uri }), args.bondParams],
        value: fee,
      });
    } catch (e) {
      onError?.(e);
    }
  }
}
