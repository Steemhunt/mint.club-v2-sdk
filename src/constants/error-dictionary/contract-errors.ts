import {
  BondErrorNames,
  ERC20ErrorNames,
  ERC1155ErrorNames,
  LockerErrorNames,
  MerkleErrorNames,
  ZapErrorNames,
  AllContractErrorNames,
} from './contract-error-types';

type ErrorObjectType = {
  message: string;
  reportToBugsnag?: boolean;
};

export const BOND_ERROR_MESSAGES: Record<BondErrorNames, ErrorObjectType> = {
  AddressEmptyCode: {
    message: 'The address field cannot be empty. Please provide a valid address.',
    reportToBugsnag: true,
  },
  AddressInsufficientBalance: {
    message: 'The address does not have enough balance to proceed with the transaction.',
    reportToBugsnag: false,
  },
  ERC1167FailedCreateClone: {
    message: 'Failed to create a clone due to an ERC1167 cloning error. Please check the implementation.',
    reportToBugsnag: true,
  },
  FailedInnerCall: {
    message: 'An internal call within the contract failed, indicating a potential issue with contract logic or state.',
    reportToBugsnag: true,
  },
  MCV2_Bond__CreationFeeTransactionFailed: {
    message:
      'The transaction for the creation fee has failed. Ensure you have enough funds and the fee is correctly set.',
    reportToBugsnag: true,
  },
  MCV2_Bond__ExceedMaxSupply: {
    message: 'The creation of this token would exceed its maximum supply limit. No further tokens can be created.',
    reportToBugsnag: false,
  },
  MCV2_Bond__ExceedTotalSupply: {
    message: 'Attempting to exceed the total supply of tokens. Please verify the token amount.',
    reportToBugsnag: false,
  },
  MCV2_Bond__InvalidConstructorParams: {
    message: 'The constructor parameters provided are invalid. Please check and try again.',
    reportToBugsnag: true,
  },
  MCV2_Bond__InvalidCreationFee: {
    message: 'The creation fee provided is invalid. Ensure the fee meets the required criteria.',
    reportToBugsnag: true,
  },
  MCV2_Bond__InvalidCreatorAddress: {
    message: 'The creator address is invalid. A valid creator address is required to proceed.',
    reportToBugsnag: true,
  },
  MCV2_Bond__InvalidCurrentSupply: {
    message: 'The current supply value is invalid. Please check the supply amount and try again.',
    reportToBugsnag: true,
  },
  MCV2_BOND__InvalidPaginationParameters: {
    message: 'Pagination parameters are invalid. Please adjust your request and try again.',
    reportToBugsnag: false,
  },
  MCV2_Bond__InvalidReceiver: {
    message: 'The receiver address is invalid. Transactions require a valid receiver address.',
    reportToBugsnag: true,
  },
  MCV2_Bond__InvalidReserveToken: {
    message: 'The reserve token specified is invalid. Check the token address and try again.',
    reportToBugsnag: true,
  },
  MCV2_Bond__InvalidStepParams: {
    message: 'The step parameters provided are invalid. Please review and correct them.',
    reportToBugsnag: true,
  },
  MCV2_Bond__InvalidTokenAmount: {
    message: 'The token amount specified is invalid. Ensure the amount is correct and try again.',
    reportToBugsnag: true,
  },
  MCV2_Bond__InvalidTokenCreationParams: {
    message: 'The token creation parameters are invalid. Check the documentation and try again.',
    reportToBugsnag: true,
  },
  MCV2_Bond__PermissionDenied: {
    message: 'You do not have permission to perform this action. Ensure you have the necessary rights.',
    reportToBugsnag: true,
  },
  MCV2_Bond__SlippageLimitExceeded: {
    message: 'The slippage limit has been exceeded. Adjust your slippage settings and try again.',
    reportToBugsnag: false,
  },
  MCV2_Bond__TokenNotFound: {
    message: 'The specified token could not be found. Check the token address and try again.',
    reportToBugsnag: true,
  },
  MCV2_Bond__TokenSymbolAlreadyExists: {
    message: 'The token symbol already exists. Use a unique symbol and try again.',
    reportToBugsnag: true,
  },
  MCV2_Royalty__InvalidParams: {
    message: 'The parameters provided for royalty settings are invalid. Please review and correct them.',
    reportToBugsnag: true,
  },
  MCV2_Royalty__NothingToClaim: {
    message: 'There is nothing to claim at this time. Check back later or verify your entitlement.',
    reportToBugsnag: false,
  },
  OwnableInvalidOwner: {
    message: 'The operation was attempted by an invalid owner. Only the contract owner can perform this action.',
    reportToBugsnag: true,
  },
  OwnableUnauthorizedAccount: {
    message: 'The account is unauthorized. This action is restricted to authorized accounts only.',
    reportToBugsnag: true,
  },
  SafeCastOverflowedUintDowncast: {
    message: 'Overflow encountered during uint downcasting. Please check the values being cast.',
    reportToBugsnag: true,
  },
  SafeERC20FailedOperation: {
    message: 'An operation with ERC20 tokens failed. Ensure the contract and token addresses are correct.',
    reportToBugsnag: true,
  },
};

// Follow a similar pattern for ERC20_ERROR_MESSAGES, ERC1155_ERROR_MESSAGES, LOCKER_ERROR_MESSAGES, MERKLE_ERROR_MESSAGES, ZAP_ERROR_MESSAGES, and V1_WRAPPER_ERROR_MESSAGES.
export const ERC20_ERROR_MESSAGES: Record<ERC20ErrorNames, ErrorObjectType> = {
  ERC20InsufficientAllowance: {
    message: 'Your allowance for spending these tokens is insufficient. Please approve more tokens before proceeding.',
    reportToBugsnag: true,
  },
  ERC20InsufficientBalance: {
    message: 'Your balance is insufficient to complete this transaction. Please ensure you have enough tokens.',
    reportToBugsnag: false,
  },
  ERC20InvalidApprover: {
    message: 'The approver address is invalid or does not have permission to approve these tokens.',
    reportToBugsnag: true,
  },
  ERC20InvalidReceiver: {
    message: 'The receiver address is invalid. Please provide a valid address to complete the transaction.',
    reportToBugsnag: true,
  },
  ERC20InvalidSender: {
    message: 'The sender address is invalid or does not have permission to send these tokens.',
    reportToBugsnag: true,
  },
  ERC20InvalidSpender: {
    message: 'The spender address is invalid or not allowed to spend tokens on behalf of the sender.',
    reportToBugsnag: true,
  },
  MCV2_Token__AlreadyInitialized: {
    message: 'This token has already been initialized. Token initialization can only occur once.',
    reportToBugsnag: true,
  },
  MCV2_Token__PermissionDenied: {
    message: 'Permission denied. You do not have the necessary permissions to perform this action.',
    reportToBugsnag: true,
  },
};

export const ERC1155_ERROR_MESSAGES: Record<ERC1155ErrorNames, ErrorObjectType> = {
  ERC1155InsufficientBalance: {
    message: 'Your balance for one or more tokens is insufficient to complete this transaction.',
    reportToBugsnag: false,
  },
  ERC1155InvalidApprover: {
    message: 'The approver for this operation is invalid or does not have approval rights.',
    reportToBugsnag: true,
  },
  ERC1155InvalidArrayLength: {
    message: 'The length of the array provided does not match the expected length for this operation.',
    reportToBugsnag: true,
  },
  ERC1155InvalidOperator: {
    message: 'The operator address provided is invalid or not authorized to perform this operation.',
    reportToBugsnag: true,
  },
  ERC1155InvalidReceiver: {
    message: 'The receiver address provided is invalid. A valid address is required to receive the tokens.',
    reportToBugsnag: true,
  },
  ERC1155InvalidSender: {
    message: 'The sender address is invalid or unauthorized to send these tokens.',
    reportToBugsnag: true,
  },
  ERC1155MissingApprovalForAll: {
    message: 'Approval for all tokens has not been given. Please approve all tokens before proceeding.',
    reportToBugsnag: true,
  },
  MCV2_MultiToken__AlreadyInitialized: {
    message: 'The multi-token contract has already been initialized and cannot be initialized again.',
    reportToBugsnag: true,
  },
  MCV2_MultiToken__BurnAmountExceedsTotalSupply: {
    message: 'The amount to be burned exceeds the total supply of the token.',
    reportToBugsnag: true,
  },
  MCV2_MultiToken__NotApproved: {
    message: 'The operation was not approved. Ensure you have the necessary approvals before retrying.',
    reportToBugsnag: true,
  },
  MCV2_MultiToken__PermissionDenied: {
    message: 'Permission denied for this operation. Required permissions are not met.',
    reportToBugsnag: true,
  },
};

export const LOCKER_ERROR_MESSAGES: Record<LockerErrorNames, ErrorObjectType> = {
  AddressEmptyCode: {
    message: 'The provided address is empty. Please ensure you input a valid address.',
    reportToBugsnag: true,
  },
  AddressInsufficientBalance: {
    message: 'The address has an insufficient balance for this operation. Please check your balance and try again.',
    reportToBugsnag: false,
  },
  FailedInnerCall: {
    message: 'An internal contract call failed. Please review the contract logic or contact support.',
    reportToBugsnag: true,
  },
  LockUp__AlreadyClaimed: {
    message: 'The rewards or tokens have already been claimed. You cannot claim them again.',
    reportToBugsnag: true,
  },
  LockUp__InvalidPaginationParameters: {
    message: 'Pagination parameters provided are invalid. Please adjust and retry your request.',
    reportToBugsnag: true,
  },
  LockUp__InvalidParams: {
    message: 'Parameters provided for the operation are invalid. Please review and correct them.',
    reportToBugsnag: true,
  },
  LockUp__NotYetUnlocked: {
    message: 'The locked tokens are not yet available for claim. Please wait until the unlock period has passed.',
    reportToBugsnag: true,
  },
  LockUp__PermissionDenied: {
    message: 'You do not have permission to perform this action. Check your account permissions and try again.',
    reportToBugsnag: true,
  },
  SafeERC20FailedOperation: {
    message: 'An operation with ERC20 tokens failed. Ensure the contract addresses and token details are correct.',
    reportToBugsnag: true,
  },
};

export const MERKLE_ERROR_MESSAGES: Record<MerkleErrorNames, ErrorObjectType> = {
  AddressEmptyCode: {
    message: 'The address provided is empty. A valid address is required for this operation.',
    reportToBugsnag: true,
  },
  AddressInsufficientBalance: {
    message: 'Insufficient balance for the operation. Please ensure your balance is sufficient to proceed.',
    reportToBugsnag: false,
  },
  FailedInnerCall: {
    message: 'An internal call within the contract failed, indicating a potential issue. Please investigate further.',
    reportToBugsnag: true,
  },
  MerkleDistributor__AlreadyClaimed: {
    message: 'The claim has already been made. Duplicate claims are not allowed.',
    reportToBugsnag: true,
  },
  MerkleDistributor__AlreadyRefunded: {
    message: 'The refund has already been processed. Duplicate refunds are not permitted.',
    reportToBugsnag: true,
  },
  MerkleDistributor__Finished: {
    message: 'The distribution period has ended. No further claims can be processed.',
    reportToBugsnag: true,
  },
  MerkleDistributor__InvalidCaller: {
    message: 'The caller is not authorized for this operation. Please check the caller’s permissions.',
    reportToBugsnag: true,
  },
  MerkleDistributor__InvalidPaginationParameters: {
    message: 'Provided pagination parameters are invalid. Please correct them and try again.',
    reportToBugsnag: true,
  },
  MerkleDistributor__InvalidParams: {
    message: 'The parameters provided are invalid. Check the input parameters and retry.',
    reportToBugsnag: true,
  },
  MerkleDistributor__InvalidProof: {
    message: 'The provided proof is invalid. Ensure you connected the correct address for your airdrop claim.',
    reportToBugsnag: true,
  },
  MerkleDistributor__NoClaimableTokensLeft: {
    message: 'There are no tokens left to claim. All tokens have been distributed.',
    reportToBugsnag: true,
  },
  MerkleDistributor__NothingToRefund: {
    message: 'There is nothing to refund. Please check your claim status.',
    reportToBugsnag: true,
  },
  MerkleDistributor__NotStarted: {
    message: 'The distribution has not started yet. Please wait for the distribution period to begin.',
    reportToBugsnag: true,
  },
  MerkleDistributor__PermissionDenied: {
    message: 'Permission denied for this action. You do not have the necessary permissions.',
    reportToBugsnag: true,
  },
  MerkleDistributor__Refunded: {
    message: 'Your tokens have been refunded. Check your account for the refunded tokens.',
    reportToBugsnag: true,
  },
  SafeERC20FailedOperation: {
    message: 'An ERC20 operation failed. Ensure the contract address and token details are correct and try again.',
    reportToBugsnag: true,
  },
};

export const ZAP_ERROR_MESSAGES: Record<ZapErrorNames, ErrorObjectType> = {
  AddressEmptyCode: {
    message: 'The provided address is empty. A valid address must be used for this operation.',
    reportToBugsnag: true,
  },
  AddressInsufficientBalance: {
    message: 'The address has insufficient balance for the intended operation. Please check your balance.',
    reportToBugsnag: false,
  },
  FailedInnerCall: {
    message: 'An internal call failed. This may indicate an issue with contract interactions or logic.',
    reportToBugsnag: true,
  },
  MCV2_ZapV1__EthTransferFailed: {
    message: 'ETH transfer failed. Ensure you have enough ETH and the recipient address is correct.',
    reportToBugsnag: true,
  },
  MCV2_ZapV1__InvalidReceiver: {
    message: 'The receiver address is invalid. Transactions require a valid receiver address.',
    reportToBugsnag: true,
  },
  MCV2_ZapV1__ReserveIsNotWETH: {
    message: 'The reserve is not WETH. This operation requires WETH as the reserve currency.',
    reportToBugsnag: true,
  },
  MCV2_ZapV1__SlippageLimitExceeded: {
    message: 'The slippage limit was exceeded. Adjust your slippage tolerance and try again.',
    reportToBugsnag: false,
  },
  OwnableInvalidOwner: {
    message: 'The action was attempted by an invalid owner. Only the contract owner can perform this action.',
    reportToBugsnag: true,
  },
  OwnableUnauthorizedAccount: {
    message: 'This account is unauthorized to perform the requested action. Check account permissions.',
    reportToBugsnag: true,
  },
  SafeERC20FailedOperation: {
    message: 'An operation involving ERC20 tokens failed. Check the contract and token details before retrying.',
    reportToBugsnag: true,
  },
};

export const CONTRACT_ERROR_MESSAGES: Record<AllContractErrorNames, ErrorObjectType> = {
  ...BOND_ERROR_MESSAGES,
  ...ERC20_ERROR_MESSAGES,
  ...ERC1155_ERROR_MESSAGES,
  ...LOCKER_ERROR_MESSAGES,
  ...MERKLE_ERROR_MESSAGES,
  ...ZAP_ERROR_MESSAGES,
};
