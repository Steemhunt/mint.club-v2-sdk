import {
  ContractFunctionArgs,
  ContractFunctionName,
  ReadContractParameters,
  ReadContractReturnType,
  SimulateContractParameters,
  SimulateContractReturnType,
  TransactionReceipt,
  WriteContractParameters,
} from 'viem';
import { ContractNames, SdkSupportedChainIds, getMintClubContractAddress } from '../exports';
import { ClientHelper } from '../helpers/ClientHelper';
import { SupportedAbiType } from '../types/abi.types';
import { GenericWriteParams, TokenContractReadWriteArgs } from '../types/transactions.types';

type GenericLogicConstructorParams<
  A extends SupportedAbiType = SupportedAbiType,
  C extends ContractNames = ContractNames,
> = {
  chainId: SdkSupportedChainIds;
  type: C;
  abi: A;
};

export class GenericContractLogic<
  A extends SupportedAbiType = SupportedAbiType,
  C extends ContractNames = ContractNames,
> {
  private abi: A;
  private contractType: C;
  private chainId: SdkSupportedChainIds;
  private clientHelper: ClientHelper;

  constructor(params: GenericLogicConstructorParams<A, C>) {
    const { chainId, type, abi } = params;

    this.contractType = type;
    this.abi = abi;
    this.chainId = chainId;
    this.clientHelper = new ClientHelper();
  }

  public read<
    T extends ContractFunctionName<A, 'view' | 'pure'>,
    R extends ContractFunctionArgs<A, 'view' | 'pure', T>,
  >(params: TokenContractReadWriteArgs<A, T, R, C>): Promise<ReadContractReturnType<A, T, R>> {
    const { functionName, args } = params;
    let address: `0x${string}`;

    if ('tokenAddress' in params) {
      address = params.tokenAddress;
    } else {
      address = getMintClubContractAddress(this.contractType, this.chainId);
    }

    const publicClient = this.clientHelper.getPublicClient(this.chainId);

    return publicClient.readContract({
      abi: this.abi,
      address,
      functionName,
      ...(args !== undefined && { args }),
    } as unknown as ReadContractParameters<A, T, R>) as Promise<ReadContractReturnType<A, T, R>>;
  }

  public async write<
    T extends ContractFunctionName<A, 'payable' | 'nonpayable'>,
    R extends ContractFunctionArgs<A, 'payable' | 'nonpayable', T>,
  >(params: GenericWriteParams<A, T, R, C>): Promise<TransactionReceipt> {
    await this.clientHelper.connectWallet();

    const walletClient = this.clientHelper.getWalletClient();

    if (!walletClient) throw new Error('No wallet client found');

    const chainId = await walletClient.getChainId();

    if (chainId !== this.chainId) {
      await walletClient.switchChain({ id: this.chainId });
    }

    const {
      functionName,
      args,
      value,
      debug,
      onError,
      onSignatureRequest: onSignatureRequest,
      onSigned,
      onSuccess,
    } = params;
    let address: `0x${string}`;

    if ('tokenAddress' in params) {
      address = params.tokenAddress;
    } else {
      address = getMintClubContractAddress(this.contractType, this.chainId);
    }

    const simulationArgs = {
      account: walletClient.account,
      abi: this.abi,
      address,
      functionName,
      args,
      ...(value !== undefined && { value }),
    } as unknown as SimulateContractParameters<A, T, R>;

    debug?.(simulationArgs);

    try {
      const { request } = (await this.clientHelper
        .getPublicClient(this.chainId)
        .simulateContract(simulationArgs)) as SimulateContractReturnType<A, T, R>;

      onSignatureRequest?.();
      const tx = await walletClient.writeContract(request as WriteContractParameters<A, T, R>);

      onSigned?.(tx);

      const receipt = await this.clientHelper.getPublicClient(this.chainId).waitForTransactionReceipt({
        hash: tx,
      });

      onSuccess?.(receipt as TransactionReceipt);

      return receipt;
    } catch (e) {
      if (e) {
        Object.assign(e, { functionName, args, simulationArgs, value });
      }
      onError?.(e);
      throw e;
    }
  }
}
