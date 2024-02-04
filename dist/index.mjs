import * as chains from 'viem/chains';
import { mainnet, optimism, arbitrum, avalanche, base, polygon, bsc, sepolia } from 'viem/chains';
import { isAddress, parseUnits, http, createPublicClient, fallback, createWalletClient, custom } from 'viem';
import { cloneDeep } from 'lodash-es';
import { privateKeyToAccount } from 'viem/accounts';

const BOND_ABI = [
  {
    inputs: [
      { internalType: "address", name: "tokenImplementation", type: "address" },
      {
        internalType: "address",
        name: "multiTokenImplementation",
        type: "address"
      },
      {
        internalType: "address",
        name: "protocolBeneficiary_",
        type: "address"
      },
      { internalType: "uint256", name: "creationFee_", type: "uint256" },
      { internalType: "uint256", name: "maxSteps", type: "uint256" }
    ],
    stateMutability: "nonpayable",
    type: "constructor"
  },
  {
    inputs: [{ internalType: "address", name: "target", type: "address" }],
    name: "AddressEmptyCode",
    type: "error"
  },
  {
    inputs: [{ internalType: "address", name: "account", type: "address" }],
    name: "AddressInsufficientBalance",
    type: "error"
  },
  { inputs: [], name: "ERC1167FailedCreateClone", type: "error" },
  { inputs: [], name: "FailedInnerCall", type: "error" },
  { inputs: [], name: "MCV2_BOND__InvalidPaginationParameters", type: "error" },
  {
    inputs: [],
    name: "MCV2_Bond__CreationFeeTransactionFailed",
    type: "error"
  },
  { inputs: [], name: "MCV2_Bond__ExceedMaxSupply", type: "error" },
  { inputs: [], name: "MCV2_Bond__ExceedTotalSupply", type: "error" },
  {
    inputs: [{ internalType: "string", name: "reason", type: "string" }],
    name: "MCV2_Bond__InvalidConstructorParams",
    type: "error"
  },
  { inputs: [], name: "MCV2_Bond__InvalidCreationFee", type: "error" },
  { inputs: [], name: "MCV2_Bond__InvalidCreatorAddress", type: "error" },
  { inputs: [], name: "MCV2_Bond__InvalidCurrentSupply", type: "error" },
  { inputs: [], name: "MCV2_Bond__InvalidReceiver", type: "error" },
  {
    inputs: [{ internalType: "string", name: "reason", type: "string" }],
    name: "MCV2_Bond__InvalidReserveToken",
    type: "error"
  },
  {
    inputs: [{ internalType: "string", name: "reason", type: "string" }],
    name: "MCV2_Bond__InvalidStepParams",
    type: "error"
  },
  { inputs: [], name: "MCV2_Bond__InvalidTokenAmount", type: "error" },
  {
    inputs: [{ internalType: "string", name: "reason", type: "string" }],
    name: "MCV2_Bond__InvalidTokenCreationParams",
    type: "error"
  },
  { inputs: [], name: "MCV2_Bond__PermissionDenied", type: "error" },
  { inputs: [], name: "MCV2_Bond__SlippageLimitExceeded", type: "error" },
  { inputs: [], name: "MCV2_Bond__TokenNotFound", type: "error" },
  { inputs: [], name: "MCV2_Bond__TokenSymbolAlreadyExists", type: "error" },
  { inputs: [], name: "MCV2_Royalty__InvalidParams", type: "error" },
  { inputs: [], name: "MCV2_Royalty__NothingToClaim", type: "error" },
  {
    inputs: [{ internalType: "address", name: "owner", type: "address" }],
    name: "OwnableInvalidOwner",
    type: "error"
  },
  {
    inputs: [{ internalType: "address", name: "account", type: "address" }],
    name: "OwnableUnauthorizedAccount",
    type: "error"
  },
  {
    inputs: [
      { internalType: "uint8", name: "bits", type: "uint8" },
      { internalType: "uint256", name: "value", type: "uint256" }
    ],
    name: "SafeCastOverflowedUintDowncast",
    type: "error"
  },
  {
    inputs: [{ internalType: "address", name: "token", type: "address" }],
    name: "SafeERC20FailedOperation",
    type: "error"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "token",
        type: "address"
      },
      {
        indexed: true,
        internalType: "address",
        name: "creator",
        type: "address"
      }
    ],
    name: "BondCreatorUpdated",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "token",
        type: "address"
      },
      { indexed: true, internalType: "address", name: "user", type: "address" },
      {
        indexed: false,
        internalType: "address",
        name: "receiver",
        type: "address"
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amountBurned",
        type: "uint256"
      },
      {
        indexed: true,
        internalType: "address",
        name: "reserveToken",
        type: "address"
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "refundAmount",
        type: "uint256"
      }
    ],
    name: "Burn",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256"
      }
    ],
    name: "CreationFeeUpdated",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "token",
        type: "address"
      },
      { indexed: true, internalType: "address", name: "user", type: "address" },
      {
        indexed: false,
        internalType: "address",
        name: "receiver",
        type: "address"
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amountMinted",
        type: "uint256"
      },
      {
        indexed: true,
        internalType: "address",
        name: "reserveToken",
        type: "address"
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "reserveAmount",
        type: "uint256"
      }
    ],
    name: "Mint",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "token",
        type: "address"
      },
      { indexed: false, internalType: "string", name: "name", type: "string" },
      {
        indexed: false,
        internalType: "string",
        name: "symbol",
        type: "string"
      },
      { indexed: false, internalType: "string", name: "uri", type: "string" },
      {
        indexed: true,
        internalType: "address",
        name: "reserveToken",
        type: "address"
      }
    ],
    name: "MultiTokenCreated",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address"
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address"
      }
    ],
    name: "OwnershipTransferred",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "protocolBeneficiary",
        type: "address"
      }
    ],
    name: "ProtocolBeneficiaryUpdated",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "user", type: "address" },
      {
        indexed: false,
        internalType: "address",
        name: "reserveToken",
        type: "address"
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256"
      }
    ],
    name: "RoyaltyClaimed",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "ratio",
        type: "uint256"
      }
    ],
    name: "RoyaltyRangeUpdated",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "token",
        type: "address"
      },
      { indexed: false, internalType: "string", name: "name", type: "string" },
      {
        indexed: false,
        internalType: "string",
        name: "symbol",
        type: "string"
      },
      {
        indexed: true,
        internalType: "address",
        name: "reserveToken",
        type: "address"
      }
    ],
    name: "TokenCreated",
    type: "event"
  },
  {
    inputs: [],
    name: "BURN_ADDRESS",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      { internalType: "address", name: "token", type: "address" },
      { internalType: "uint256", name: "tokensToBurn", type: "uint256" },
      { internalType: "uint256", name: "minRefund", type: "uint256" },
      { internalType: "address", name: "receiver", type: "address" }
    ],
    name: "burn",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [{ internalType: "address", name: "reserveToken", type: "address" }],
    name: "burnRoyalties",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [{ internalType: "address", name: "reserveToken", type: "address" }],
    name: "claimRoyalties",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        components: [
          { internalType: "string", name: "name", type: "string" },
          { internalType: "string", name: "symbol", type: "string" },
          { internalType: "string", name: "uri", type: "string" }
        ],
        internalType: "struct MCV2_Bond.MultiTokenParams",
        name: "tp",
        type: "tuple"
      },
      {
        components: [
          { internalType: "uint16", name: "mintRoyalty", type: "uint16" },
          { internalType: "uint16", name: "burnRoyalty", type: "uint16" },
          { internalType: "address", name: "reserveToken", type: "address" },
          { internalType: "uint128", name: "maxSupply", type: "uint128" },
          { internalType: "uint128[]", name: "stepRanges", type: "uint128[]" },
          { internalType: "uint128[]", name: "stepPrices", type: "uint128[]" }
        ],
        internalType: "struct MCV2_Bond.BondParams",
        name: "bp",
        type: "tuple"
      }
    ],
    name: "createMultiToken",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "payable",
    type: "function"
  },
  {
    inputs: [
      {
        components: [
          { internalType: "string", name: "name", type: "string" },
          { internalType: "string", name: "symbol", type: "string" }
        ],
        internalType: "struct MCV2_Bond.TokenParams",
        name: "tp",
        type: "tuple"
      },
      {
        components: [
          { internalType: "uint16", name: "mintRoyalty", type: "uint16" },
          { internalType: "uint16", name: "burnRoyalty", type: "uint16" },
          { internalType: "address", name: "reserveToken", type: "address" },
          { internalType: "uint128", name: "maxSupply", type: "uint128" },
          { internalType: "uint128[]", name: "stepRanges", type: "uint128[]" },
          { internalType: "uint128[]", name: "stepPrices", type: "uint128[]" }
        ],
        internalType: "struct MCV2_Bond.BondParams",
        name: "bp",
        type: "tuple"
      }
    ],
    name: "createToken",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "payable",
    type: "function"
  },
  {
    inputs: [],
    name: "creationFee",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [{ internalType: "address", name: "token", type: "address" }],
    name: "exists",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [{ internalType: "address", name: "token", type: "address" }],
    name: "getDetail",
    outputs: [
      {
        components: [
          { internalType: "uint16", name: "mintRoyalty", type: "uint16" },
          { internalType: "uint16", name: "burnRoyalty", type: "uint16" },
          {
            components: [
              { internalType: "address", name: "creator", type: "address" },
              { internalType: "address", name: "token", type: "address" },
              { internalType: "uint8", name: "decimals", type: "uint8" },
              { internalType: "string", name: "symbol", type: "string" },
              { internalType: "string", name: "name", type: "string" },
              { internalType: "uint40", name: "createdAt", type: "uint40" },
              {
                internalType: "uint128",
                name: "currentSupply",
                type: "uint128"
              },
              { internalType: "uint128", name: "maxSupply", type: "uint128" },
              {
                internalType: "uint128",
                name: "priceForNextMint",
                type: "uint128"
              },
              {
                internalType: "address",
                name: "reserveToken",
                type: "address"
              },
              { internalType: "uint8", name: "reserveDecimals", type: "uint8" },
              { internalType: "string", name: "reserveSymbol", type: "string" },
              { internalType: "string", name: "reserveName", type: "string" },
              {
                internalType: "uint256",
                name: "reserveBalance",
                type: "uint256"
              }
            ],
            internalType: "struct MCV2_Bond.BondInfo",
            name: "info",
            type: "tuple"
          },
          {
            components: [
              { internalType: "uint128", name: "rangeTo", type: "uint128" },
              { internalType: "uint128", name: "price", type: "uint128" }
            ],
            internalType: "struct MCV2_Bond.BondStep[]",
            name: "steps",
            type: "tuple[]"
          }
        ],
        internalType: "struct MCV2_Bond.BondDetail",
        name: "detail",
        type: "tuple"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      { internalType: "uint256", name: "start", type: "uint256" },
      { internalType: "uint256", name: "stop", type: "uint256" }
    ],
    name: "getList",
    outputs: [
      {
        components: [
          { internalType: "address", name: "creator", type: "address" },
          { internalType: "address", name: "token", type: "address" },
          { internalType: "uint8", name: "decimals", type: "uint8" },
          { internalType: "string", name: "symbol", type: "string" },
          { internalType: "string", name: "name", type: "string" },
          { internalType: "uint40", name: "createdAt", type: "uint40" },
          { internalType: "uint128", name: "currentSupply", type: "uint128" },
          { internalType: "uint128", name: "maxSupply", type: "uint128" },
          {
            internalType: "uint128",
            name: "priceForNextMint",
            type: "uint128"
          },
          { internalType: "address", name: "reserveToken", type: "address" },
          { internalType: "uint8", name: "reserveDecimals", type: "uint8" },
          { internalType: "string", name: "reserveSymbol", type: "string" },
          { internalType: "string", name: "reserveName", type: "string" },
          { internalType: "uint256", name: "reserveBalance", type: "uint256" }
        ],
        internalType: "struct MCV2_Bond.BondInfo[]",
        name: "info",
        type: "tuple[]"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      { internalType: "address", name: "token", type: "address" },
      { internalType: "uint256", name: "tokensToBurn", type: "uint256" }
    ],
    name: "getRefundForTokens",
    outputs: [
      { internalType: "uint256", name: "refundAmount", type: "uint256" },
      { internalType: "uint256", name: "royalty", type: "uint256" }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      { internalType: "address", name: "token", type: "address" },
      { internalType: "uint256", name: "tokensToMint", type: "uint256" }
    ],
    name: "getReserveForToken",
    outputs: [
      { internalType: "uint256", name: "reserveAmount", type: "uint256" },
      { internalType: "uint256", name: "royalty", type: "uint256" }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      { internalType: "address", name: "wallet", type: "address" },
      { internalType: "address", name: "reserveToken", type: "address" }
    ],
    name: "getRoyaltyInfo",
    outputs: [
      { internalType: "uint256", name: "", type: "uint256" },
      { internalType: "uint256", name: "", type: "uint256" }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [{ internalType: "address", name: "token", type: "address" }],
    name: "getSteps",
    outputs: [
      {
        components: [
          { internalType: "uint128", name: "rangeTo", type: "uint128" },
          { internalType: "uint128", name: "price", type: "uint128" }
        ],
        internalType: "struct MCV2_Bond.BondStep[]",
        name: "",
        type: "tuple[]"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      { internalType: "address", name: "creator", type: "address" },
      { internalType: "uint256", name: "start", type: "uint256" },
      { internalType: "uint256", name: "stop", type: "uint256" }
    ],
    name: "getTokensByCreator",
    outputs: [{ internalType: "address[]", name: "addresses", type: "address[]" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      { internalType: "address", name: "reserveToken", type: "address" },
      { internalType: "uint256", name: "start", type: "uint256" },
      { internalType: "uint256", name: "stop", type: "uint256" }
    ],
    name: "getTokensByReserveToken",
    outputs: [{ internalType: "address[]", name: "addresses", type: "address[]" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "maxRoyaltyRange",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [{ internalType: "address", name: "token", type: "address" }],
    name: "maxSupply",
    outputs: [{ internalType: "uint128", name: "", type: "uint128" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      { internalType: "address", name: "token", type: "address" },
      { internalType: "uint256", name: "tokensToMint", type: "uint256" },
      { internalType: "uint256", name: "maxReserveAmount", type: "uint256" },
      { internalType: "address", name: "receiver", type: "address" }
    ],
    name: "mint",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [],
    name: "owner",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [{ internalType: "address", name: "token", type: "address" }],
    name: "priceForNextMint",
    outputs: [{ internalType: "uint128", name: "", type: "uint128" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "protocolBeneficiary",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [{ internalType: "address", name: "", type: "address" }],
    name: "tokenBond",
    outputs: [
      { internalType: "address", name: "creator", type: "address" },
      { internalType: "uint16", name: "mintRoyalty", type: "uint16" },
      { internalType: "uint16", name: "burnRoyalty", type: "uint16" },
      { internalType: "uint40", name: "createdAt", type: "uint40" },
      { internalType: "address", name: "reserveToken", type: "address" },
      { internalType: "uint256", name: "reserveBalance", type: "uint256" }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "tokenCount",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    name: "tokens",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [{ internalType: "address", name: "newOwner", type: "address" }],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      { internalType: "address", name: "token", type: "address" },
      { internalType: "address", name: "creator", type: "address" }
    ],
    name: "updateBondCreator",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [{ internalType: "uint256", name: "amount", type: "uint256" }],
    name: "updateCreationFee",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [{ internalType: "uint256", name: "ratio", type: "uint256" }],
    name: "updateMaxRoyaltyRange",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "protocolBeneficiary_",
        type: "address"
      }
    ],
    name: "updateProtocolBeneficiary",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      { internalType: "address", name: "", type: "address" },
      { internalType: "address", name: "", type: "address" }
    ],
    name: "userTokenRoyaltyBalance",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      { internalType: "address", name: "", type: "address" },
      { internalType: "address", name: "", type: "address" }
    ],
    name: "userTokenRoyaltyClaimed",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "version",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "pure",
    type: "function"
  }
];

const ERC1155_ABI = [
  {
    inputs: [
      { internalType: "address", name: "sender", type: "address" },
      { internalType: "uint256", name: "balance", type: "uint256" },
      { internalType: "uint256", name: "needed", type: "uint256" },
      { internalType: "uint256", name: "tokenId", type: "uint256" }
    ],
    name: "ERC1155InsufficientBalance",
    type: "error"
  },
  {
    inputs: [{ internalType: "address", name: "approver", type: "address" }],
    name: "ERC1155InvalidApprover",
    type: "error"
  },
  {
    inputs: [
      { internalType: "uint256", name: "idsLength", type: "uint256" },
      { internalType: "uint256", name: "valuesLength", type: "uint256" }
    ],
    name: "ERC1155InvalidArrayLength",
    type: "error"
  },
  {
    inputs: [{ internalType: "address", name: "operator", type: "address" }],
    name: "ERC1155InvalidOperator",
    type: "error"
  },
  {
    inputs: [{ internalType: "address", name: "receiver", type: "address" }],
    name: "ERC1155InvalidReceiver",
    type: "error"
  },
  {
    inputs: [{ internalType: "address", name: "sender", type: "address" }],
    name: "ERC1155InvalidSender",
    type: "error"
  },
  {
    inputs: [
      { internalType: "address", name: "operator", type: "address" },
      { internalType: "address", name: "owner", type: "address" }
    ],
    name: "ERC1155MissingApprovalForAll",
    type: "error"
  },
  { inputs: [], name: "MCV2_MultiToken__AlreadyInitialized", type: "error" },
  {
    inputs: [],
    name: "MCV2_MultiToken__BurnAmountExceedsTotalSupply",
    type: "error"
  },
  { inputs: [], name: "MCV2_MultiToken__NotApproved", type: "error" },
  { inputs: [], name: "MCV2_MultiToken__PermissionDenied", type: "error" },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "account",
        type: "address"
      },
      {
        indexed: true,
        internalType: "address",
        name: "operator",
        type: "address"
      },
      { indexed: false, internalType: "bool", name: "approved", type: "bool" }
    ],
    name: "ApprovalForAll",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "operator",
        type: "address"
      },
      { indexed: true, internalType: "address", name: "from", type: "address" },
      { indexed: true, internalType: "address", name: "to", type: "address" },
      {
        indexed: false,
        internalType: "uint256[]",
        name: "ids",
        type: "uint256[]"
      },
      {
        indexed: false,
        internalType: "uint256[]",
        name: "values",
        type: "uint256[]"
      }
    ],
    name: "TransferBatch",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "operator",
        type: "address"
      },
      { indexed: true, internalType: "address", name: "from", type: "address" },
      { indexed: true, internalType: "address", name: "to", type: "address" },
      { indexed: false, internalType: "uint256", name: "id", type: "uint256" },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256"
      }
    ],
    name: "TransferSingle",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      { indexed: false, internalType: "string", name: "value", type: "string" },
      { indexed: true, internalType: "uint256", name: "id", type: "uint256" }
    ],
    name: "URI",
    type: "event"
  },
  {
    inputs: [
      { internalType: "address", name: "account", type: "address" },
      { internalType: "uint256", name: "id", type: "uint256" }
    ],
    name: "balanceOf",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      { internalType: "address[]", name: "accounts", type: "address[]" },
      { internalType: "uint256[]", name: "ids", type: "uint256[]" }
    ],
    name: "balanceOfBatch",
    outputs: [{ internalType: "uint256[]", name: "", type: "uint256[]" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "bond",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      { internalType: "address", name: "account", type: "address" },
      { internalType: "uint256", name: "amount", type: "uint256" }
    ],
    name: "burnByBond",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [],
    name: "contractURI",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "decimals",
    outputs: [{ internalType: "uint8", name: "", type: "uint8" }],
    stateMutability: "pure",
    type: "function"
  },
  {
    inputs: [
      { internalType: "string", name: "name_", type: "string" },
      { internalType: "string", name: "symbol_", type: "string" },
      { internalType: "string", name: "uri_", type: "string" }
    ],
    name: "init",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      { internalType: "address", name: "account", type: "address" },
      { internalType: "address", name: "operator", type: "address" }
    ],
    name: "isApprovedForAll",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      { internalType: "address", name: "to", type: "address" },
      { internalType: "uint256", name: "amount", type: "uint256" }
    ],
    name: "mintByBond",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [],
    name: "name",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      { internalType: "address", name: "from", type: "address" },
      { internalType: "address", name: "to", type: "address" },
      { internalType: "uint256[]", name: "ids", type: "uint256[]" },
      { internalType: "uint256[]", name: "values", type: "uint256[]" },
      { internalType: "bytes", name: "data", type: "bytes" }
    ],
    name: "safeBatchTransferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      { internalType: "address", name: "from", type: "address" },
      { internalType: "address", name: "to", type: "address" },
      { internalType: "uint256", name: "id", type: "uint256" },
      { internalType: "uint256", name: "value", type: "uint256" },
      { internalType: "bytes", name: "data", type: "bytes" }
    ],
    name: "safeTransferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      { internalType: "address", name: "operator", type: "address" },
      { internalType: "bool", name: "approved", type: "bool" }
    ],
    name: "setApprovalForAll",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [{ internalType: "bytes4", name: "interfaceId", type: "bytes4" }],
    name: "supportsInterface",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "symbol",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "totalSupply",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    name: "uri",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function"
  }
];

const ERC20_ABI = [
  {
    inputs: [
      { internalType: "address", name: "spender", type: "address" },
      { internalType: "uint256", name: "allowance", type: "uint256" },
      { internalType: "uint256", name: "needed", type: "uint256" }
    ],
    name: "ERC20InsufficientAllowance",
    type: "error"
  },
  {
    inputs: [
      { internalType: "address", name: "sender", type: "address" },
      { internalType: "uint256", name: "balance", type: "uint256" },
      { internalType: "uint256", name: "needed", type: "uint256" }
    ],
    name: "ERC20InsufficientBalance",
    type: "error"
  },
  {
    inputs: [{ internalType: "address", name: "approver", type: "address" }],
    name: "ERC20InvalidApprover",
    type: "error"
  },
  {
    inputs: [{ internalType: "address", name: "receiver", type: "address" }],
    name: "ERC20InvalidReceiver",
    type: "error"
  },
  {
    inputs: [{ internalType: "address", name: "sender", type: "address" }],
    name: "ERC20InvalidSender",
    type: "error"
  },
  {
    inputs: [{ internalType: "address", name: "spender", type: "address" }],
    name: "ERC20InvalidSpender",
    type: "error"
  },
  { inputs: [], name: "MCV2_Token__AlreadyInitialized", type: "error" },
  { inputs: [], name: "MCV2_Token__PermissionDenied", type: "error" },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address"
      },
      {
        indexed: true,
        internalType: "address",
        name: "spender",
        type: "address"
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256"
      }
    ],
    name: "Approval",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "from", type: "address" },
      { indexed: true, internalType: "address", name: "to", type: "address" },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256"
      }
    ],
    name: "Transfer",
    type: "event"
  },
  {
    inputs: [
      { internalType: "address", name: "owner", type: "address" },
      { internalType: "address", name: "spender", type: "address" }
    ],
    name: "allowance",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      { internalType: "address", name: "spender", type: "address" },
      { internalType: "uint256", name: "value", type: "uint256" }
    ],
    name: "approve",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [{ internalType: "address", name: "account", type: "address" }],
    name: "balanceOf",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "bond",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      { internalType: "address", name: "account", type: "address" },
      { internalType: "uint256", name: "amount", type: "uint256" }
    ],
    name: "burnByBond",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [],
    name: "decimals",
    outputs: [{ internalType: "uint8", name: "", type: "uint8" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      { internalType: "string", name: "name_", type: "string" },
      { internalType: "string", name: "symbol_", type: "string" }
    ],
    name: "init",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      { internalType: "address", name: "to", type: "address" },
      { internalType: "uint256", name: "amount", type: "uint256" }
    ],
    name: "mintByBond",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [],
    name: "name",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "symbol",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "totalSupply",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      { internalType: "address", name: "to", type: "address" },
      { internalType: "uint256", name: "value", type: "uint256" }
    ],
    name: "transfer",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      { internalType: "address", name: "from", type: "address" },
      { internalType: "address", name: "to", type: "address" },
      { internalType: "uint256", name: "value", type: "uint256" }
    ],
    name: "transferFrom",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function"
  }
];

const LOCKER_ABI = [
  {
    inputs: [{ internalType: "address", name: "target", type: "address" }],
    name: "AddressEmptyCode",
    type: "error"
  },
  {
    inputs: [{ internalType: "address", name: "account", type: "address" }],
    name: "AddressInsufficientBalance",
    type: "error"
  },
  { inputs: [], name: "FailedInnerCall", type: "error" },
  { inputs: [], name: "LockUp__AlreadyClaimed", type: "error" },
  { inputs: [], name: "LockUp__InvalidPaginationParameters", type: "error" },
  {
    inputs: [{ internalType: "string", name: "param", type: "string" }],
    name: "LockUp__InvalidParams",
    type: "error"
  },
  { inputs: [], name: "LockUp__NotYetUnlocked", type: "error" },
  { inputs: [], name: "LockUp__PermissionDenied", type: "error" },
  {
    inputs: [{ internalType: "address", name: "token", type: "address" }],
    name: "SafeERC20FailedOperation",
    type: "error"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "lockUpId",
        type: "uint256"
      },
      {
        indexed: true,
        internalType: "address",
        name: "token",
        type: "address"
      },
      { indexed: false, internalType: "bool", name: "isERC20", type: "bool" },
      {
        indexed: true,
        internalType: "address",
        name: "receiver",
        type: "address"
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256"
      },
      {
        indexed: false,
        internalType: "uint40",
        name: "unlockTime",
        type: "uint40"
      }
    ],
    name: "LockedUp",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "lockUpId",
        type: "uint256"
      },
      {
        indexed: true,
        internalType: "address",
        name: "token",
        type: "address"
      },
      { indexed: false, internalType: "bool", name: "isERC20", type: "bool" },
      {
        indexed: true,
        internalType: "address",
        name: "receiver",
        type: "address"
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256"
      }
    ],
    name: "Unlocked",
    type: "event"
  },
  {
    inputs: [
      { internalType: "address", name: "token", type: "address" },
      { internalType: "bool", name: "isERC20", type: "bool" },
      { internalType: "uint256", name: "amount", type: "uint256" },
      { internalType: "uint40", name: "unlockTime", type: "uint40" },
      { internalType: "address", name: "receiver", type: "address" },
      { internalType: "string", name: "title", type: "string" }
    ],
    name: "createLockUp",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      { internalType: "address", name: "receiver", type: "address" },
      { internalType: "uint256", name: "start", type: "uint256" },
      { internalType: "uint256", name: "stop", type: "uint256" }
    ],
    name: "getLockUpIdsByReceiver",
    outputs: [{ internalType: "uint256[]", name: "ids", type: "uint256[]" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      { internalType: "address", name: "token", type: "address" },
      { internalType: "uint256", name: "start", type: "uint256" },
      { internalType: "uint256", name: "stop", type: "uint256" }
    ],
    name: "getLockUpIdsByToken",
    outputs: [{ internalType: "uint256[]", name: "ids", type: "uint256[]" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "lockUpCount",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    name: "lockUps",
    outputs: [
      { internalType: "address", name: "token", type: "address" },
      { internalType: "bool", name: "isERC20", type: "bool" },
      { internalType: "uint40", name: "unlockTime", type: "uint40" },
      { internalType: "bool", name: "unlocked", type: "bool" },
      { internalType: "uint256", name: "amount", type: "uint256" },
      { internalType: "address", name: "receiver", type: "address" },
      { internalType: "string", name: "title", type: "string" }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      { internalType: "address", name: "", type: "address" },
      { internalType: "address", name: "", type: "address" },
      { internalType: "uint256", name: "", type: "uint256" },
      { internalType: "uint256", name: "", type: "uint256" },
      { internalType: "bytes", name: "", type: "bytes" }
    ],
    name: "onERC1155Received",
    outputs: [{ internalType: "bytes4", name: "", type: "bytes4" }],
    stateMutability: "pure",
    type: "function"
  },
  {
    inputs: [{ internalType: "uint256", name: "lockUpId", type: "uint256" }],
    name: "unlock",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  }
];

const MERKLE_ABI = [
  {
    inputs: [{ internalType: "address", name: "target", type: "address" }],
    name: "AddressEmptyCode",
    type: "error"
  },
  {
    inputs: [{ internalType: "address", name: "account", type: "address" }],
    name: "AddressInsufficientBalance",
    type: "error"
  },
  { inputs: [], name: "FailedInnerCall", type: "error" },
  { inputs: [], name: "MerkleDistributor__AlreadyClaimed", type: "error" },
  { inputs: [], name: "MerkleDistributor__AlreadyRefunded", type: "error" },
  { inputs: [], name: "MerkleDistributor__Finished", type: "error" },
  { inputs: [], name: "MerkleDistributor__InvalidCaller", type: "error" },
  {
    inputs: [],
    name: "MerkleDistributor__InvalidPaginationParameters",
    type: "error"
  },
  {
    inputs: [{ internalType: "string", name: "param", type: "string" }],
    name: "MerkleDistributor__InvalidParams",
    type: "error"
  },
  { inputs: [], name: "MerkleDistributor__InvalidProof", type: "error" },
  {
    inputs: [],
    name: "MerkleDistributor__NoClaimableTokensLeft",
    type: "error"
  },
  { inputs: [], name: "MerkleDistributor__NotStarted", type: "error" },
  { inputs: [], name: "MerkleDistributor__NothingToRefund", type: "error" },
  { inputs: [], name: "MerkleDistributor__PermissionDenied", type: "error" },
  { inputs: [], name: "MerkleDistributor__Refunded", type: "error" },
  {
    inputs: [{ internalType: "address", name: "token", type: "address" }],
    name: "SafeERC20FailedOperation",
    type: "error"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "distributionId",
        type: "uint256"
      },
      {
        indexed: false,
        internalType: "address",
        name: "account",
        type: "address"
      }
    ],
    name: "Claimed",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "distributionId",
        type: "uint256"
      },
      {
        indexed: true,
        internalType: "address",
        name: "token",
        type: "address"
      },
      { indexed: false, internalType: "bool", name: "isERC20", type: "bool" },
      {
        indexed: false,
        internalType: "uint40",
        name: "startTime",
        type: "uint40"
      }
    ],
    name: "Created",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "distributionId",
        type: "uint256"
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256"
      }
    ],
    name: "Refunded",
    type: "event"
  },
  {
    inputs: [
      { internalType: "uint256", name: "distributionId", type: "uint256" },
      { internalType: "bytes32[]", name: "merkleProof", type: "bytes32[]" }
    ],
    name: "claim",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      { internalType: "address", name: "token", type: "address" },
      { internalType: "bool", name: "isERC20", type: "bool" },
      { internalType: "uint176", name: "amountPerClaim", type: "uint176" },
      { internalType: "uint40", name: "walletCount", type: "uint40" },
      { internalType: "uint40", name: "startTime", type: "uint40" },
      { internalType: "uint40", name: "endTime", type: "uint40" },
      { internalType: "bytes32", name: "merkleRoot", type: "bytes32" },
      { internalType: "string", name: "title", type: "string" },
      { internalType: "string", name: "ipfsCID", type: "string" }
    ],
    name: "createDistribution",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [],
    name: "distributionCount",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    name: "distributions",
    outputs: [
      { internalType: "address", name: "token", type: "address" },
      { internalType: "bool", name: "isERC20", type: "bool" },
      { internalType: "uint40", name: "walletCount", type: "uint40" },
      { internalType: "uint40", name: "claimedCount", type: "uint40" },
      { internalType: "uint176", name: "amountPerClaim", type: "uint176" },
      { internalType: "uint40", name: "startTime", type: "uint40" },
      { internalType: "uint40", name: "endTime", type: "uint40" },
      { internalType: "address", name: "owner", type: "address" },
      { internalType: "uint40", name: "refundedAt", type: "uint40" },
      { internalType: "bytes32", name: "merkleRoot", type: "bytes32" },
      { internalType: "string", name: "title", type: "string" },
      { internalType: "string", name: "ipfsCID", type: "string" }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [{ internalType: "uint256", name: "distributionId", type: "uint256" }],
    name: "getAmountClaimed",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [{ internalType: "uint256", name: "distributionId", type: "uint256" }],
    name: "getAmountLeft",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      { internalType: "address", name: "owner", type: "address" },
      { internalType: "uint256", name: "start", type: "uint256" },
      { internalType: "uint256", name: "stop", type: "uint256" }
    ],
    name: "getDistributionIdsByOwner",
    outputs: [{ internalType: "uint256[]", name: "ids", type: "uint256[]" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      { internalType: "address", name: "token", type: "address" },
      { internalType: "uint256", name: "start", type: "uint256" },
      { internalType: "uint256", name: "stop", type: "uint256" }
    ],
    name: "getDistributionIdsByToken",
    outputs: [{ internalType: "uint256[]", name: "ids", type: "uint256[]" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      { internalType: "uint256", name: "distributionId", type: "uint256" },
      { internalType: "address", name: "wallet", type: "address" }
    ],
    name: "isClaimed",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [{ internalType: "uint256", name: "distributionId", type: "uint256" }],
    name: "isWhitelistOnly",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      { internalType: "uint256", name: "distributionId", type: "uint256" },
      { internalType: "address", name: "wallet", type: "address" },
      { internalType: "bytes32[]", name: "merkleProof", type: "bytes32[]" }
    ],
    name: "isWhitelisted",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      { internalType: "address", name: "", type: "address" },
      { internalType: "address", name: "", type: "address" },
      { internalType: "uint256", name: "", type: "uint256" },
      { internalType: "uint256", name: "", type: "uint256" },
      { internalType: "bytes", name: "", type: "bytes" }
    ],
    name: "onERC1155Received",
    outputs: [{ internalType: "bytes4", name: "", type: "bytes4" }],
    stateMutability: "pure",
    type: "function"
  },
  {
    inputs: [{ internalType: "uint256", name: "distributionId", type: "uint256" }],
    name: "refund",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  }
];

const ONEINCH_ABI = [
  {
    inputs: [
      {
        internalType: "contract MultiWrapper",
        name: "_multiWrapper",
        type: "address"
      },
      {
        internalType: "contract IOracle[]",
        name: "existingOracles",
        type: "address[]"
      },
      {
        internalType: "enum OffchainOracle.OracleType[]",
        name: "oracleTypes",
        type: "uint8[]"
      },
      {
        internalType: "contract IERC20[]",
        name: "existingConnectors",
        type: "address[]"
      },
      { internalType: "contract IERC20", name: "wBase", type: "address" },
      { internalType: "address", name: "owner", type: "address" }
    ],
    stateMutability: "nonpayable",
    type: "constructor"
  },
  { inputs: [], name: "ArraysLengthMismatch", type: "error" },
  { inputs: [], name: "ConnectorAlreadyAdded", type: "error" },
  { inputs: [], name: "InvalidOracleTokenKind", type: "error" },
  { inputs: [], name: "OracleAlreadyAdded", type: "error" },
  { inputs: [], name: "SameTokens", type: "error" },
  { inputs: [], name: "TooBigThreshold", type: "error" },
  { inputs: [], name: "UnknownConnector", type: "error" },
  { inputs: [], name: "UnknownOracle", type: "error" },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "contract IERC20",
        name: "connector",
        type: "address"
      }
    ],
    name: "ConnectorAdded",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "contract IERC20",
        name: "connector",
        type: "address"
      }
    ],
    name: "ConnectorRemoved",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "contract MultiWrapper",
        name: "multiWrapper",
        type: "address"
      }
    ],
    name: "MultiWrapperUpdated",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "contract IOracle",
        name: "oracle",
        type: "address"
      },
      {
        indexed: false,
        internalType: "enum OffchainOracle.OracleType",
        name: "oracleType",
        type: "uint8"
      }
    ],
    name: "OracleAdded",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "contract IOracle",
        name: "oracle",
        type: "address"
      },
      {
        indexed: false,
        internalType: "enum OffchainOracle.OracleType",
        name: "oracleType",
        type: "uint8"
      }
    ],
    name: "OracleRemoved",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address"
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address"
      }
    ],
    name: "OwnershipTransferred",
    type: "event"
  },
  {
    inputs: [{ internalType: "contract IERC20", name: "connector", type: "address" }],
    name: "addConnector",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      { internalType: "contract IOracle", name: "oracle", type: "address" },
      {
        internalType: "enum OffchainOracle.OracleType",
        name: "oracleKind",
        type: "uint8"
      }
    ],
    name: "addOracle",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [],
    name: "connectors",
    outputs: [
      {
        internalType: "contract IERC20[]",
        name: "allConnectors",
        type: "address[]"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      { internalType: "contract IERC20", name: "srcToken", type: "address" },
      { internalType: "contract IERC20", name: "dstToken", type: "address" },
      { internalType: "bool", name: "useWrappers", type: "bool" }
    ],
    name: "getRate",
    outputs: [{ internalType: "uint256", name: "weightedRate", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      { internalType: "contract IERC20", name: "srcToken", type: "address" },
      { internalType: "bool", name: "useSrcWrappers", type: "bool" }
    ],
    name: "getRateToEth",
    outputs: [{ internalType: "uint256", name: "weightedRate", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      { internalType: "contract IERC20", name: "srcToken", type: "address" },
      { internalType: "bool", name: "useSrcWrappers", type: "bool" },
      {
        internalType: "contract IERC20[]",
        name: "customConnectors",
        type: "address[]"
      },
      { internalType: "uint256", name: "thresholdFilter", type: "uint256" }
    ],
    name: "getRateToEthWithCustomConnectors",
    outputs: [{ internalType: "uint256", name: "weightedRate", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      { internalType: "contract IERC20", name: "srcToken", type: "address" },
      { internalType: "bool", name: "useSrcWrappers", type: "bool" },
      { internalType: "uint256", name: "thresholdFilter", type: "uint256" }
    ],
    name: "getRateToEthWithThreshold",
    outputs: [{ internalType: "uint256", name: "weightedRate", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      { internalType: "contract IERC20", name: "srcToken", type: "address" },
      { internalType: "contract IERC20", name: "dstToken", type: "address" },
      { internalType: "bool", name: "useWrappers", type: "bool" },
      {
        internalType: "contract IERC20[]",
        name: "customConnectors",
        type: "address[]"
      },
      { internalType: "uint256", name: "thresholdFilter", type: "uint256" }
    ],
    name: "getRateWithCustomConnectors",
    outputs: [{ internalType: "uint256", name: "weightedRate", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      { internalType: "contract IERC20", name: "srcToken", type: "address" },
      { internalType: "contract IERC20", name: "dstToken", type: "address" },
      { internalType: "bool", name: "useWrappers", type: "bool" },
      { internalType: "uint256", name: "thresholdFilter", type: "uint256" }
    ],
    name: "getRateWithThreshold",
    outputs: [{ internalType: "uint256", name: "weightedRate", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "multiWrapper",
    outputs: [{ internalType: "contract MultiWrapper", name: "", type: "address" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "oracles",
    outputs: [
      {
        internalType: "contract IOracle[]",
        name: "allOracles",
        type: "address[]"
      },
      {
        internalType: "enum OffchainOracle.OracleType[]",
        name: "oracleTypes",
        type: "uint8[]"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "owner",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [{ internalType: "contract IERC20", name: "connector", type: "address" }],
    name: "removeConnector",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      { internalType: "contract IOracle", name: "oracle", type: "address" },
      {
        internalType: "enum OffchainOracle.OracleType",
        name: "oracleKind",
        type: "uint8"
      }
    ],
    name: "removeOracle",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "contract MultiWrapper",
        name: "_multiWrapper",
        type: "address"
      }
    ],
    name: "setMultiWrapper",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [{ internalType: "address", name: "newOwner", type: "address" }],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  }
];

const ZAP_ABI = [
  {
    inputs: [
      { internalType: "address", name: "bondAddress", type: "address" },
      { internalType: "address", name: "wethAddress", type: "address" }
    ],
    stateMutability: "nonpayable",
    type: "constructor"
  },
  {
    inputs: [{ internalType: "address", name: "target", type: "address" }],
    name: "AddressEmptyCode",
    type: "error"
  },
  {
    inputs: [{ internalType: "address", name: "account", type: "address" }],
    name: "AddressInsufficientBalance",
    type: "error"
  },
  { inputs: [], name: "FailedInnerCall", type: "error" },
  { inputs: [], name: "MCV2_ZapV1__EthTransferFailed", type: "error" },
  { inputs: [], name: "MCV2_ZapV1__InvalidReceiver", type: "error" },
  { inputs: [], name: "MCV2_ZapV1__ReserveIsNotWETH", type: "error" },
  { inputs: [], name: "MCV2_ZapV1__SlippageLimitExceeded", type: "error" },
  {
    inputs: [{ internalType: "address", name: "owner", type: "address" }],
    name: "OwnableInvalidOwner",
    type: "error"
  },
  {
    inputs: [{ internalType: "address", name: "account", type: "address" }],
    name: "OwnableUnauthorizedAccount",
    type: "error"
  },
  {
    inputs: [{ internalType: "address", name: "token", type: "address" }],
    name: "SafeERC20FailedOperation",
    type: "error"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address"
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address"
      }
    ],
    name: "OwnershipTransferred",
    type: "event"
  },
  {
    inputs: [],
    name: "BOND",
    outputs: [{ internalType: "contract MCV2_Bond", name: "", type: "address" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "WETH",
    outputs: [{ internalType: "contract IWETH", name: "", type: "address" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      { internalType: "address", name: "token", type: "address" },
      { internalType: "uint256", name: "tokensToBurn", type: "uint256" },
      { internalType: "uint256", name: "minRefund", type: "uint256" },
      { internalType: "address", name: "receiver", type: "address" }
    ],
    name: "burnToEth",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      { internalType: "address", name: "token", type: "address" },
      { internalType: "uint256", name: "tokensToMint", type: "uint256" },
      { internalType: "address", name: "receiver", type: "address" }
    ],
    name: "mintWithEth",
    outputs: [],
    stateMutability: "payable",
    type: "function"
  },
  {
    inputs: [],
    name: "owner",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [{ internalType: "address", name: "receiver", type: "address" }],
    name: "rescueETH",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [{ internalType: "address", name: "newOwner", type: "address" }],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  { stateMutability: "payable", type: "receive" }
];

const BOND_ERROR_MESSAGES = {
  AddressEmptyCode: {
    message: "The address field cannot be empty. Please provide a valid address.",
    reportToBugsnag: true
  },
  AddressInsufficientBalance: {
    message: "The address does not have enough balance to proceed with the transaction.",
    reportToBugsnag: false
  },
  ERC1167FailedCreateClone: {
    message: "Failed to create a clone due to an ERC1167 cloning error. Please check the implementation.",
    reportToBugsnag: true
  },
  FailedInnerCall: {
    message: "An internal call within the contract failed, indicating a potential issue with contract logic or state.",
    reportToBugsnag: true
  },
  MCV2_Bond__CreationFeeTransactionFailed: {
    message: "The transaction for the creation fee has failed. Ensure you have enough funds and the fee is correctly set.",
    reportToBugsnag: true
  },
  MCV2_Bond__ExceedMaxSupply: {
    message: "The creation of this token would exceed its maximum supply limit. No further tokens can be created.",
    reportToBugsnag: false
  },
  MCV2_Bond__ExceedTotalSupply: {
    message: "Attempting to exceed the total supply of tokens. Please verify the token amount.",
    reportToBugsnag: false
  },
  MCV2_Bond__InvalidConstructorParams: {
    message: "The constructor parameters provided are invalid. Please check and try again.",
    reportToBugsnag: true
  },
  MCV2_Bond__InvalidCreationFee: {
    message: "The creation fee provided is invalid. Ensure the fee meets the required criteria.",
    reportToBugsnag: true
  },
  MCV2_Bond__InvalidCreatorAddress: {
    message: "The creator address is invalid. A valid creator address is required to proceed.",
    reportToBugsnag: true
  },
  MCV2_Bond__InvalidCurrentSupply: {
    message: "The current supply value is invalid. Please check the supply amount and try again.",
    reportToBugsnag: true
  },
  MCV2_BOND__InvalidPaginationParameters: {
    message: "Pagination parameters are invalid. Please adjust your request and try again.",
    reportToBugsnag: false
  },
  MCV2_Bond__InvalidReceiver: {
    message: "The receiver address is invalid. Transactions require a valid receiver address.",
    reportToBugsnag: true
  },
  MCV2_Bond__InvalidReserveToken: {
    message: "The reserve token specified is invalid. Check the token address and try again.",
    reportToBugsnag: true
  },
  MCV2_Bond__InvalidStepParams: {
    message: "The step parameters provided are invalid. Please review and correct them.",
    reportToBugsnag: true
  },
  MCV2_Bond__InvalidTokenAmount: {
    message: "The token amount specified is invalid. Ensure the amount is correct and try again.",
    reportToBugsnag: true
  },
  MCV2_Bond__InvalidTokenCreationParams: {
    message: "The token creation parameters are invalid. Check the documentation and try again.",
    reportToBugsnag: true
  },
  MCV2_Bond__PermissionDenied: {
    message: "You do not have permission to perform this action. Ensure you have the necessary rights.",
    reportToBugsnag: true
  },
  MCV2_Bond__SlippageLimitExceeded: {
    message: "The slippage limit has been exceeded. Adjust your slippage settings and try again.",
    reportToBugsnag: false
  },
  MCV2_Bond__TokenNotFound: {
    message: "The specified token could not be found. Check the token address and try again.",
    reportToBugsnag: true
  },
  MCV2_Bond__TokenSymbolAlreadyExists: {
    message: "The token symbol already exists. Use a unique symbol and try again.",
    reportToBugsnag: true
  },
  MCV2_Royalty__InvalidParams: {
    message: "The parameters provided for royalty settings are invalid. Please review and correct them.",
    reportToBugsnag: true
  },
  MCV2_Royalty__NothingToClaim: {
    message: "There is nothing to claim at this time. Check back later or verify your entitlement.",
    reportToBugsnag: false
  },
  OwnableInvalidOwner: {
    message: "The operation was attempted by an invalid owner. Only the contract owner can perform this action.",
    reportToBugsnag: true
  },
  OwnableUnauthorizedAccount: {
    message: "The account is unauthorized. This action is restricted to authorized accounts only.",
    reportToBugsnag: true
  },
  SafeCastOverflowedUintDowncast: {
    message: "Overflow encountered during uint downcasting. Please check the values being cast.",
    reportToBugsnag: true
  },
  SafeERC20FailedOperation: {
    message: "An operation with ERC20 tokens failed. Ensure the contract and token addresses are correct.",
    reportToBugsnag: true
  }
};
const ERC20_ERROR_MESSAGES = {
  ERC20InsufficientAllowance: {
    message: "Your allowance for spending these tokens is insufficient. Please approve more tokens before proceeding.",
    reportToBugsnag: true
  },
  ERC20InsufficientBalance: {
    message: "Your balance is insufficient to complete this transaction. Please ensure you have enough tokens.",
    reportToBugsnag: false
  },
  ERC20InvalidApprover: {
    message: "The approver address is invalid or does not have permission to approve these tokens.",
    reportToBugsnag: true
  },
  ERC20InvalidReceiver: {
    message: "The receiver address is invalid. Please provide a valid address to complete the transaction.",
    reportToBugsnag: true
  },
  ERC20InvalidSender: {
    message: "The sender address is invalid or does not have permission to send these tokens.",
    reportToBugsnag: true
  },
  ERC20InvalidSpender: {
    message: "The spender address is invalid or not allowed to spend tokens on behalf of the sender.",
    reportToBugsnag: true
  },
  MCV2_Token__AlreadyInitialized: {
    message: "This token has already been initialized. Token initialization can only occur once.",
    reportToBugsnag: true
  },
  MCV2_Token__PermissionDenied: {
    message: "Permission denied. You do not have the necessary permissions to perform this action.",
    reportToBugsnag: true
  }
};
const ERC1155_ERROR_MESSAGES = {
  ERC1155InsufficientBalance: {
    message: "Your balance for one or more tokens is insufficient to complete this transaction.",
    reportToBugsnag: false
  },
  ERC1155InvalidApprover: {
    message: "The approver for this operation is invalid or does not have approval rights.",
    reportToBugsnag: true
  },
  ERC1155InvalidArrayLength: {
    message: "The length of the array provided does not match the expected length for this operation.",
    reportToBugsnag: true
  },
  ERC1155InvalidOperator: {
    message: "The operator address provided is invalid or not authorized to perform this operation.",
    reportToBugsnag: true
  },
  ERC1155InvalidReceiver: {
    message: "The receiver address provided is invalid. A valid address is required to receive the tokens.",
    reportToBugsnag: true
  },
  ERC1155InvalidSender: {
    message: "The sender address is invalid or unauthorized to send these tokens.",
    reportToBugsnag: true
  },
  ERC1155MissingApprovalForAll: {
    message: "Approval for all tokens has not been given. Please approve all tokens before proceeding.",
    reportToBugsnag: true
  },
  MCV2_MultiToken__AlreadyInitialized: {
    message: "The multi-token contract has already been initialized and cannot be initialized again.",
    reportToBugsnag: true
  },
  MCV2_MultiToken__BurnAmountExceedsTotalSupply: {
    message: "The amount to be burned exceeds the total supply of the token.",
    reportToBugsnag: true
  },
  MCV2_MultiToken__NotApproved: {
    message: "The operation was not approved. Ensure you have the necessary approvals before retrying.",
    reportToBugsnag: true
  },
  MCV2_MultiToken__PermissionDenied: {
    message: "Permission denied for this operation. Required permissions are not met.",
    reportToBugsnag: true
  }
};
const LOCKER_ERROR_MESSAGES = {
  AddressEmptyCode: {
    message: "The provided address is empty. Please ensure you input a valid address.",
    reportToBugsnag: true
  },
  AddressInsufficientBalance: {
    message: "The address has an insufficient balance for this operation. Please check your balance and try again.",
    reportToBugsnag: false
  },
  FailedInnerCall: {
    message: "An internal contract call failed. Please review the contract logic or contact support.",
    reportToBugsnag: true
  },
  LockUp__AlreadyClaimed: {
    message: "The rewards or tokens have already been claimed. You cannot claim them again.",
    reportToBugsnag: true
  },
  LockUp__InvalidPaginationParameters: {
    message: "Pagination parameters provided are invalid. Please adjust and retry your request.",
    reportToBugsnag: true
  },
  LockUp__InvalidParams: {
    message: "Parameters provided for the operation are invalid. Please review and correct them.",
    reportToBugsnag: true
  },
  LockUp__NotYetUnlocked: {
    message: "The locked tokens are not yet available for claim. Please wait until the unlock period has passed.",
    reportToBugsnag: true
  },
  LockUp__PermissionDenied: {
    message: "You do not have permission to perform this action. Check your account permissions and try again.",
    reportToBugsnag: true
  },
  SafeERC20FailedOperation: {
    message: "An operation with ERC20 tokens failed. Ensure the contract addresses and token details are correct.",
    reportToBugsnag: true
  }
};
const MERKLE_ERROR_MESSAGES = {
  AddressEmptyCode: {
    message: "The address provided is empty. A valid address is required for this operation.",
    reportToBugsnag: true
  },
  AddressInsufficientBalance: {
    message: "Insufficient balance for the operation. Please ensure your balance is sufficient to proceed.",
    reportToBugsnag: false
  },
  FailedInnerCall: {
    message: "An internal call within the contract failed, indicating a potential issue. Please investigate further.",
    reportToBugsnag: true
  },
  MerkleDistributor__AlreadyClaimed: {
    message: "The claim has already been made. Duplicate claims are not allowed.",
    reportToBugsnag: true
  },
  MerkleDistributor__AlreadyRefunded: {
    message: "The refund has already been processed. Duplicate refunds are not permitted.",
    reportToBugsnag: true
  },
  MerkleDistributor__Finished: {
    message: "The distribution period has ended. No further claims can be processed.",
    reportToBugsnag: true
  },
  MerkleDistributor__InvalidCaller: {
    message: "The caller is not authorized for this operation. Please check the caller\u2019s permissions.",
    reportToBugsnag: true
  },
  MerkleDistributor__InvalidPaginationParameters: {
    message: "Provided pagination parameters are invalid. Please correct them and try again.",
    reportToBugsnag: true
  },
  MerkleDistributor__InvalidParams: {
    message: "The parameters provided are invalid. Check the input parameters and retry.",
    reportToBugsnag: true
  },
  MerkleDistributor__InvalidProof: {
    message: "The provided proof is invalid. Ensure you connected the correct address for your airdrop claim.",
    reportToBugsnag: true
  },
  MerkleDistributor__NoClaimableTokensLeft: {
    message: "There are no tokens left to claim. All tokens have been distributed.",
    reportToBugsnag: true
  },
  MerkleDistributor__NothingToRefund: {
    message: "There is nothing to refund. Please check your claim status.",
    reportToBugsnag: true
  },
  MerkleDistributor__NotStarted: {
    message: "The distribution has not started yet. Please wait for the distribution period to begin.",
    reportToBugsnag: true
  },
  MerkleDistributor__PermissionDenied: {
    message: "Permission denied for this action. You do not have the necessary permissions.",
    reportToBugsnag: true
  },
  MerkleDistributor__Refunded: {
    message: "Your tokens have been refunded. Check your account for the refunded tokens.",
    reportToBugsnag: true
  },
  SafeERC20FailedOperation: {
    message: "An ERC20 operation failed. Ensure the contract address and token details are correct and try again.",
    reportToBugsnag: true
  }
};
const ZAP_ERROR_MESSAGES = {
  AddressEmptyCode: {
    message: "The provided address is empty. A valid address must be used for this operation.",
    reportToBugsnag: true
  },
  AddressInsufficientBalance: {
    message: "The address has insufficient balance for the intended operation. Please check your balance.",
    reportToBugsnag: false
  },
  FailedInnerCall: {
    message: "An internal call failed. This may indicate an issue with contract interactions or logic.",
    reportToBugsnag: true
  },
  MCV2_ZapV1__EthTransferFailed: {
    message: "ETH transfer failed. Ensure you have enough ETH and the recipient address is correct.",
    reportToBugsnag: true
  },
  MCV2_ZapV1__InvalidReceiver: {
    message: "The receiver address is invalid. Transactions require a valid receiver address.",
    reportToBugsnag: true
  },
  MCV2_ZapV1__ReserveIsNotWETH: {
    message: "The reserve is not WETH. This operation requires WETH as the reserve currency.",
    reportToBugsnag: true
  },
  MCV2_ZapV1__SlippageLimitExceeded: {
    message: "The slippage limit was exceeded. Adjust your slippage tolerance and try again.",
    reportToBugsnag: false
  },
  OwnableInvalidOwner: {
    message: "The action was attempted by an invalid owner. Only the contract owner can perform this action.",
    reportToBugsnag: true
  },
  OwnableUnauthorizedAccount: {
    message: "This account is unauthorized to perform the requested action. Check account permissions.",
    reportToBugsnag: true
  },
  SafeERC20FailedOperation: {
    message: "An operation involving ERC20 tokens failed. Check the contract and token details before retrying.",
    reportToBugsnag: true
  }
};
const CONTRACT_ERROR_MESSAGES = {
  ...BOND_ERROR_MESSAGES,
  ...ERC20_ERROR_MESSAGES,
  ...ERC1155_ERROR_MESSAGES,
  ...LOCKER_ERROR_MESSAGES,
  ...MERKLE_ERROR_MESSAGES,
  ...ZAP_ERROR_MESSAGES
};

const ARBITRUM_TOKENS = {
  "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1": {
    name: "Wrapped Ether",
    symbol: "WETH",
    address: "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1",
    decimals: 18,
    image: {
      small: "https://mint.club/assets/tokens/small/weth.png",
      large: "https://mint.club/assets/tokens/large/weth.png"
    }
  },
  "0x912CE59144191C1204E64559FE8253a0e49E6548": {
    name: "Arbitrum",
    symbol: "ARB",
    address: "0x912CE59144191C1204E64559FE8253a0e49E6548",
    decimals: 18,
    image: {
      small: "https://mint.club/assets/tokens/small/arbitrum.png",
      large: "https://mint.club/assets/tokens/large/arbitrum.png"
    }
  },
  "0xaf88d065e77c8cC2239327C5EDb3A432268e5831": {
    name: "USD Coin",
    symbol: "USDC",
    address: "0xaf88d065e77c8cC2239327C5EDb3A432268e5831",
    decimals: 6,
    image: {
      small: "https://mint.club/assets/tokens/small/usdc.png",
      large: "https://mint.club/assets/tokens/large/usdc.png"
    }
  },
  "0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8": {
    name: "Bridged USDC",
    symbol: "USDC.e",
    address: "0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8",
    decimals: 6,
    image: {
      small: "https://mint.club/assets/tokens/small/usdc.png",
      large: "https://mint.club/assets/tokens/large/usdc.png"
    }
  },
  "0xfc5A1A6EB076a2C7aD06eD22C90d7E710E35ad0a": {
    name: "GMX Token",
    symbol: "GMX",
    address: "0xfc5A1A6EB076a2C7aD06eD22C90d7E710E35ad0a",
    decimals: 18,
    image: {
      small: "https://assets.coingecko.com/coins/images/18323/small/arbit.png",
      large: "https://assets.coingecko.com/coins/images/18323/large/arbit.png"
    }
  },
  "0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9": {
    name: "Tether USD",
    symbol: "USDT",
    address: "0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9",
    decimals: 6,
    image: {
      small: "https://mint.club/assets/tokens/small/usdt.png",
      large: "https://mint.club/assets/tokens/large/usdt.png"
    }
  },
  "0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f": {
    name: "Wrapped BTC",
    symbol: "WBTC",
    address: "0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f",
    decimals: 8,
    image: {
      small: "https://mint.club/assets/tokens/small/wbtc.png",
      large: "https://mint.club/assets/tokens/large/wbtc.png"
    }
  },
  "0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1": {
    name: "Dai Stablecoin",
    symbol: "DAI",
    address: "0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1",
    decimals: 18,
    image: {
      small: "https://mint.club/assets/tokens/small/dai.png",
      large: "https://mint.club/assets/tokens/large/dai.png"
    }
  },
  "0xf97f4df75117a78c1A5a0DBb814Af92458539FB4": {
    name: "ChainLink Token",
    symbol: "LINK",
    address: "0xf97f4df75117a78c1A5a0DBb814Af92458539FB4",
    decimals: 18,
    image: {
      small: "https://mint.club/assets/tokens/small/link.png",
      large: "https://mint.club/assets/tokens/large/link.png"
    }
  },
  "0x00CBcF7B3d37844e44b888Bc747bDd75FCf4E555": {
    name: "xPet.tech XPET",
    symbol: "XPET",
    address: "0x00CBcF7B3d37844e44b888Bc747bDd75FCf4E555",
    decimals: 18,
    image: {
      small: "https://assets.coingecko.com/coins/images/33553/small/xpet_token.jpeg",
      large: "https://assets.coingecko.com/coins/images/33553/large/xpet_token.jpeg"
    }
  },
  "0x5979D7b546E38E414F7E9822514be443A4800529": {
    name: "Wrapped stETH",
    symbol: "wstETH",
    address: "0x5979D7b546E38E414F7E9822514be443A4800529",
    decimals: 18,
    image: {
      small: "https://assets.coingecko.com/coins/images/18834/small/wstETH.png",
      large: "https://assets.coingecko.com/coins/images/18834/large/wstETH.png"
    }
  },
  "0x6fD58f5a2F3468e35fEb098b5F59F04157002407": {
    name: "poor guy",
    symbol: "pogai",
    address: "0x6fD58f5a2F3468e35fEb098b5F59F04157002407",
    decimals: 18,
    image: {
      small: "https://assets.coingecko.com/coins/images/30116/small/pogai.jpeg",
      large: "https://assets.coingecko.com/coins/images/30116/large/pogai.jpeg"
    }
  },
  "0x0c880f6761F1af8d9Aa9C466984b80DAb9a8c9e8": {
    name: "Pendle",
    symbol: "PENDLE",
    address: "0x0c880f6761F1af8d9Aa9C466984b80DAb9a8c9e8",
    decimals: 18,
    image: {
      small: "https://assets.coingecko.com/coins/images/15069/small/Pendle_Logo_Normal-03.png",
      large: "https://assets.coingecko.com/coins/images/15069/large/Pendle_Logo_Normal-03.png"
    }
  },
  "0x539bdE0d7Dbd336b79148AA742883198BBF60342": {
    name: "Magic",
    symbol: "MAGIC",
    address: "0x539bdE0d7Dbd336b79148AA742883198BBF60342",
    decimals: 18,
    image: {
      small: "https://assets.coingecko.com/coins/images/18623/small/magic.png",
      large: "https://assets.coingecko.com/coins/images/18623/large/magic.png"
    }
  },
  "0x6dAF586B7370B14163171544fca24AbcC0862ac5": {
    name: "xPet.tech BPET",
    symbol: "BPET",
    address: "0x6dAF586B7370B14163171544fca24AbcC0862ac5",
    decimals: 18,
    image: {
      small: "https://assets.coingecko.com/coins/images/33848/small/BPET_logo.png",
      large: "https://assets.coingecko.com/coins/images/33848/large/BPET_logo.png"
    }
  },
  "0x4e352cF164E64ADCBad318C3a1e222E9EBa4Ce42": {
    name: "MUX Protocol",
    symbol: "MCB",
    address: "0x4e352cF164E64ADCBad318C3a1e222E9EBa4Ce42",
    decimals: 18,
    image: {
      small: "https://assets.coingecko.com/coins/images/11796/small/mux.jpg",
      large: "https://assets.coingecko.com/coins/images/11796/large/mux.jpg"
    }
  },
  "0x17FC002b466eEc40DaE837Fc4bE5c67993ddBd6F": {
    name: "Frax",
    symbol: "FRAX",
    address: "0x17FC002b466eEc40DaE837Fc4bE5c67993ddBd6F",
    decimals: 18,
    image: {
      small: "https://mint.club/assets/tokens/small/frax.png",
      large: "https://mint.club/assets/tokens/large/frax.png"
    }
  },
  "0xFa7F8980b0f1E64A2062791cc3b0871572f1F7f0": {
    name: "Uniswap",
    symbol: "UNI",
    address: "0xFa7F8980b0f1E64A2062791cc3b0871572f1F7f0",
    decimals: 18,
    image: {
      small: "https://mint.club/assets/tokens/small/uni.png",
      large: "https://mint.club/assets/tokens/large/uni.png"
    }
  },
  "0x13Ad51ed4F1B7e9Dc168d8a00cB3f4dDD85EfA60": {
    name: "Lido DAO",
    symbol: "LDO",
    address: "0x13Ad51ed4F1B7e9Dc168d8a00cB3f4dDD85EfA60",
    decimals: 18,
    image: {
      small: "https://mint.club/assets/tokens/small/ldo.png",
      large: "https://mint.club/assets/tokens/large/ldo.png"
    }
  },
  "0x11cDb42B0EB46D95f990BeDD4695A6e3fA034978": {
    name: "Curve DAO Token",
    symbol: "CRV",
    address: "0x11cDb42B0EB46D95f990BeDD4695A6e3fA034978",
    decimals: 18,
    image: {
      small: "https://mint.club/assets/tokens/small/curve.png",
      large: "https://mint.club/assets/tokens/large/curve.png"
    }
  }
};

const AVALANCHE_TOKENS = {
  "0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7": {
    name: "Wrapped AVAX",
    symbol: "WAVAX",
    address: "0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7",
    decimals: 18,
    image: {
      small: "https://mint.club/assets/tokens/small/avalanche.png",
      large: "https://mint.club/assets/tokens/large/avalanche.png"
    }
  },
  "0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E": {
    name: "USD Coin",
    symbol: "USDC",
    address: "0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E",
    decimals: 6,
    image: {
      small: "https://mint.club/assets/tokens/small/usdc.png",
      large: "https://mint.club/assets/tokens/large/usdc.png"
    }
  },
  "0x9702230A8Ea53601f5cD2dc00fDBc13d4dF4A8c7": {
    name: "TetherToken",
    symbol: "USDt",
    address: "0x9702230A8Ea53601f5cD2dc00fDBc13d4dF4A8c7",
    decimals: 6,
    image: {
      small: "https://mint.club/assets/tokens/small/usdt.png",
      large: "https://mint.club/assets/tokens/large/usdt.png"
    }
  },
  "0x152b9d0FdC40C096757F570A51E494bd4b943E50": {
    name: "Bitcoin",
    symbol: "BTC.b",
    address: "0x152b9d0FdC40C096757F570A51E494bd4b943E50",
    decimals: 8,
    image: {
      small: "https://assets.coingecko.com/coins/images/26115/small/btcb.png",
      large: "https://assets.coingecko.com/coins/images/26115/large/btcb.png"
    }
  },
  "0x2F6F07CDcf3588944Bf4C42aC74ff24bF56e7590": {
    name: "StargateToken",
    symbol: "STG",
    address: "0x2F6F07CDcf3588944Bf4C42aC74ff24bF56e7590",
    decimals: 18,
    image: {
      small: "https://assets.coingecko.com/coins/images/24413/small/STG_LOGO.png",
      large: "https://assets.coingecko.com/coins/images/24413/large/STG_LOGO.png"
    }
  },
  "0x6e84a6216eA6dACC71eE8E6b0a5B7322EEbC0fDd": {
    name: "JoeToken",
    symbol: "JOE",
    address: "0x6e84a6216eA6dACC71eE8E6b0a5B7322EEbC0fDd",
    decimals: 18,
    image: {
      small: "https://assets.coingecko.com/coins/images/17569/small/JoeToken.png",
      large: "https://assets.coingecko.com/coins/images/17569/large/JoeToken.png"
    }
  },
  "0x714f020C54cc9D104B6F4f6998C63ce2a31D1888": {
    name: "Step App",
    symbol: "FITFI",
    address: "0x714f020C54cc9D104B6F4f6998C63ce2a31D1888",
    decimals: 18,
    image: {
      small: "https://assets.coingecko.com/coins/images/25015/small/200x200.png",
      large: "https://assets.coingecko.com/coins/images/25015/large/200x200.png"
    }
  }
};

const BASE_TOKENS = {
  "0x4200000000000000000000000000000000000006": {
    name: "Wrapped Ether",
    symbol: "WETH",
    address: "0x4200000000000000000000000000000000000006",
    decimals: 18,
    image: {
      small: "https://mint.club/assets/tokens/small/weth.png",
      large: "https://mint.club/assets/tokens/large/weth.png"
    }
  },
  "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913": {
    name: "USDC",
    symbol: "USDC",
    address: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
    decimals: 6,
    image: {
      small: "https://mint.club/assets/tokens/small/usdc.png",
      large: "https://mint.club/assets/tokens/large/usdc.png"
    }
  },
  "0xd9aAEc86B65D86f6A7B5B1b0c42FFA531710b6CA": {
    name: "Bridged USDC",
    symbol: "USDBC",
    address: "0xd9aAEc86B65D86f6A7B5B1b0c42FFA531710b6CA",
    decimals: 6,
    image: {
      small: "https://mint.club/assets/tokens/small/usdc.png",
      large: "https://mint.club/assets/tokens/large/usdc.png"
    }
  },
  "0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb": {
    name: "Dai",
    symbol: "DAI",
    address: "0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb",
    decimals: 18,
    image: {
      small: "https://mint.club/assets/tokens/small/dai.png",
      large: "https://mint.club/assets/tokens/large/dai.png"
    }
  },
  "0x2Ae3F1Ec7F1F5012CFEab0185bfc7aa3cf0DEc22": {
    name: "Coinbase Wrapped Staked ETH",
    symbol: "CBETH",
    address: "0x2Ae3F1Ec7F1F5012CFEab0185bfc7aa3cf0DEc22",
    decimals: 18,
    image: {
      small: "https://assets.coingecko.com/coins/images/27008/small/cbeth.png",
      large: "https://assets.coingecko.com/coins/images/27008/large/cbeth.png"
    }
  },
  "0x940181a94A35A4569E4529A3CDfB74e38FD98631": {
    name: "Aerodrome Finance",
    symbol: "AERO",
    address: "0x940181a94A35A4569E4529A3CDfB74e38FD98631",
    decimals: 18,
    image: {
      small: "https://assets.coingecko.com/coins/images/31745/small/token.png",
      large: "https://assets.coingecko.com/coins/images/31745/large/token.png"
    }
  },
  "0x27D2DECb4bFC9C76F0309b8E88dec3a601Fe25a8": {
    name: "Bald",
    symbol: "BALD",
    address: "0x27D2DECb4bFC9C76F0309b8E88dec3a601Fe25a8",
    decimals: 18,
    image: {
      small: "https://assets.coingecko.com/coins/images/31119/small/cdjxKSjo_400x400.jpg",
      large: "https://assets.coingecko.com/coins/images/31119/large/cdjxKSjo_400x400.jpg"
    }
  },
  "0xfA980cEd6895AC314E7dE34Ef1bFAE90a5AdD21b": {
    name: "Echelon Prime",
    symbol: "PRIME",
    address: "0xfA980cEd6895AC314E7dE34Ef1bFAE90a5AdD21b",
    decimals: 18,
    image: {
      small: "https://assets.coingecko.com/coins/images/29053/small/prime-logo-small-border_%282%29.png",
      large: "https://assets.coingecko.com/coins/images/29053/large/prime-logo-small-border_%282%29.png"
    }
  },
  "0x236aa50979D5f3De3Bd1Eeb40E81137F22ab794b": {
    name: "tBTC",
    symbol: "TBTC",
    address: "0x236aa50979D5f3De3Bd1Eeb40E81137F22ab794b",
    decimals: 18,
    image: {
      small: "https://assets.coingecko.com/coins/images/11224/small/0x18084fba666a33d37592fa2633fd49a74dd93a88.png",
      large: "https://assets.coingecko.com/coins/images/11224/large/0x18084fba666a33d37592fa2633fd49a74dd93a88.png"
    }
  },
  "0x4158734D47Fc9692176B5085E0F52ee0Da5d47F1": {
    name: "Balancer",
    symbol: "BAL",
    address: "0x4158734D47Fc9692176B5085E0F52ee0Da5d47F1",
    decimals: 18,
    image: {
      small: "https://assets.coingecko.com/coins/images/11683/small/Balancer.png",
      large: "https://assets.coingecko.com/coins/images/11683/large/Balancer.png"
    }
  },
  "0xdCf5130274753c8050aB061B1a1DCbf583f5bFd0": {
    name: "ViciCoin",
    symbol: "VCNT",
    address: "0xdCf5130274753c8050aB061B1a1DCbf583f5bFd0",
    decimals: 18,
    image: {
      small: "https://assets.coingecko.com/coins/images/31305/small/ViciCoin_-_small.png",
      large: "https://assets.coingecko.com/coins/images/31305/large/ViciCoin_-_small.png"
    }
  },
  "0xCfA3Ef56d303AE4fAabA0592388F19d7C3399FB4": {
    name: "Electronic USD",
    symbol: "EUSD",
    address: "0xCfA3Ef56d303AE4fAabA0592388F19d7C3399FB4",
    decimals: 18,
    image: {
      small: "https://assets.coingecko.com/coins/images/28445/small/0xa0d69e286b938e21cbf7e51d71f6a4c8918f482f.png",
      large: "https://assets.coingecko.com/coins/images/28445/large/0xa0d69e286b938e21cbf7e51d71f6a4c8918f482f.png"
    }
  },
  "0x1C7a460413dD4e964f96D8dFC56E7223cE88CD85": {
    name: "Seamless",
    symbol: "SEAM",
    address: "0x1C7a460413dD4e964f96D8dFC56E7223cE88CD85",
    decimals: 18,
    image: {
      small: "https://assets.coingecko.com/coins/images/33480/small/Seamless_Logo_Black_Transparent.png",
      large: "https://assets.coingecko.com/coins/images/33480/large/Seamless_Logo_Black_Transparent.png"
    }
  },
  "0x78a087d713Be963Bf307b18F2Ff8122EF9A63ae9": {
    name: "BaseSwap",
    symbol: "BSWAP",
    address: "0x78a087d713Be963Bf307b18F2Ff8122EF9A63ae9",
    decimals: 18,
    image: {
      small: "https://assets.coingecko.com/coins/images/31245/small/Baseswap_LogoNew.jpg",
      large: "https://assets.coingecko.com/coins/images/31245/large/Baseswap_LogoNew.jpg"
    }
  }
};

const BSC_TOKENS = {
  "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c": {
    name: "Wrapped BNB",
    symbol: "WBNB",
    address: "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c",
    decimals: 18,
    image: {
      small: "https://assets.coingecko.com/coins/images/825/small/bnb-icon2_2x.png",
      large: "https://assets.coingecko.com/coins/images/825/large/bnb-icon2_2x.png"
    }
  },
  "0x1f3Af095CDa17d63cad238358837321e95FC5915": {
    name: "Mint.club",
    symbol: "MINT",
    address: "0x1f3Af095CDa17d63cad238358837321e95FC5915",
    decimals: 18,
    image: {
      small: "https://mint.club/assets/tokens/small/mint.png",
      large: "https://mint.club/assets/tokens/large/mint.png"
    }
  },
  "0x55d398326f99059ff775485246999027b3197955": {
    name: "Binance-Peg BSC-USD",
    symbol: "BSC-USD",
    address: "0x55d398326f99059ff775485246999027b3197955",
    decimals: 18,
    image: {
      small: "https://mint.club/assets/tokens/small/usdt.png",
      large: "https://mint.club/assets/tokens/large/usdt.png"
    }
  },
  "0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82": {
    name: "PancakeSwap Token",
    symbol: "Cake",
    address: "0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82",
    decimals: 18,
    image: {
      small: "https://assets.coingecko.com/coins/images/12632/small/pancakeswap-cake-logo_%281%29.png",
      large: "https://assets.coingecko.com/coins/images/12632/large/pancakeswap-cake-logo_%281%29.png"
    }
  },
  "0xcF6BB5389c92Bdda8a3747Ddb454cB7a64626C63": {
    name: "Venus",
    symbol: "XVS",
    address: "0xcF6BB5389c92Bdda8a3747Ddb454cB7a64626C63",
    decimals: 18,
    image: {
      small: "https://assets.coingecko.com/coins/images/12677/small/download.jpg",
      large: "https://assets.coingecko.com/coins/images/12677/large/download.jpg"
    }
  },
  "0x965F527D9159dCe6288a2219DB51fc6Eef120dD1": {
    name: "Biswap",
    symbol: "BSW",
    address: "0x965F527D9159dCe6288a2219DB51fc6Eef120dD1",
    decimals: 18,
    image: {
      small: "https://assets.coingecko.com/coins/images/16845/small/biswap.png",
      large: "https://assets.coingecko.com/coins/images/16845/large/biswap.png"
    }
  },
  "0x2170Ed0880ac9A755fd29B2688956BD959F933F8": {
    name: "Binance-Peg Ethereum Token",
    symbol: "ETH",
    address: "0x2170Ed0880ac9A755fd29B2688956BD959F933F8",
    decimals: 18,
    image: {
      small: "https://mint.club/assets/tokens/small/weth.png",
      large: "https://mint.club/assets/tokens/large/weth.png"
    }
  },
  "0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d": {
    name: "Binance-Peg USD Coin",
    symbol: "USDC",
    address: "0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d",
    decimals: 18,
    image: {
      small: "https://mint.club/assets/tokens/small/usdc.png",
      large: "https://mint.club/assets/tokens/large/usdc.png"
    }
  },
  "0x1af3f329e8be154074d8769d1ffa4ee058b1dbc3": {
    name: "Binance-Peg Dai Token",
    symbol: "DAI",
    address: "0x1af3f329e8be154074d8769d1ffa4ee058b1dbc3",
    decimals: 18,
    image: {
      small: "https://mint.club/assets/tokens/small/dai.png",
      large: "https://mint.club/assets/tokens/large/dai.png"
    }
  },
  "0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c": {
    name: "Binance-Peg BTCB Token",
    symbol: "BTCB",
    address: "0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c",
    decimals: 18,
    image: {
      small: "https://mint.club/assets/tokens/small/wbtc.png",
      large: "https://mint.club/assets/tokens/large/wbtc.png"
    }
  },
  "0x1D2F0da169ceB9fC7B3144628dB156f3F6c60dBE": {
    name: "Binance-Peg XRP Token",
    symbol: "XRP",
    address: "0x1D2F0da169ceB9fC7B3144628dB156f3F6c60dBE",
    decimals: 18,
    image: {
      small: "https://mint.club/assets/tokens/small/xrp.png",
      large: "https://mint.club/assets/tokens/large/xrp.png"
    }
  },
  "0xF8A0BF9cF54Bb92F17374d9e9A321E6a111a51bD": {
    name: "Binance-Peg ChainLink Token",
    symbol: "LINK",
    address: "0xF8A0BF9cF54Bb92F17374d9e9A321E6a111a51bD",
    decimals: 18,
    image: {
      small: "https://mint.club/assets/tokens/small/link.png",
      large: "https://mint.club/assets/tokens/large/link.png"
    }
  },
  "0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56": {
    name: "Binance-Peg BUSD Token",
    symbol: "BUSD",
    address: "0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56",
    decimals: 18,
    image: {
      small: "https://mint.club/assets/tokens/small/busd.png",
      large: "https://mint.club/assets/tokens/large/busd.png"
    }
  },
  "0xd17479997F34dd9156Deef8F95A52D81D265be9c": {
    name: "Decentralized USD",
    symbol: "USDD",
    address: "0xd17479997F34dd9156Deef8F95A52D81D265be9c",
    decimals: 18,
    image: {
      small: "https://mint.club/assets/tokens/small/usdd.png",
      large: "https://mint.club/assets/tokens/large/usdd.png"
    }
  },
  "0xCC42724C6683B7E57334c4E856f4c9965ED682bD": {
    name: "Matic Token",
    symbol: "MATIC",
    address: "0xCC42724C6683B7E57334c4E856f4c9965ED682bD",
    decimals: 18,
    image: {
      small: "https://mint.club/assets/tokens/small/matic.png",
      large: "https://mint.club/assets/tokens/large/matic.png"
    }
  },
  "0x5f0Da599BB2ccCfcf6Fdfd7D81743B6020864350": {
    name: "Binance-Peg Maker",
    symbol: "MKR",
    address: "0x5f0Da599BB2ccCfcf6Fdfd7D81743B6020864350",
    decimals: 18,
    image: {
      small: "https://mint.club/assets/tokens/small/mkr.png",
      large: "https://mint.club/assets/tokens/large/mkr.png"
    }
  },
  "0xBf5140A22578168FD562DCcF235E5D43A02ce9B1": {
    name: "Binance-Peg Uniswap",
    symbol: "UNI",
    address: "0xBf5140A22578168FD562DCcF235E5D43A02ce9B1",
    decimals: 18,
    image: {
      small: "https://mint.club/assets/tokens/small/uni.png",
      large: "https://mint.club/assets/tokens/large/uni.png"
    }
  },
  "0x111111111117dC0aa78b770fA6A738034120C302": {
    name: "1INCH Token",
    symbol: "1INCH",
    address: "0x111111111117dC0aa78b770fA6A738034120C302",
    decimals: 18,
    image: {
      small: "https://mint.club/assets/tokens/small/1inch.svg",
      large: "https://mint.club/assets/tokens/large/1inch.svg"
    }
  },
  "0x8595F9dA7b868b1822194fAEd312235E43007b49": {
    name: "Binance-Peg BitTorrent Token",
    symbol: "BTT",
    address: "0x8595F9dA7b868b1822194fAEd312235E43007b49",
    decimals: 18,
    image: {
      small: "https://mint.club/assets/tokens/small/btt.png",
      large: "https://mint.club/assets/tokens/large/btt.png"
    }
  },
  "0x2859e4544C4bB03966803b044A93563Bd2D0DD4D": {
    name: "Binance-Peg Shiba Inu Token",
    symbol: "SHIB",
    address: "0x2859e4544C4bB03966803b044A93563Bd2D0DD4D",
    decimals: 18,
    image: {
      small: "https://mint.club/assets/tokens/small/shib.png",
      large: "https://mint.club/assets/tokens/large/shib.png"
    }
  },
  "0xbA2aE424d960c26247Dd6c32edC70B295c744C43": {
    name: "Binance-Peg Dogecoin Token",
    symbol: "DOGE",
    address: "0xbA2aE424d960c26247Dd6c32edC70B295c744C43",
    decimals: 8,
    image: {
      small: "https://mint.club/assets/tokens/small/doge.png",
      large: "https://mint.club/assets/tokens/large/doge.png"
    }
  },
  "0xc748673057861a797275CD8A068AbB95A902e8de": {
    name: "Baby Doge Coin",
    symbol: "BabyDoge",
    address: "0xc748673057861a797275CD8A068AbB95A902e8de",
    decimals: 9,
    image: {
      small: "https://mint.club/assets/tokens/small/babydoge.png",
      large: "https://mint.club/assets/tokens/large/babydoge.png"
    }
  },
  "0x3EE2200Efb3400fAbB9AacF31297cBdD1d435D47": {
    name: "Binance-Peg Cardano Token",
    symbol: "ADA",
    address: "0x3EE2200Efb3400fAbB9AacF31297cBdD1d435D47",
    decimals: 18,
    image: {
      small: "https://mint.club/assets/tokens/small/cardano.png",
      large: "https://mint.club/assets/tokens/large/cardano.png"
    }
  },
  "0xCE7de646e7208a4Ef112cb6ed5038FA6cC6b12e3": {
    name: "TRON",
    symbol: "TRX",
    address: "0xCE7de646e7208a4Ef112cb6ed5038FA6cC6b12e3",
    decimals: 6,
    image: {
      small: "https://mint.club/assets/tokens/small/tron.png",
      large: "https://mint.club/assets/tokens/large/tron.png"
    }
  },
  "0x4338665CBB7B2485A8855A139b75D5e34AB0DB94": {
    name: "Binance-Peg Litecoin Token",
    symbol: "LTC",
    address: "0x4338665CBB7B2485A8855A139b75D5e34AB0DB94",
    decimals: 18,
    image: {
      small: "https://mint.club/assets/tokens/small/ltc.png",
      large: "https://mint.club/assets/tokens/large/ltc.png"
    }
  },
  "0x7083609fCE4d1d8Dc0C979AAb8c869Ea2C873402": {
    name: "Binance-Peg Polkadot Token",
    symbol: "DOT",
    address: "0x7083609fCE4d1d8Dc0C979AAb8c869Ea2C873402",
    decimals: 18,
    image: {
      small: "https://mint.club/assets/tokens/small/dot.png",
      large: "https://mint.club/assets/tokens/large/dot.png"
    }
  }
};

const MAINNET_TOKENS = {
  "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2": {
    name: "Wrapped Ether",
    symbol: "WETH",
    address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
    decimals: 18,
    image: {
      small: "https://mint.club/assets/tokens/small/weth.png",
      large: "https://mint.club/assets/tokens/large/weth.png"
    }
  },
  "0x9AAb071B4129B083B01cB5A0Cb513Ce7ecA26fa5": {
    name: "Hunt Token",
    symbol: "HUNT",
    address: "0x9AAb071B4129B083B01cB5A0Cb513Ce7ecA26fa5",
    decimals: 18,
    image: {
      small: "https://mint.club/assets/tokens/small/hunt.png",
      large: "https://mint.club/assets/tokens/large/hunt.png"
    }
  },
  "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48": {
    name: "USD Coin",
    symbol: "USDC",
    address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    decimals: 6,
    image: {
      small: "https://mint.club/assets/tokens/small/usdc.png",
      large: "https://mint.club/assets/tokens/large/usdc.png"
    }
  },
  "0xdAC17F958D2ee523a2206206994597C13D831ec7": {
    name: "Tether USD",
    symbol: "USDT",
    address: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
    decimals: 6,
    image: {
      small: "https://mint.club/assets/tokens/small/usdt.png",
      large: "https://mint.club/assets/tokens/large/usdt.png"
    }
  },
  "0x6B175474E89094C44Da98b954EedeAC495271d0F": {
    name: "Dai Stablecoin",
    symbol: "DAI",
    address: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
    decimals: 18,
    image: {
      small: "https://mint.club/assets/tokens/small/dai.png",
      large: "https://mint.club/assets/tokens/large/dai.png"
    }
  },
  "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599": {
    name: "Wrapped BTC",
    symbol: "WBTC",
    address: "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599",
    decimals: 8,
    image: {
      small: "https://mint.club/assets/tokens/small/wbtc.png",
      large: "https://mint.club/assets/tokens/large/wbtc.png"
    }
  },
  "0x4d224452801ACEd8B2F0aebE155379bb5D594381": {
    name: "ApeCoin",
    symbol: "APE",
    address: "0x4d224452801ACEd8B2F0aebE155379bb5D594381",
    decimals: 18,
    image: {
      small: "https://mint.club/assets/tokens/small/ape.png",
      large: "https://mint.club/assets/tokens/large/ape.png"
    }
  },
  "0x6982508145454ce325ddbe47a25d4ec3d2311933": {
    name: "Pepe",
    symbol: "PEPE",
    address: "0x6982508145454ce325ddbe47a25d4ec3d2311933",
    decimals: 18,
    image: {
      small: "https://mint.club/assets/tokens/small/pepe.webp",
      large: "https://mint.club/assets/tokens/large/pepe.webp"
    }
  },
  "0x95aD61b0a150d79219dCF64E1E6Cc01f0B64C4cE": {
    name: "Shiba Inu",
    symbol: "SHIB",
    address: "0x95aD61b0a150d79219dCF64E1E6Cc01f0B64C4cE",
    decimals: 18,
    image: {
      small: "https://mint.club/assets/tokens/small/shib.png",
      large: "https://mint.club/assets/tokens/large/shib.png"
    }
  },
  "0xb131f4A55907B10d1F0A50d8ab8FA09EC342cd74": {
    name: "Memecoin",
    symbol: "MEME",
    address: "0xb131f4A55907B10d1F0A50d8ab8FA09EC342cd74",
    decimals: 18,
    image: {
      small: "https://assets.coingecko.com/coins/images/32528/small/memecoin_%282%29.png",
      large: "https://assets.coingecko.com/coins/images/32528/large/memecoin_%282%29.png"
    }
  },
  "0x514910771AF9Ca656af840dff83E8264EcF986CA": {
    name: "ChainLink Token",
    symbol: "LINK",
    address: "0x514910771AF9Ca656af840dff83E8264EcF986CA",
    decimals: 18,
    image: {
      small: "https://mint.club/assets/tokens/small/link.png",
      large: "https://mint.club/assets/tokens/large/link.png"
    }
  },
  "0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0": {
    name: "Matic Token",
    symbol: "MATIC",
    address: "0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0",
    decimals: 18,
    image: {
      small: "https://mint.club/assets/tokens/small/matic.png",
      large: "https://mint.club/assets/tokens/large/matic.png"
    }
  },
  "0x9f8F72aA9304c8B593d555F12eF6589cC3A579A2": {
    name: "Maker",
    symbol: "MKR",
    address: "0x9f8F72aA9304c8B593d555F12eF6589cC3A579A2",
    decimals: 18,
    image: {
      small: "https://mint.club/assets/tokens/small/mkr.png",
      large: "https://mint.club/assets/tokens/large/mkr.png"
    }
  },
  "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984": {
    name: "Uniswap",
    symbol: "UNI",
    address: "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984",
    decimals: 18,
    image: {
      small: "https://mint.club/assets/tokens/small/uni.png",
      large: "https://mint.club/assets/tokens/large/uni.png"
    }
  },
  "0x5A98FcBEA516Cf06857215779Fd812CA3beF1B32": {
    name: "Lido DAO Token",
    symbol: "LDO",
    address: "0x5A98FcBEA516Cf06857215779Fd812CA3beF1B32",
    decimals: 18,
    image: {
      small: "https://mint.club/assets/tokens/small/ldo.png",
      large: "https://mint.club/assets/tokens/large/ldo.png"
    }
  },
  "0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0": {
    name: "Wrapped stETH",
    symbol: "wstETH",
    address: "0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0",
    decimals: 18,
    image: {
      small: "https://assets.coingecko.com/coins/images/18834/small/wstETH.png",
      large: "https://assets.coingecko.com/coins/images/18834/large/wstETH.png"
    }
  },
  "0x111111111117dC0aa78b770fA6A738034120C302": {
    name: "1INCH Token",
    symbol: "1INCH",
    address: "0x111111111117dC0aa78b770fA6A738034120C302",
    decimals: 18,
    image: {
      small: "https://mint.club/assets/tokens/small/1inch.svg",
      large: "https://mint.club/assets/tokens/large/1inch.svg"
    }
  },
  "0x6B3595068778DD592e39A122f4f5a5cF09C90fE2": {
    name: "SushiToken",
    symbol: "SUSHI",
    address: "0x6B3595068778DD592e39A122f4f5a5cF09C90fE2",
    decimals: 18,
    image: {
      small: "https://assets.coingecko.com/coins/images/12271/small/512x512_Logo_no_chop.png",
      large: "https://assets.coingecko.com/coins/images/12271/large/512x512_Logo_no_chop.png"
    }
  },
  "0x5283D291DBCF85356A21bA090E6db59121208b44": {
    name: "Blur",
    symbol: "BLUR",
    address: "0x5283D291DBCF85356A21bA090E6db59121208b44",
    decimals: 18,
    image: {
      small: "https://assets.coingecko.com/coins/images/28453/small/blur.png",
      large: "https://assets.coingecko.com/coins/images/28453/large/blur.png"
    }
  },
  "0xF57e7e7C23978C3cAEC3C3548E3D615c346e79fF": {
    name: "Immutable X",
    symbol: "IMX",
    address: "0xF57e7e7C23978C3cAEC3C3548E3D615c346e79fF",
    decimals: 18,
    image: {
      small: "https://assets.coingecko.com/coins/images/17233/small/immutableX-symbol-BLK-RGB.png",
      large: "https://assets.coingecko.com/coins/images/17233/large/immutableX-symbol-BLK-RGB.png"
    }
  },
  "0xf4d2888d29D722226FafA5d9B24F9164c092421E": {
    name: "LooksRare Token",
    symbol: "LOOKS",
    address: "0xf4d2888d29D722226FafA5d9B24F9164c092421E",
    decimals: 18,
    image: {
      small: "https://mint.club/assets/tokens/small/looks.png",
      large: "https://mint.club/assets/tokens/large/looks.png"
    }
  },
  "0x6810e776880C02933D47DB1b9fc05908e5386b96": {
    name: "Gnosis Token",
    symbol: "GNO",
    address: "0x6810e776880C02933D47DB1b9fc05908e5386b96",
    decimals: 18,
    image: {
      small: "https://mint.club/assets/tokens/small/gno.png",
      large: "https://mint.club/assets/tokens/large/gno.png"
    }
  },
  "0x1a7e4e63778B4f12a199C062f3eFdD288afCBce8": {
    name: "agEUR",
    symbol: "agEUR",
    address: "0x1a7e4e63778B4f12a199C062f3eFdD288afCBce8",
    decimals: 18,
    image: {
      small: "https://mint.club/assets/tokens/small/ageur.png",
      large: "https://mint.club/assets/tokens/large/ageur.png"
    }
  },
  "0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9": {
    name: "Aave Token",
    symbol: "AAVE",
    address: "0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9",
    decimals: 18,
    image: {
      small: "https://mint.club/assets/tokens/small/aave.png",
      large: "https://mint.club/assets/tokens/large/aave.png"
    }
  }
};

const OPTIMISM_TOKENS = {
  "0x4200000000000000000000000000000000000006": {
    name: "Wrapped Ether",
    symbol: "WETH",
    address: "0x4200000000000000000000000000000000000006",
    decimals: 18,
    image: {
      small: "https://mint.club/assets/tokens/small/weth.png",
      large: "https://mint.club/assets/tokens/large/weth.png"
    }
  },
  "0x4200000000000000000000000000000000000042": {
    name: "Optimism",
    symbol: "OP",
    address: "0x4200000000000000000000000000000000000042",
    decimals: 18,
    image: {
      small: "https://mint.club/assets/tokens/small/optimism.png",
      large: "https://mint.club/assets/tokens/large/optimism.png"
    }
  },
  "0x7F5c764cBc14f9669B88837ca1490cCa17c31607": {
    name: "USD Coin",
    symbol: "USDC",
    address: "0x7F5c764cBc14f9669B88837ca1490cCa17c31607",
    decimals: 6,
    image: {
      small: "https://mint.club/assets/tokens/small/usdc.png",
      large: "https://mint.club/assets/tokens/large/usdc.png"
    }
  },
  "0x94b008aA00579c1307B0EF2c499aD98a8ce58e58": {
    name: "Tether USD",
    symbol: "USDT",
    address: "0x94b008aA00579c1307B0EF2c499aD98a8ce58e58",
    decimals: 6,
    image: {
      small: "https://mint.club/assets/tokens/small/usdt.png",
      large: "https://mint.club/assets/tokens/large/usdt.png"
    }
  },
  "0x68f180fcCe6836688e9084f035309E29Bf0A2095": {
    name: "Wrapped BTC",
    symbol: "WBTC",
    address: "0x68f180fcCe6836688e9084f035309E29Bf0A2095",
    decimals: 8,
    image: {
      small: "https://mint.club/assets/tokens/small/wbtc.png",
      large: "https://mint.club/assets/tokens/large/wbtc.png"
    }
  },
  "0xdC6fF44d5d932Cbd77B52E5612Ba0529DC6226F1": {
    name: "Worldcoin",
    symbol: "WLD",
    address: "0xdC6fF44d5d932Cbd77B52E5612Ba0529DC6226F1",
    decimals: 18,
    image: {
      small: "https://mint.club/assets/tokens/small/worldcoin.png",
      large: "https://mint.club/assets/tokens/large/worldcoin.png"
    }
  },
  "0x350a791Bfc2C21F9Ed5d10980Dad2e2638ffa7f6": {
    name: "ChainLink Token",
    symbol: "LINK",
    address: "0x350a791Bfc2C21F9Ed5d10980Dad2e2638ffa7f6",
    decimals: 18,
    image: {
      small: "https://mint.club/assets/tokens/small/link.png",
      large: "https://mint.club/assets/tokens/large/link.png"
    }
  },
  "0xFdb794692724153d1488CcdBE0C56c252596735F": {
    name: "Lido DAO Token",
    symbol: "LDO",
    address: "0xFdb794692724153d1488CcdBE0C56c252596735F",
    decimals: 18,
    image: {
      small: "https://mint.club/assets/tokens/small/ldo.png",
      large: "https://mint.club/assets/tokens/large/ldo.png"
    }
  },
  "0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1": {
    name: "Dai Stablecoin",
    symbol: "DAI",
    address: "0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1",
    decimals: 18,
    image: {
      small: "https://mint.club/assets/tokens/small/dai.png",
      large: "https://mint.club/assets/tokens/large/dai.png"
    }
  },
  "0x2E3D870790dC77A83DD1d18184Acc7439A53f475": {
    name: "Frax",
    symbol: "FRAX",
    address: "0x2E3D870790dC77A83DD1d18184Acc7439A53f475",
    decimals: 18,
    image: {
      small: "https://mint.club/assets/tokens/small/frax.png",
      large: "https://mint.club/assets/tokens/large/frax.png"
    }
  },
  "0x8c6f28f2F1A3C87F0f938b96d27520d9751ec8d9": {
    name: "Synth sUSD",
    symbol: "sUSD",
    address: "0x8c6f28f2F1A3C87F0f938b96d27520d9751ec8d9",
    decimals: 18,
    image: {
      small: "https://mint.club/assets/tokens/small/sUSD.png",
      large: "https://mint.club/assets/tokens/large/sUSD.png"
    }
  },
  "0x9560e827aF36c94D2Ac33a39bCE1Fe78631088Db": {
    name: "VelodromeV2",
    symbol: "VELO",
    address: "0x9560e827aF36c94D2Ac33a39bCE1Fe78631088Db",
    decimals: 18,
    image: {
      small: "https://mint.club/assets/tokens/small/velo.png",
      large: "https://mint.club/assets/tokens/large/velo.png"
    }
  },
  "0x76FB31fb4af56892A25e32cFC43De717950c9278": {
    name: "Aave Token",
    symbol: "AAVE",
    address: "0x76FB31fb4af56892A25e32cFC43De717950c9278",
    decimals: 18,
    image: {
      small: "https://mint.club/assets/tokens/small/aave.png",
      large: "https://mint.club/assets/tokens/large/aave.png"
    }
  },
  "0x1F32b1c2345538c0c6f582fCB022739c4A194Ebb": {
    name: "Wrapped stETH",
    symbol: "wstETH",
    address: "0x1F32b1c2345538c0c6f582fCB022739c4A194Ebb",
    decimals: 18,
    image: {
      small: "https://assets.coingecko.com/coins/images/18834/small/wstETH.png",
      large: "https://assets.coingecko.com/coins/images/18834/large/wstETH.png"
    }
  },
  "0x8700dAec35aF8Ff88c16BdF0418774CB3D7599B4": {
    name: "Synthetix Network Token",
    symbol: "SNX",
    address: "0x8700dAec35aF8Ff88c16BdF0418774CB3D7599B4",
    decimals: 18,
    image: {
      small: "https://assets.coingecko.com/coins/images/3406/small/SNX.png",
      large: "https://assets.coingecko.com/coins/images/3406/large/SNX.png"
    }
  },
  "0x9e1028F5F1D5eDE59748FFceE5532509976840E0": {
    name: "Perpetual",
    symbol: "PERP",
    address: "0x9e1028F5F1D5eDE59748FFceE5532509976840E0",
    decimals: 18,
    image: {
      small: "https://assets.coingecko.com/coins/images/12381/small/60d18e06844a844ad75901a9_mark_only_03.png",
      large: "https://assets.coingecko.com/coins/images/12381/large/60d18e06844a844ad75901a9_mark_only_03.png"
    }
  },
  "0x9485aca5bbBE1667AD97c7fE7C4531a624C8b1ED": {
    name: "agEUR",
    symbol: "agEUR",
    address: "0x9485aca5bbBE1667AD97c7fE7C4531a624C8b1ED",
    decimals: 18,
    image: {
      small: "https://mint.club/assets/tokens/small/ageur.png",
      large: "https://mint.club/assets/tokens/large/ageur.png"
    }
  }
};

const POLYGON_TOKENS = {
  "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270": {
    name: "Wrapped Matic",
    symbol: "WMATIC",
    address: "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270",
    decimals: 18,
    image: {
      small: "https://mint.club/assets/tokens/small/matic.png",
      large: "https://mint.club/assets/tokens/large/matic.png"
    }
  },
  "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619": {
    name: "Wrapped Ether",
    symbol: "WETH",
    address: "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619",
    decimals: 18,
    image: {
      small: "https://mint.club/assets/tokens/small/weth.png",
      large: "https://mint.club/assets/tokens/large/weth.png"
    }
  },
  "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174": {
    name: "USD Coin",
    symbol: "USDC",
    address: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
    decimals: 6,
    image: {
      small: "https://mint.club/assets/tokens/small/usdc.png",
      large: "https://mint.club/assets/tokens/large/usdc.png"
    }
  },
  "0xc2132D05D31c914a87C6611C10748AEb04B58e8F": {
    name: "Tether USD",
    symbol: "USDT",
    address: "0xc2132D05D31c914a87C6611C10748AEb04B58e8F",
    decimals: 6,
    image: {
      small: "https://mint.club/assets/tokens/small/usdt.png",
      large: "https://mint.club/assets/tokens/large/usdt.png"
    }
  },
  "0x1BFD67037B42Cf73acF2047067bd4F2C47D9BfD6": {
    name: "Wrapped BTC",
    symbol: "WBTC",
    address: "0x1BFD67037B42Cf73acF2047067bd4F2C47D9BfD6",
    decimals: 8,
    image: {
      small: "https://mint.club/assets/tokens/small/wbtc.png",
      large: "https://mint.club/assets/tokens/large/wbtc.png"
    }
  },
  "0x53E0bca35eC356BD5ddDFebbD1Fc0fD03FaBad39": {
    name: "ChainLink Token",
    symbol: "LINK",
    address: "0x53E0bca35eC356BD5ddDFebbD1Fc0fD03FaBad39",
    decimals: 18,
    image: {
      small: "https://mint.club/assets/tokens/small/link.png",
      large: "https://mint.club/assets/tokens/large/link.png"
    }
  },
  "0x45c32fA6DF82ead1e2EF74d17b76547EDdFaFF89": {
    name: "Frax",
    symbol: "FRAX",
    address: "0x45c32fA6DF82ead1e2EF74d17b76547EDdFaFF89",
    decimals: 18,
    image: {
      small: "https://mint.club/assets/tokens/small/frax.png",
      large: "https://mint.club/assets/tokens/large/frax.png"
    }
  },
  "0xb33EaAd8d922B1083446DC23f610c2567fB5180f": {
    name: "Uniswap",
    symbol: "UNI",
    address: "0xb33EaAd8d922B1083446DC23f610c2567fB5180f",
    decimals: 18,
    image: {
      small: "https://mint.club/assets/tokens/small/uni.png",
      large: "https://mint.club/assets/tokens/large/uni.png"
    }
  },
  "0xC3C7d422809852031b44ab29EEC9F1EfF2A58756": {
    name: "Lido DAO Token",
    symbol: "LDO",
    address: "0xC3C7d422809852031b44ab29EEC9F1EfF2A58756",
    decimals: 18,
    image: {
      small: "https://mint.club/assets/tokens/small/ldo.png",
      large: "https://mint.club/assets/tokens/large/ldo.png"
    }
  },
  "0x9c2C5fd7b07E95EE044DDeba0E97a665F142394f": {
    name: "1INCH Token",
    symbol: "1INCH",
    address: "0x9c2C5fd7b07E95EE044DDeba0E97a665F142394f",
    decimals: 18,
    image: {
      small: "https://mint.club/assets/tokens/small/1inch.svg",
      large: "https://mint.club/assets/tokens/large/1inch.svg"
    }
  },
  "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063": {
    name: "Dai Stablecoin",
    symbol: "DAI",
    address: "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063",
    decimals: 18,
    image: {
      small: "https://mint.club/assets/tokens/small/dai.png",
      large: "https://mint.club/assets/tokens/large/dai.png"
    }
  },
  "0xB7b31a6BC18e48888545CE79e83E06003bE70930": {
    name: "ApeCoin",
    symbol: "APE",
    address: "0xB7b31a6BC18e48888545CE79e83E06003bE70930",
    decimals: 18,
    image: {
      small: "https://mint.club/assets/tokens/small/ape.png",
      large: "https://mint.club/assets/tokens/large/ape.png"
    }
  },
  "0x6f8a06447Ff6FcF75d803135a7de15CE88C1d4ec": {
    name: "Shiba Inu",
    symbol: "SHIB",
    address: "0x6f8a06447Ff6FcF75d803135a7de15CE88C1d4ec",
    decimals: 18,
    image: {
      small: "https://mint.club/assets/tokens/small/shib.png",
      large: "https://mint.club/assets/tokens/large/shib.png"
    }
  },
  "0xD6DF932A45C0f255f85145f286eA0b292B21C90B": {
    name: "Aave Token",
    symbol: "AAVE",
    address: "0xD6DF932A45C0f255f85145f286eA0b292B21C90B",
    decimals: 18,
    image: {
      small: "https://mint.club/assets/tokens/small/aave.png",
      large: "https://mint.club/assets/tokens/large/aave.png"
    }
  },
  "0xBbba073C31bF03b8ACf7c28EF0738DeCF3695683": {
    name: "SAND",
    symbol: "SAND",
    address: "0xBbba073C31bF03b8ACf7c28EF0738DeCF3695683",
    decimals: 18,
    image: {
      small: "https://mint.club/assets/tokens/small/sandbox.png",
      large: "https://mint.club/assets/tokens/large/sandbox.png"
    }
  },
  "0x172370d5Cd63279eFa6d502DAB29171933a610AF": {
    name: "Curve DAO Token",
    symbol: "CRV",
    address: "0x172370d5Cd63279eFa6d502DAB29171933a610AF",
    decimals: 18,
    image: {
      small: "https://mint.club/assets/tokens/small/curve.png",
      large: "https://mint.club/assets/tokens/large/curve.png"
    }
  },
  "0x61299774020dA444Af134c82fa83E3810b309991": {
    name: "Render Token",
    symbol: "RNDR",
    address: "0x61299774020dA444Af134c82fa83E3810b309991",
    decimals: 18,
    image: {
      small: "https://assets.coingecko.com/coins/images/11636/small/rndr.png",
      large: "https://assets.coingecko.com/coins/images/11636/large/rndr.png"
    }
  },
  "0xE0B52e49357Fd4DAf2c15e02058DCE6BC0057db4": {
    name: "agEUR",
    symbol: "agEUR",
    address: "0xE0B52e49357Fd4DAf2c15e02058DCE6BC0057db4",
    decimals: 18,
    image: {
      small: "https://mint.club/assets/tokens/small/ageur.png",
      large: "https://mint.club/assets/tokens/large/ageur.png"
    }
  },
  "0x50B728D8D964fd00C2d0AAD81718b71311feF68a": {
    name: "Synthetix Network Token",
    symbol: "SNX",
    address: "0x50B728D8D964fd00C2d0AAD81718b71311feF68a",
    decimals: 18,
    image: {
      small: "https://assets.coingecko.com/coins/images/3406/small/SNX.png",
      large: "https://assets.coingecko.com/coins/images/3406/large/SNX.png"
    }
  }
};

const SEPOLIA_TOKENS = {
  "0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14": {
    name: "Wrapped Ether",
    symbol: "WETH",
    address: "0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14",
    decimals: 18,
    image: {
      small: "https://mint.club/assets/tokens/small/weth.png",
      large: "https://mint.club/assets/tokens/large/weth.png"
    }
  }
};

const COINGECKO_NETWORK_IDS = {
  [mainnet.id]: "ethereum",
  [optimism.id]: "optimistic-ethereum",
  [arbitrum.id]: "arbitrum-one",
  [avalanche.id]: "avalanche",
  [base.id]: "base",
  [polygon.id]: "polygon-pos",
  [bsc.id]: "binance-smart-chain",
  [sepolia.id]: "ethereum"
  // sepolia not supported by coingecko API
};
const WRAPPED_NATIVE_TOKENS = {
  [mainnet.id]: {
    image: "https://mint.club/assets/tokens/large/eth.png",
    tokenAddress: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
    nativeSymbol: "ETH",
    oneInchSymbol: "USDT",
    decimals: 18
  },
  [optimism.id]: {
    image: "https://mint.club/assets/tokens/large/eth.png",
    tokenAddress: "0x4200000000000000000000000000000000000006",
    nativeSymbol: "ETH",
    oneInchSymbol: "USDT",
    decimals: 18
  },
  [arbitrum.id]: {
    image: "https://mint.club/assets/tokens/large/eth.png",
    tokenAddress: "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1",
    nativeSymbol: "ETH",
    oneInchSymbol: "USDT",
    decimals: 18
  },
  [avalanche.id]: {
    image: "https://mint.club/assets/tokens/large/avalanche.png",
    tokenAddress: "0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7",
    nativeSymbol: "AVAX",
    oneInchSymbol: "USDT",
    decimals: 18
  },
  [polygon.id]: {
    image: "https://mint.club/assets/tokens/large/matic.png",
    tokenAddress: "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270",
    nativeSymbol: "MATIC",
    oneInchSymbol: "USDT",
    decimals: 18
  },
  [bsc.id]: {
    image: "https://mint.club/assets/tokens/large/bnb.png",
    tokenAddress: "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c",
    nativeSymbol: "BNB",
    oneInchSymbol: "USDT",
    decimals: 18
  },
  [base.id]: {
    image: "https://mint.club/assets/tokens/large/eth.png",
    tokenAddress: "0x4200000000000000000000000000000000000006",
    nativeSymbol: "ETH",
    oneInchSymbol: "USDbC",
    decimals: 18
  },
  [sepolia.id]: {
    image: "https://mint.club/assets/tokens/large/eth.png",
    tokenAddress: "0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14",
    nativeSymbol: "ETH",
    oneInchSymbol: "USDT",
    decimals: 18
  }
};
const TOKENS = {
  // export const TOKENS = {
  [mainnet.id]: MAINNET_TOKENS,
  [optimism.id]: OPTIMISM_TOKENS,
  [arbitrum.id]: ARBITRUM_TOKENS,
  [avalanche.id]: AVALANCHE_TOKENS,
  [polygon.id]: POLYGON_TOKENS,
  [bsc.id]: BSC_TOKENS,
  [base.id]: BASE_TOKENS,
  [sepolia.id]: SEPOLIA_TOKENS
};

const CONTRACT_ADDRESSES = {
  ERC20: {
    [mainnet.id]: "0xAa70bC79fD1cB4a6FBA717018351F0C3c64B79Df",
    [optimism.id]: "0xAa70bC79fD1cB4a6FBA717018351F0C3c64B79Df",
    [arbitrum.id]: "0xAa70bC79fD1cB4a6FBA717018351F0C3c64B79Df",
    [avalanche.id]: "0x5DaE94e149CF2112Ec625D46670047814aA9aC2a",
    [polygon.id]: "0xAa70bC79fD1cB4a6FBA717018351F0C3c64B79Df",
    [bsc.id]: "0xAa70bC79fD1cB4a6FBA717018351F0C3c64B79Df",
    [base.id]: "0xAa70bC79fD1cB4a6FBA717018351F0C3c64B79Df",
    [sepolia.id]: "0x749bA94344521727f55a3007c777FbeB5F52C2Eb"
  },
  ERC1155: {
    [mainnet.id]: "0x6c61918eECcC306D35247338FDcf025af0f6120A",
    [optimism.id]: "0x6c61918eECcC306D35247338FDcf025af0f6120A",
    [arbitrum.id]: "0x6c61918eECcC306D35247338FDcf025af0f6120A",
    [avalanche.id]: "0x621c335b4BD8f2165E120DC70d3AfcAfc6628681",
    [polygon.id]: "0x6c61918eECcC306D35247338FDcf025af0f6120A",
    [bsc.id]: "0x6c61918eECcC306D35247338FDcf025af0f6120A",
    [base.id]: "0x6c61918eECcC306D35247338FDcf025af0f6120A",
    [sepolia.id]: "0x3cABE5125C5D8922c5f38c5b779F6E96F563cdc0"
  },
  BOND: {
    [mainnet.id]: "0xc5a076cad94176c2996B32d8466Be1cE757FAa27",
    [optimism.id]: "0xc5a076cad94176c2996B32d8466Be1cE757FAa27",
    [arbitrum.id]: "0xc5a076cad94176c2996B32d8466Be1cE757FAa27",
    [avalanche.id]: "0x3Fd5B4DcDa968C8e22898523f5343177F94ccfd1",
    [polygon.id]: "0xc5a076cad94176c2996B32d8466Be1cE757FAa27",
    [bsc.id]: "0xc5a076cad94176c2996B32d8466Be1cE757FAa27",
    [base.id]: "0xc5a076cad94176c2996B32d8466Be1cE757FAa27",
    [sepolia.id]: "0x8dce343A86Aa950d539eeE0e166AFfd0Ef515C0c"
  },
  ZAP: {
    [mainnet.id]: "0x91523b39813F3F4E406ECe406D0bEAaA9dE251fa",
    [optimism.id]: "0x91523b39813F3F4E406ECe406D0bEAaA9dE251fa",
    [arbitrum.id]: "0x91523b39813F3F4E406ECe406D0bEAaA9dE251fa",
    [avalanche.id]: "0x29b0E6D2C2884aEa3FB4CB5dD1C7002A8E10c724",
    [polygon.id]: "0x91523b39813F3F4E406ECe406D0bEAaA9dE251fa",
    [bsc.id]: "0x91523b39813F3F4E406ECe406D0bEAaA9dE251fa",
    [base.id]: "0x91523b39813F3F4E406ECe406D0bEAaA9dE251fa",
    [sepolia.id]: "0x1Bf3183acc57571BecAea0E238d6C3A4d00633da"
  },
  LOCKER: {
    [mainnet.id]: "0xA3dCf3Ca587D9929d540868c924f208726DC9aB6",
    [optimism.id]: "0xA3dCf3Ca587D9929d540868c924f208726DC9aB6",
    [arbitrum.id]: "0xA3dCf3Ca587D9929d540868c924f208726DC9aB6",
    [avalanche.id]: "0x5b64cECC5cF3E4B1A668Abd895D16BdDC0c77a17",
    [polygon.id]: "0xA3dCf3Ca587D9929d540868c924f208726DC9aB6",
    [bsc.id]: "0xA3dCf3Ca587D9929d540868c924f208726DC9aB6",
    [base.id]: "0xA3dCf3Ca587D9929d540868c924f208726DC9aB6",
    [sepolia.id]: "0x7c204B1B03A88D24088941068f6DFC809f2fd022"
  },
  MERKLE: {
    [mainnet.id]: "0x1349A9DdEe26Fe16D0D44E35B3CB9B0CA18213a4",
    [optimism.id]: "0x1349A9DdEe26Fe16D0D44E35B3CB9B0CA18213a4",
    [arbitrum.id]: "0x1349A9DdEe26Fe16D0D44E35B3CB9B0CA18213a4",
    [avalanche.id]: "0x841A2bD2fc97DCB865b4Ddb352540148Bad2dB09",
    [polygon.id]: "0x1349A9DdEe26Fe16D0D44E35B3CB9B0CA18213a4",
    [bsc.id]: "0x1349A9DdEe26Fe16D0D44E35B3CB9B0CA18213a4",
    [base.id]: "0x1349A9DdEe26Fe16D0D44E35B3CB9B0CA18213a4",
    [sepolia.id]: "0x0CD940395566d509168977Cf10E5296302efA57A"
  },
  ONEINCH: {
    [mainnet.id]: "0x0AdDd25a91563696D8567Df78D5A01C9a991F9B8",
    [optimism.id]: "0x0AdDd25a91563696D8567Df78D5A01C9a991F9B8",
    [arbitrum.id]: "0x0AdDd25a91563696D8567Df78D5A01C9a991F9B8",
    [avalanche.id]: "0x0AdDd25a91563696D8567Df78D5A01C9a991F9B8",
    [polygon.id]: "0x0AdDd25a91563696D8567Df78D5A01C9a991F9B8",
    [bsc.id]: "0x0AdDd25a91563696D8567Df78D5A01C9a991F9B8",
    [base.id]: "0x0AdDd25a91563696D8567Df78D5A01C9a991F9B8",
    [sepolia.id]: "0x"
  }
};

const CHAINS$1 = [
  {
    id: mainnet.id,
    name: "Ethereum",
    icon: "https://mint.club/assets/networks/ethereum@2x.png",
    color: "#627EEA",
    openseaSlug: "ethereum",
    enabled: isAddress(CONTRACT_ADDRESSES.BOND[mainnet.id])
  },
  {
    id: base.id,
    name: "Base",
    icon: "https://mint.club/assets/networks/base@2x.png",
    color: "#0052FF",
    openseaSlug: "base",
    enabled: isAddress(CONTRACT_ADDRESSES.BOND[base.id])
  },
  {
    id: optimism.id,
    name: "Optimism",
    icon: "https://mint.club/assets/networks/optimism@2x.png",
    color: "#FF0420",
    openseaSlug: "optimism",
    enabled: isAddress(CONTRACT_ADDRESSES.BOND[optimism.id])
  },
  {
    id: arbitrum.id,
    name: "Arbitrum",
    icon: "https://mint.club/assets/networks/arbitrum@2x.png",
    color: "#12AAFF",
    openseaSlug: "arbitrum",
    enabled: isAddress(CONTRACT_ADDRESSES.BOND[arbitrum.id])
  },
  {
    id: avalanche.id,
    name: "Avalanche",
    icon: "https://mint.club/assets/networks/avalanche@2x.png",
    color: "#E94143",
    openseaSlug: "avalanche",
    enabled: isAddress(CONTRACT_ADDRESSES.BOND[arbitrum.id])
  },
  {
    id: polygon.id,
    name: "Polygon",
    icon: "https://mint.club/assets/networks/polygon@2x.png",
    color: "#8247E5",
    openseaSlug: "matic",
    enabled: isAddress(CONTRACT_ADDRESSES.BOND[polygon.id])
  },
  {
    id: bsc.id,
    name: "BNBChain",
    icon: "https://mint.club/assets/networks/bnb@2x.png",
    color: "#F0B90B",
    openseaSlug: "bsc",
    enabled: isAddress(CONTRACT_ADDRESSES.BOND[bsc.id])
  },
  {
    id: sepolia.id,
    name: "Sepolia",
    icon: "https://mint.club/assets/networks/ethereum@2x.png",
    color: "#627EEA",
    openseaSlug: "sepolia",
    enabled: isAddress(CONTRACT_ADDRESSES.BOND[sepolia.id]),
    isTestnet: true
  }
];
function chainStringToId(name) {
  if (!name)
    return;
  const found = CHAINS$1.find((chain) => chain.name?.toLowerCase() === name.toLowerCase());
  return found?.id;
}
const CHAIN_MAP = CHAINS$1.reduce((prev, curr) => {
  prev[curr.id] = curr;
  return prev;
}, {});
({
  sepolia: sepolia.id
});

function handleScientificNotation(num) {
  if (num === void 0 || num === null)
    return "";
  const str = num?.toString();
  if (str?.includes("e")) {
    const [coefficient, exponent] = str.split("e");
    const decimalCount = countDecimals(Number(coefficient));
    const exponentValue = parseInt(exponent, 10);
    if (exponentValue >= 0) {
      const result = Number(num).toLocaleString();
      return result;
    } else {
      const result = Number(num).toFixed(Math.abs(exponentValue) + decimalCount);
      return result;
    }
  }
  return str;
}
function countDecimals(value) {
  const numStr = handleScientificNotation(value?.toString());
  return numStr?.split(".")?.[1]?.length || 0;
}

function restructureStepData(data) {
  if (!data)
    return [];
  const cloned = cloneDeep(data);
  for (let i = cloned.length - 1; i > 0; i--) {
    cloned[i].price = cloned[i - 1]?.price;
  }
  cloned.shift();
  return cloned;
}
function wei(num, decimals = 18) {
  const stringified = handleScientificNotation(num.toString());
  return parseUnits(stringified, decimals);
}

const CHAINS = [
  {
    id: mainnet.id,
    rpcs: [
      "https://rpc.ankr.com/eth",
      "https://endpoints.omniatech.io/v1/eth/mainnet/public",
      "https://ethereum.publicnode.com",
      "https://1rpc.io/eth",
      "https://rpc.builder0x69.io",
      "https://eth.drpc.org",
      "https://eth.merkle.io",
      "https://rpc.flashbots.net"
    ]
  },
  {
    id: base.id,
    rpcs: ["https://1rpc.io/base", "https://base.meowrpc.com", "https://base.publicnode.com", "https://base.drpc.org"]
  },
  {
    id: optimism.id,
    rpcs: [
      "https://1rpc.io/op",
      "https://optimism.publicnode.com",
      "https://optimism.drpc.org",
      "https://optimism.meowrpc.com"
    ]
  },
  {
    id: arbitrum.id,
    rpcs: [
      "https://arbitrum.llamarpc.com",
      "https://arb1.arbitrum.io/rpc",
      "https://endpoints.omniatech.io/v1/arbitrum/one/public",
      "https://arbitrum-one.publicnode.com",
      "https://arbitrum.meowrpc.com",
      "https://arbitrum.drpc.org"
    ]
  },
  {
    id: polygon.id,
    rpcs: [
      "https://1rpc.io/matic",
      "https://polygon-bor.publicnode.com",
      "https://polygon.drpc.org",
      "https://polygon.meowrpc.com"
    ]
  },
  {
    id: bsc.id,
    rpcs: [
      "https://bsc-dataseed.bnbchain.org",
      "https://bsc-dataseed1.bnbchain.org",
      "https://bsc-dataseed2.bnbchain.org",
      "https://bsc-dataseed3.bnbchain.org",
      "https://bsc-dataseed4.bnbchain.org",
      "https://1rpc.io/bnb",
      "https://bsc.publicnode.com",
      "https://bsc.meowrpc.com",
      "https://bsc.drpc.org"
    ]
  },
  {
    id: avalanche.id,
    rpcs: [
      "https://api.avax.network/ext/bc/C/rpc",
      "https://avalanche.public-rpc.com",
      "https://rpc.ankr.com/avalanche",
      "https://avalanche-c-chain.publicnode.com",
      "https://avax.meowrpc.com",
      "https://avalanche.drpc.org"
    ]
  },
  {
    id: sepolia.id,
    rpcs: ["https://eth-sepolia.g.alchemy.com/v2/q7Z7WPqq0Vl9p1B5_7l6g-mX6LaEwMsZ"]
  }
];
function chainRPCFallbacks(chainId, fetchOptions) {
  return CHAINS.find((chain) => chain.id === chainId)?.rpcs.map(
    (rpc) => http(rpc, {
      fetchOptions
    })
  ) || [
    http(void 0, {
      fetchOptions
    })
  ];
}

class GenericContractLogic {
  static instances = {};
  abi;
  contractType;
  chain;
  chainId;
  publicClient;
  walletClient;
  constructor(params) {
    const { chainId, type, abi, options } = params;
    const supported = CHAIN_MAP[chainId];
    if (!supported)
      throw new Error(`Chain ${chainId} not supported`);
    const chain = Object.values(chains).find((chain2) => chain2.id === chainId);
    if (!chain)
      throw new Error("Chain  not found");
    this.chain = chain;
    this.contractType = type;
    this.abi = abi;
    this.chainId = chainId;
    this.publicClient = createPublicClient({
      chain,
      transport: fallback(chainRPCFallbacks(chain.id), { rank: true }),
      ...options
    });
  }
  withConfig(options) {
    const chain = Object.values(chains).find((chain2) => chain2.id === this.chainId);
    if (!chain)
      throw new Error("Chain  not found");
    this.publicClient = createPublicClient({
      chain,
      transport: fallback(chainRPCFallbacks(this.chain.id), { rank: true }),
      ...options
    });
  }
  withPrivateKey(privateKey) {
    const account = privateKeyToAccount(privateKey);
    this.walletClient = createWalletClient({
      account,
      chain: this.chain,
      transport: http()
    });
    return this;
  }
  withAccount(account) {
    this.walletClient = createWalletClient({
      account,
      chain: this.chain,
      transport: custom(window.ethereum)
    });
    return this;
  }
  async withProvider(provider) {
    this.walletClient = createWalletClient({
      chain: this.chain,
      transport: custom(provider)
    });
    const [address] = await this.walletClient?.requestAddresses();
    this.walletClient = createWalletClient({
      account: address,
      chain: this.chain,
      transport: custom(provider)
    });
    return this;
  }
  async initializeWallet() {
    if (this.walletClient) {
      const [address] = await this.walletClient?.requestAddresses();
      this.walletClient = createWalletClient({
        account: address,
        chain: this.chain,
        transport: custom(this.walletClient.transport)
      });
      return;
    } else if (!window.ethereum) {
      throw new Error("No Ethereum provider found");
    } else {
      this.walletClient = createWalletClient({
        chain: this.chain,
        transport: custom(window.ethereum)
      });
      const [address] = await this.walletClient?.requestAddresses();
      this.walletClient = createWalletClient({
        account: address,
        chain: this.chain,
        transport: custom(window.ethereum)
      });
    }
  }
  static network(chainId, type, abi) {
    if (!this.instances[chainId]) {
      this.instances[chainId] = new this({
        chainId,
        type,
        abi
      });
    }
    return this.instances[chainId];
  }
  read(params) {
    const { functionName, args } = params;
    return this.publicClient.readContract({
      abi: this.abi,
      address: CONTRACT_ADDRESSES[this.contractType][this.chainId],
      functionName,
      ...args && { args }
    });
  }
  async write(params) {
    await this.initializeWallet();
    if (!this.walletClient?.account)
      throw new Error("No wallet client found");
    else if (this.walletClient.chain?.id !== this.chain.id) {
      await this.walletClient.switchChain({ id: this.chain.id }).catch(async () => {
        await this.walletClient?.addChain({ chain: this.chain });
      });
    }
    const { functionName, args, value, onError, onRequestSignature, onSigned, onSuccess } = params;
    const [account] = await this.walletClient.getAddresses();
    const simulationArgs = {
      account,
      chain: this.chain,
      abi: this.abi,
      address: CONTRACT_ADDRESSES[this.contractType][this.chainId],
      functionName,
      args,
      ...value && { value }
    };
    try {
      const { request } = await this.publicClient.simulateContract(simulationArgs);
      onRequestSignature?.();
      const tx = await this.walletClient.writeContract(request);
      onSigned?.(tx);
      const receipt = await this.publicClient.waitForTransactionReceipt({
        hash: tx
      });
      onSuccess?.(receipt);
      return receipt;
    } catch (e) {
      if (e) {
        Object.assign(e, { functionName, args, simulationArgs, value, account, walletClient: this.walletClient });
      }
      onError?.(e);
    }
  }
}

class BondContractLogic extends GenericContractLogic {
  generateCreateArgs(params) {
    const { tokenType, name, symbol, reserveToken, mintRoyalty, burnRoyalty, stepData } = params;
    const clonedStepData = restructureStepData(stepData);
    const stepRanges = clonedStepData.map(({ rangeTo }) => wei(rangeTo, tokenType === "ERC20" ? 18 : 0));
    const stepPrices = clonedStepData.map(({ price }) => wei(price, reserveToken.decimals));
    for (let i = 0; i < stepPrices.length; i++) {
      if (stepPrices[i] === stepPrices[i + 1]) {
        stepRanges.splice(i, 1);
        stepPrices.splice(i, 1);
        i--;
      }
    }
    if (!stepData || stepRanges.length === 0 || stepPrices.length === 0 || stepRanges.length !== stepPrices.length) {
      throw new Error("Invalid step data. Please check your curve");
    }
    const tokenParams = {
      name,
      symbol
    };
    const bondParams = {
      mintRoyalty: mintRoyalty * 100,
      burnRoyalty: burnRoyalty * 100,
      reserveToken: reserveToken.address,
      maxSupply: stepRanges[stepRanges.length - 1],
      stepRanges,
      stepPrices
    };
    return { tokenParams, bondParams };
  }
  async createToken(params) {
    const args = this.generateCreateArgs(params);
    const { onError, onRequestSignature, onSigned, onSuccess } = params;
    const fee = await this.read({
      functionName: "creationFee",
      args: []
    });
    return this.write({
      functionName: "createToken",
      args: [args.tokenParams, args.bondParams],
      value: fee,
      onError,
      onRequestSignature,
      onSigned,
      onSuccess
    });
  }
}

class GenericContract {
  contractType;
  abi;
  constructor(type) {
    this.contractType = type;
    if (type === "BOND") {
      this.abi = BOND_ABI;
    } else if (type === "ERC20") {
      this.abi = ERC20_ABI;
    } else if (type === "ERC1155") {
      this.abi = ERC1155_ABI;
    } else if (type === "LOCKER") {
      this.abi = LOCKER_ABI;
    } else if (type === "MERKLE") {
      this.abi = MERKLE_ABI;
    } else if (type === "ZAP") {
      this.abi = ZAP_ABI;
    } else if (type === "ONEINCH") {
      this.abi = ONEINCH_ABI;
    } else {
      throw new Error(`Contract type ${type} not supported`);
    }
  }
  network(id) {
    let chainId;
    if (typeof id === "string") {
      chainId = chainStringToId(id);
    } else {
      chainId = id;
    }
    if (!chainId) {
      throw new Error(`Chain ${id} not supported`);
    }
    let logicClass;
    if (this.contractType === "BOND") {
      logicClass = BondContractLogic.network(chainId, this.contractType, this.abi);
    }
    logicClass = GenericContractLogic.network(chainId, this.contractType, this.abi);
    return logicClass;
  }
}

const bondContract = new GenericContract("BOND");
const erc20Contract = new GenericContract("ERC20");
const erc1155Contract = new GenericContract("ERC1155");
const zapContract = new GenericContract("ZAP");
const merkleContract = new GenericContract("MERKLE");
const oneInchContract = new GenericContract("ONEINCH");
const abis = {
  BOND: BOND_ABI,
  ERC20: ERC20_ABI,
  ERC1155: ERC1155_ABI,
  LOCKER: LOCKER_ABI,
  MERKLE: MERKLE_ABI,
  ONEINCH: ONEINCH_ABI,
  ZAP: ZAP_ABI
};
const whitelistedTokens = TOKENS;
const errorMessages = CONTRACT_ERROR_MESSAGES;
const supportedChains = [
  "ethereum",
  "sepolia",
  "bnbchain",
  "polygon",
  "arbitrum",
  "optimism",
  "avalanche",
  "base"
];
const supportedChainsMap = {
  ethereum: 1,
  sepolia: 11155111,
  bnbchain: 56,
  polygon: 137,
  arbitrum: 42161,
  optimism: 10,
  avalanche: 43114,
  base: 8453
};

export { COINGECKO_NETWORK_IDS, CONTRACT_ADDRESSES, TOKENS, WRAPPED_NATIVE_TOKENS, abis, bondContract, erc1155Contract, erc20Contract, errorMessages, merkleContract, oneInchContract, supportedChains, supportedChainsMap, whitelistedTokens, zapContract };
