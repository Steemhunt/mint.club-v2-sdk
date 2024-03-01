import { bondContract, erc1155Contract, erc20Contract } from '../contracts';
import { SymbolNotDefinedError, TokenAlreadyExistsError } from '../errors/sdk.errors';
import { CHAIN_MAP, chainIdToString } from '../exports';
import { GenericWriteParams } from '../types';
import { CreateERC1155TokenParams } from '../types/bond.types';
import { IPFSUploadERC1155MetadataParams } from '../types/ipfs.types';
import { generateCreateArgs } from '../utils/bond';
import { IPFS } from './IPFSHelper';
import { TokenHelper, TokenHelperConstructorParams } from './TokenHelper';

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

  private async uploadMetadata(data: CreateERC1155TokenParams) {
    const { name, reserveToken, image, metadata, video } = data;
    const chainString = chainIdToString(this.chainId);
    const chainName = CHAIN_MAP[this.chainId].name;

    const reserveTokenName = await erc20Contract.network(this.chainId).read({
      tokenAddress: reserveToken.address,
      functionName: 'name',
      args: [],
    });

    const reserveTokenSymbol = await erc20Contract.network(this.chainId).read({
      tokenAddress: reserveToken.address,
      functionName: 'symbol',
      args: [],
    });

    const defaultExternalLink = `https://mint.club/nft/${chainString}/${this.symbol}`;
    const defaultDescription = [
      `${name} (${this.symbol}) is a Bonding Curved ERC-1155 token created on mint.club.`,
      `Backed by ${reserveTokenName} (${reserveTokenSymbol}) on ${chainName} chain.`,
      defaultExternalLink,
    ].join('\n\n');

    const finalMetadata: IPFSUploadERC1155MetadataParams = {
      name,
      description: defaultDescription,
      image,
      video,
      external_url: defaultExternalLink,
    };

    if (metadata?.description) finalMetadata.description = metadata.description;
    if (metadata?.external_url) finalMetadata.external_url = metadata.external_url;
    if (metadata?.attributes) finalMetadata.attributes = metadata.attributes;

    const hash = await IPFS.uploadERC1155Metadata(finalMetadata);

    return `ipfs://${hash}`;
  }

  public async create(
    params: CreateERC1155TokenParams &
      Pick<GenericWriteParams, 'onError' | 'onRequestSignature' | 'onSigned' | 'onSuccess'> & {
        onIPFSUploadStart?: () => void;
        onIPFSUploadComplete?: () => void;
      },
  ) {
    if (!this.symbol) throw new SymbolNotDefinedError();

    const exists = await this.exists();
    if (exists) throw new TokenAlreadyExistsError();

    const args = generateCreateArgs({ ...params, tokenType: this.tokenType, symbol: this.symbol });
    const { onError, onIPFSUploadStart, onIPFSUploadComplete, onRequestSignature, onSigned, onSuccess } = params;

    const fee = await this.getCreationFee();
    onIPFSUploadStart?.();
    const uri = await this.uploadMetadata(params);
    onIPFSUploadComplete?.();

    return bondContract.network(this.chainId).write({
      functionName: 'createMultiToken',
      args: [Object.assign(args.tokenParams, { uri }), args.bondParams],
      value: fee,
      onError,
      onRequestSignature,
      onSigned,
      onSuccess,
    });
  }
}
