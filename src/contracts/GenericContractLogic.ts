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
import { CHAIN_MAP, CONTRACT_ADDRESSES, ContractChainType, ContractType } from '../exports';
import type { GenericWriteParams, SupportedAbiType } from '../types';
import { ClientHelper } from '../helpers/ClientHelper';

export class GenericContractLogic<
  A extends SupportedAbiType = SupportedAbiType,
  C extends ContractType = ContractType,
> extends ClientHelper {
  public static instances: Partial<
    Record<`${ContractChainType}-${ContractType}`, GenericContractLogic<SupportedAbiType>>
  > = {};
  private abi: A;
  private contractType: C;
  private chainId: ContractChainType;

  constructor(params: { chainId: ContractChainType; type: C; abi: A }) {
    const { chainId, type, abi } = params;
    const supported = CHAIN_MAP[chainId];

    if (!supported) throw new Error(`Chain ${chainId} not supported`);

    super(chainId);
    this.contractType = type;
    this.abi = abi;
    this.chainId = chainId;
  }

  public static getInstance<T extends SupportedAbiType>(chainId: ContractChainType, type: ContractType, abi: T) {
    if (!this.instances[`${chainId}-${type}`]) {
      this.instances[`${chainId}-${type}`] = new this({
        chainId,
        type,
        abi,
      }) as unknown as GenericContractLogic<SupportedAbiType>;
    }
    return this.instances[`${chainId}-${type}`] as unknown as GenericContractLogic<T>;
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
  ) {
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
  >(params: GenericWriteParams<A, T, R, C>) {
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
      ...(value && { value }),
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
    }
  }
}
