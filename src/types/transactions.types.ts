import { Abi, ContractFunctionArgs, ContractFunctionName, TransactionReceipt } from 'viem';
import { ContractNames, TokenType } from '../exports';

export type TokenContractReadWriteArgs<
  A extends Abi,
  T extends ContractFunctionName<A, 'view' | 'pure'> | ContractFunctionName<A, 'payable' | 'nonpayable'>,
  R extends ContractFunctionArgs<A, 'view' | 'pure', T> | ContractFunctionArgs<A, 'payable' | 'nonpayable', T>,
  C extends ContractNames = ContractNames,
> = (R extends readonly [] ? {} : { args: R }) &
  (C extends 'ERC20' | 'ERC1155'
    ? {
        tokenAddress: `0x${string}`;
        functionName: T;
      }
    : {
        functionName: T;
      });

export type WriteTransactionCallbacks = {
  debug?: (args: any) => void;

  onAllowanceSignatureRequest?: () => void;
  onAllowanceSigned?: () => void;
  onAllowanceSuccess?: (receipt: TransactionReceipt) => void;

  onSignatureRequest?: () => void;
  onSigned?: (tx: `0x${string}`) => void;
  onSuccess?: (receipt: TransactionReceipt) => void;
  onError?: (error: unknown) => void;
};

export type ApproveParams<T extends TokenType> = T extends 'ERC20'
  ? {
      allowanceAmount?: bigint;
      amountToSpend?: bigint;
    }
  : {};

export type CommonWriteParams = WriteTransactionCallbacks & {
  value?: bigint;
};

export type GenericWriteParams<
  A extends Abi = Abi,
  T extends ContractFunctionName<A, 'payable' | 'nonpayable'> = ContractFunctionName<A, 'payable' | 'nonpayable'>,
  R extends ContractFunctionArgs<A, 'payable' | 'nonpayable', T> = ContractFunctionArgs<A, 'payable' | 'nonpayable', T>,
  C extends ContractNames = ContractNames,
> = TokenContractReadWriteArgs<A, T, R, C> & CommonWriteParams;

export type CurveType = 'LINEAR' | 'EXPONENTIAL' | 'LOGARITHMIC' | 'FLAT';

export type TradeType = 'buy' | 'sell';

declare global {
  var mcv2Hardhat: Partial<{
    [K in ContractNames]: Partial<{
      [K in number]: `0x${string}`;
    }>;
  }>;
}
