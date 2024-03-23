import {
  Chain,
  ContractFunctionArgs,
  ContractFunctionName,
  ReadContractParameters,
  ReadContractReturnType,
  SimulateContractParameters,
  SimulateContractReturnType,
  TransactionReceipt,
  WriteContractParameters,
  createWalletClient,
  fallback,
  publicActions,
} from 'viem';
import { WalletNotConnectedError } from '../errors/sdk.errors';
import {
  ContractNames,
  DEFAULT_RANK_OPTIONS,
  SdkSupportedChainIds,
  chainRPCFallbacks,
  getChain,
  getMintClubContractAddress,
} from '../exports';
import { Client } from '../helpers/ClientHelper';
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
  private clientHelper: Client;
  private chain: Chain;

  constructor(params: GenericLogicConstructorParams<A, C>) {
    const { chainId, type, abi } = params;

    this.contractType = type;
    this.abi = abi;
    this.chainId = chainId;
    this.chain = getChain(chainId);
    this.clientHelper = new Client();
  }

  public read<
    T extends ContractFunctionName<A, 'view' | 'pure'>,
    R extends ContractFunctionArgs<A, 'view' | 'pure', T>,
  >(params: TokenContractReadWriteArgs<A, T, R, C>): Promise<ReadContractReturnType<A, T, R>> {
    const { functionName } = params;

    const args = 'args' in params ? params.args : undefined;
    let address: `0x${string}`;

    if ('tokenAddress' in params) {
      address = params.tokenAddress;
    } else {
      address = getMintClubContractAddress(this.contractType, this.chainId);
    }

    const publicClient = this.clientHelper._getPublicClient(this.chainId);

    return publicClient.readContract({
      abi: this.abi,
      address,
      functionName,
      args,
    } as unknown as ReadContractParameters<A, T, R>) as Promise<ReadContractReturnType<A, T, R>>;
  }

  public async write<
    T extends ContractFunctionName<A, 'payable' | 'nonpayable'>,
    R extends ContractFunctionArgs<A, 'payable' | 'nonpayable', T>,
  >(params: GenericWriteParams<A, T, R, C>) {
    const { functionName, value, debug, onError, onSignatureRequest: onSignatureRequest, onSigned, onSuccess } = params;

    let args, simulationArgs;
    args = 'args' in params ? params.args : undefined;

    let address: `0x${string}`;

    if ('tokenAddress' in params) {
      address = params.tokenAddress;
    } else {
      address = getMintClubContractAddress(this.contractType, this.chainId);
    }

    try {
      let walletClient = this.clientHelper.getWalletClient();

      const isNodeOrPrivateKey = this.clientHelper.isPrivateKey() || typeof window === 'undefined';

      if (isNodeOrPrivateKey) {
        if (!walletClient) {
          throw new WalletNotConnectedError();
        }

        walletClient = walletClient;
      } else {
        await this.clientHelper.connect();
        walletClient = this.clientHelper.getWalletClient();
      }

      if (!walletClient || !walletClient.account) {
        await this.clientHelper.connect();
        return;
      }

      if (!isNodeOrPrivateKey) {
        await walletClient.addChain({ chain: this.chain });
        await walletClient.switchChain({ id: this.chainId });
        walletClient.chain = this.chain;
      }

      const client = createWalletClient({
        chain: this.chain,
        account: walletClient.account,
        transport: fallback(chainRPCFallbacks(this.chain), DEFAULT_RANK_OPTIONS),
      }).extend(publicActions);

      simulationArgs = {
        chain: this.chain,
        account: walletClient.account,
        abi: this.abi,
        address,
        functionName,
        args,
        ...(value !== undefined && { value }),
      } as unknown as SimulateContractParameters<A, T, R>;

      debug?.(simulationArgs);

      const { request } = (await client.simulateContract(simulationArgs)) as SimulateContractReturnType<A, T, R>;

      onSignatureRequest?.();
      const tx = await client.writeContract(request as WriteContractParameters<A, T, R>);

      onSigned?.(tx);

      const receipt = await this.clientHelper._getPublicClient(this.chainId).waitForTransactionReceipt({
        hash: tx,
      });

      onSuccess?.(receipt as TransactionReceipt);

      return receipt;
    } catch (e) {
      if (e) {
        Object.assign(e, { functionName, args, simulationArgs, value });
      }
      onError?.(e);
      return;
    }
  }
}
