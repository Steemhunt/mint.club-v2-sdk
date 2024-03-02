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
import { CONTRACT_ADDRESSES, SdkSupportedChainIds, ContractNames } from '../exports';
import { ClientHelper } from '../helpers/ClientHelper';
import type { GenericWriteParams, SupportedAbiType } from '../types';

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
> extends ClientHelper {
  private abi: A;
  private contractType: C;
  private chainId: SdkSupportedChainIds;

  constructor(params: GenericLogicConstructorParams<A, C>) {
    const { chainId, type, abi } = params;

    super(chainId, type);
    this.contractType = type;
    this.abi = abi;
    this.chainId = chainId;
  }

  public read<
    T extends ContractFunctionName<A, 'view' | 'pure'>,
    R extends ContractFunctionArgs<A, 'view' | 'pure', T>,
  >(
    params: C extends 'ERC20' | 'ERC1155'
      ? {
          functionName: T;
          args: R;
          tokenAddress: `0x${string}`;
        }
      : { functionName: T; args: R },
  ): Promise<ReadContractReturnType<A, T, R>> {
    const { functionName, args } = params;
    let address: `0x${string}`;

    if ('tokenAddress' in params) {
      address = params.tokenAddress;
    } else {
      address = CONTRACT_ADDRESSES[this.contractType][this.chainId];
    }

    return this.getPublicClient().readContract({
      abi: this.abi,
      address,
      functionName,
      ...(args && { args }),
    } as unknown as ReadContractParameters<A, T, R>) as Promise<ReadContractReturnType<A, T, R>>;
  }

  public async write<
    T extends ContractFunctionName<A, 'payable' | 'nonpayable'>,
    R extends ContractFunctionArgs<A, 'payable' | 'nonpayable', T>,
  >(params: GenericWriteParams<A, T, R, C>): Promise<TransactionReceipt> {
    await this.initializeWallet();

    const walletClient = this.getWalletClient();

    if (!walletClient) throw new Error('No wallet client found');

    const { functionName, args, value, onError, onRequestSignature, onSigned, onSuccess } = params;
    let address: `0x${string}`;

    if ('tokenAddress' in params) {
      address = params.tokenAddress;
    } else {
      address = CONTRACT_ADDRESSES[this.contractType][this.chainId];
    }
    const simulationArgs = {
      abi: this.abi,
      address,
      functionName,
      args,
      ...(value !== undefined && { value }),
    } as unknown as SimulateContractParameters<A, T, R>;

    try {
      const { request } = (await this.getPublicClient().simulateContract(simulationArgs)) as SimulateContractReturnType<
        A,
        T,
        R
      >;

      onRequestSignature?.();
      const tx = await walletClient.writeContract(request as WriteContractParameters<A, T, R>);

      onSigned?.(tx);

      const receipt = await this.getPublicClient().waitForTransactionReceipt({
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
