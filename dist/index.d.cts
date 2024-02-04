import { ExtractAbiErrorNames } from 'abitype';
import { PublicClientConfig, ContractFunctionName, ContractFunctionArgs, ReadContractReturnType, WaitForTransactionReceiptReturnType, Abi } from 'viem';

declare const BOND_ABI: readonly [{
    readonly inputs: readonly [{
        readonly internalType: "address";
        readonly name: "tokenImplementation";
        readonly type: "address";
    }, {
        readonly internalType: "address";
        readonly name: "multiTokenImplementation";
        readonly type: "address";
    }, {
        readonly internalType: "address";
        readonly name: "protocolBeneficiary_";
        readonly type: "address";
    }, {
        readonly internalType: "uint256";
        readonly name: "creationFee_";
        readonly type: "uint256";
    }, {
        readonly internalType: "uint256";
        readonly name: "maxSteps";
        readonly type: "uint256";
    }];
    readonly stateMutability: "nonpayable";
    readonly type: "constructor";
}, {
    readonly inputs: readonly [{
        readonly internalType: "address";
        readonly name: "target";
        readonly type: "address";
    }];
    readonly name: "AddressEmptyCode";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly internalType: "address";
        readonly name: "account";
        readonly type: "address";
    }];
    readonly name: "AddressInsufficientBalance";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "ERC1167FailedCreateClone";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "FailedInnerCall";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "MCV2_BOND__InvalidPaginationParameters";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "MCV2_Bond__CreationFeeTransactionFailed";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "MCV2_Bond__ExceedMaxSupply";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "MCV2_Bond__ExceedTotalSupply";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly internalType: "string";
        readonly name: "reason";
        readonly type: "string";
    }];
    readonly name: "MCV2_Bond__InvalidConstructorParams";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "MCV2_Bond__InvalidCreationFee";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "MCV2_Bond__InvalidCreatorAddress";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "MCV2_Bond__InvalidCurrentSupply";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "MCV2_Bond__InvalidReceiver";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly internalType: "string";
        readonly name: "reason";
        readonly type: "string";
    }];
    readonly name: "MCV2_Bond__InvalidReserveToken";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly internalType: "string";
        readonly name: "reason";
        readonly type: "string";
    }];
    readonly name: "MCV2_Bond__InvalidStepParams";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "MCV2_Bond__InvalidTokenAmount";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly internalType: "string";
        readonly name: "reason";
        readonly type: "string";
    }];
    readonly name: "MCV2_Bond__InvalidTokenCreationParams";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "MCV2_Bond__PermissionDenied";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "MCV2_Bond__SlippageLimitExceeded";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "MCV2_Bond__TokenNotFound";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "MCV2_Bond__TokenSymbolAlreadyExists";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "MCV2_Royalty__InvalidParams";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "MCV2_Royalty__NothingToClaim";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly internalType: "address";
        readonly name: "owner";
        readonly type: "address";
    }];
    readonly name: "OwnableInvalidOwner";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly internalType: "address";
        readonly name: "account";
        readonly type: "address";
    }];
    readonly name: "OwnableUnauthorizedAccount";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly internalType: "uint8";
        readonly name: "bits";
        readonly type: "uint8";
    }, {
        readonly internalType: "uint256";
        readonly name: "value";
        readonly type: "uint256";
    }];
    readonly name: "SafeCastOverflowedUintDowncast";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly internalType: "address";
        readonly name: "token";
        readonly type: "address";
    }];
    readonly name: "SafeERC20FailedOperation";
    readonly type: "error";
}, {
    readonly anonymous: false;
    readonly inputs: readonly [{
        readonly indexed: true;
        readonly internalType: "address";
        readonly name: "token";
        readonly type: "address";
    }, {
        readonly indexed: true;
        readonly internalType: "address";
        readonly name: "creator";
        readonly type: "address";
    }];
    readonly name: "BondCreatorUpdated";
    readonly type: "event";
}, {
    readonly anonymous: false;
    readonly inputs: readonly [{
        readonly indexed: true;
        readonly internalType: "address";
        readonly name: "token";
        readonly type: "address";
    }, {
        readonly indexed: true;
        readonly internalType: "address";
        readonly name: "user";
        readonly type: "address";
    }, {
        readonly indexed: false;
        readonly internalType: "address";
        readonly name: "receiver";
        readonly type: "address";
    }, {
        readonly indexed: false;
        readonly internalType: "uint256";
        readonly name: "amountBurned";
        readonly type: "uint256";
    }, {
        readonly indexed: true;
        readonly internalType: "address";
        readonly name: "reserveToken";
        readonly type: "address";
    }, {
        readonly indexed: false;
        readonly internalType: "uint256";
        readonly name: "refundAmount";
        readonly type: "uint256";
    }];
    readonly name: "Burn";
    readonly type: "event";
}, {
    readonly anonymous: false;
    readonly inputs: readonly [{
        readonly indexed: false;
        readonly internalType: "uint256";
        readonly name: "amount";
        readonly type: "uint256";
    }];
    readonly name: "CreationFeeUpdated";
    readonly type: "event";
}, {
    readonly anonymous: false;
    readonly inputs: readonly [{
        readonly indexed: true;
        readonly internalType: "address";
        readonly name: "token";
        readonly type: "address";
    }, {
        readonly indexed: true;
        readonly internalType: "address";
        readonly name: "user";
        readonly type: "address";
    }, {
        readonly indexed: false;
        readonly internalType: "address";
        readonly name: "receiver";
        readonly type: "address";
    }, {
        readonly indexed: false;
        readonly internalType: "uint256";
        readonly name: "amountMinted";
        readonly type: "uint256";
    }, {
        readonly indexed: true;
        readonly internalType: "address";
        readonly name: "reserveToken";
        readonly type: "address";
    }, {
        readonly indexed: false;
        readonly internalType: "uint256";
        readonly name: "reserveAmount";
        readonly type: "uint256";
    }];
    readonly name: "Mint";
    readonly type: "event";
}, {
    readonly anonymous: false;
    readonly inputs: readonly [{
        readonly indexed: true;
        readonly internalType: "address";
        readonly name: "token";
        readonly type: "address";
    }, {
        readonly indexed: false;
        readonly internalType: "string";
        readonly name: "name";
        readonly type: "string";
    }, {
        readonly indexed: false;
        readonly internalType: "string";
        readonly name: "symbol";
        readonly type: "string";
    }, {
        readonly indexed: false;
        readonly internalType: "string";
        readonly name: "uri";
        readonly type: "string";
    }, {
        readonly indexed: true;
        readonly internalType: "address";
        readonly name: "reserveToken";
        readonly type: "address";
    }];
    readonly name: "MultiTokenCreated";
    readonly type: "event";
}, {
    readonly anonymous: false;
    readonly inputs: readonly [{
        readonly indexed: true;
        readonly internalType: "address";
        readonly name: "previousOwner";
        readonly type: "address";
    }, {
        readonly indexed: true;
        readonly internalType: "address";
        readonly name: "newOwner";
        readonly type: "address";
    }];
    readonly name: "OwnershipTransferred";
    readonly type: "event";
}, {
    readonly anonymous: false;
    readonly inputs: readonly [{
        readonly indexed: false;
        readonly internalType: "address";
        readonly name: "protocolBeneficiary";
        readonly type: "address";
    }];
    readonly name: "ProtocolBeneficiaryUpdated";
    readonly type: "event";
}, {
    readonly anonymous: false;
    readonly inputs: readonly [{
        readonly indexed: true;
        readonly internalType: "address";
        readonly name: "user";
        readonly type: "address";
    }, {
        readonly indexed: false;
        readonly internalType: "address";
        readonly name: "reserveToken";
        readonly type: "address";
    }, {
        readonly indexed: false;
        readonly internalType: "uint256";
        readonly name: "amount";
        readonly type: "uint256";
    }];
    readonly name: "RoyaltyClaimed";
    readonly type: "event";
}, {
    readonly anonymous: false;
    readonly inputs: readonly [{
        readonly indexed: false;
        readonly internalType: "uint256";
        readonly name: "ratio";
        readonly type: "uint256";
    }];
    readonly name: "RoyaltyRangeUpdated";
    readonly type: "event";
}, {
    readonly anonymous: false;
    readonly inputs: readonly [{
        readonly indexed: true;
        readonly internalType: "address";
        readonly name: "token";
        readonly type: "address";
    }, {
        readonly indexed: false;
        readonly internalType: "string";
        readonly name: "name";
        readonly type: "string";
    }, {
        readonly indexed: false;
        readonly internalType: "string";
        readonly name: "symbol";
        readonly type: "string";
    }, {
        readonly indexed: true;
        readonly internalType: "address";
        readonly name: "reserveToken";
        readonly type: "address";
    }];
    readonly name: "TokenCreated";
    readonly type: "event";
}, {
    readonly inputs: readonly [];
    readonly name: "BURN_ADDRESS";
    readonly outputs: readonly [{
        readonly internalType: "address";
        readonly name: "";
        readonly type: "address";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "address";
        readonly name: "token";
        readonly type: "address";
    }, {
        readonly internalType: "uint256";
        readonly name: "tokensToBurn";
        readonly type: "uint256";
    }, {
        readonly internalType: "uint256";
        readonly name: "minRefund";
        readonly type: "uint256";
    }, {
        readonly internalType: "address";
        readonly name: "receiver";
        readonly type: "address";
    }];
    readonly name: "burn";
    readonly outputs: readonly [{
        readonly internalType: "uint256";
        readonly name: "";
        readonly type: "uint256";
    }];
    readonly stateMutability: "nonpayable";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "address";
        readonly name: "reserveToken";
        readonly type: "address";
    }];
    readonly name: "burnRoyalties";
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "address";
        readonly name: "reserveToken";
        readonly type: "address";
    }];
    readonly name: "claimRoyalties";
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly components: readonly [{
            readonly internalType: "string";
            readonly name: "name";
            readonly type: "string";
        }, {
            readonly internalType: "string";
            readonly name: "symbol";
            readonly type: "string";
        }, {
            readonly internalType: "string";
            readonly name: "uri";
            readonly type: "string";
        }];
        readonly internalType: "struct MCV2_Bond.MultiTokenParams";
        readonly name: "tp";
        readonly type: "tuple";
    }, {
        readonly components: readonly [{
            readonly internalType: "uint16";
            readonly name: "mintRoyalty";
            readonly type: "uint16";
        }, {
            readonly internalType: "uint16";
            readonly name: "burnRoyalty";
            readonly type: "uint16";
        }, {
            readonly internalType: "address";
            readonly name: "reserveToken";
            readonly type: "address";
        }, {
            readonly internalType: "uint128";
            readonly name: "maxSupply";
            readonly type: "uint128";
        }, {
            readonly internalType: "uint128[]";
            readonly name: "stepRanges";
            readonly type: "uint128[]";
        }, {
            readonly internalType: "uint128[]";
            readonly name: "stepPrices";
            readonly type: "uint128[]";
        }];
        readonly internalType: "struct MCV2_Bond.BondParams";
        readonly name: "bp";
        readonly type: "tuple";
    }];
    readonly name: "createMultiToken";
    readonly outputs: readonly [{
        readonly internalType: "address";
        readonly name: "";
        readonly type: "address";
    }];
    readonly stateMutability: "payable";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly components: readonly [{
            readonly internalType: "string";
            readonly name: "name";
            readonly type: "string";
        }, {
            readonly internalType: "string";
            readonly name: "symbol";
            readonly type: "string";
        }];
        readonly internalType: "struct MCV2_Bond.TokenParams";
        readonly name: "tp";
        readonly type: "tuple";
    }, {
        readonly components: readonly [{
            readonly internalType: "uint16";
            readonly name: "mintRoyalty";
            readonly type: "uint16";
        }, {
            readonly internalType: "uint16";
            readonly name: "burnRoyalty";
            readonly type: "uint16";
        }, {
            readonly internalType: "address";
            readonly name: "reserveToken";
            readonly type: "address";
        }, {
            readonly internalType: "uint128";
            readonly name: "maxSupply";
            readonly type: "uint128";
        }, {
            readonly internalType: "uint128[]";
            readonly name: "stepRanges";
            readonly type: "uint128[]";
        }, {
            readonly internalType: "uint128[]";
            readonly name: "stepPrices";
            readonly type: "uint128[]";
        }];
        readonly internalType: "struct MCV2_Bond.BondParams";
        readonly name: "bp";
        readonly type: "tuple";
    }];
    readonly name: "createToken";
    readonly outputs: readonly [{
        readonly internalType: "address";
        readonly name: "";
        readonly type: "address";
    }];
    readonly stateMutability: "payable";
    readonly type: "function";
}, {
    readonly inputs: readonly [];
    readonly name: "creationFee";
    readonly outputs: readonly [{
        readonly internalType: "uint256";
        readonly name: "";
        readonly type: "uint256";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "address";
        readonly name: "token";
        readonly type: "address";
    }];
    readonly name: "exists";
    readonly outputs: readonly [{
        readonly internalType: "bool";
        readonly name: "";
        readonly type: "bool";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "address";
        readonly name: "token";
        readonly type: "address";
    }];
    readonly name: "getDetail";
    readonly outputs: readonly [{
        readonly components: readonly [{
            readonly internalType: "uint16";
            readonly name: "mintRoyalty";
            readonly type: "uint16";
        }, {
            readonly internalType: "uint16";
            readonly name: "burnRoyalty";
            readonly type: "uint16";
        }, {
            readonly components: readonly [{
                readonly internalType: "address";
                readonly name: "creator";
                readonly type: "address";
            }, {
                readonly internalType: "address";
                readonly name: "token";
                readonly type: "address";
            }, {
                readonly internalType: "uint8";
                readonly name: "decimals";
                readonly type: "uint8";
            }, {
                readonly internalType: "string";
                readonly name: "symbol";
                readonly type: "string";
            }, {
                readonly internalType: "string";
                readonly name: "name";
                readonly type: "string";
            }, {
                readonly internalType: "uint40";
                readonly name: "createdAt";
                readonly type: "uint40";
            }, {
                readonly internalType: "uint128";
                readonly name: "currentSupply";
                readonly type: "uint128";
            }, {
                readonly internalType: "uint128";
                readonly name: "maxSupply";
                readonly type: "uint128";
            }, {
                readonly internalType: "uint128";
                readonly name: "priceForNextMint";
                readonly type: "uint128";
            }, {
                readonly internalType: "address";
                readonly name: "reserveToken";
                readonly type: "address";
            }, {
                readonly internalType: "uint8";
                readonly name: "reserveDecimals";
                readonly type: "uint8";
            }, {
                readonly internalType: "string";
                readonly name: "reserveSymbol";
                readonly type: "string";
            }, {
                readonly internalType: "string";
                readonly name: "reserveName";
                readonly type: "string";
            }, {
                readonly internalType: "uint256";
                readonly name: "reserveBalance";
                readonly type: "uint256";
            }];
            readonly internalType: "struct MCV2_Bond.BondInfo";
            readonly name: "info";
            readonly type: "tuple";
        }, {
            readonly components: readonly [{
                readonly internalType: "uint128";
                readonly name: "rangeTo";
                readonly type: "uint128";
            }, {
                readonly internalType: "uint128";
                readonly name: "price";
                readonly type: "uint128";
            }];
            readonly internalType: "struct MCV2_Bond.BondStep[]";
            readonly name: "steps";
            readonly type: "tuple[]";
        }];
        readonly internalType: "struct MCV2_Bond.BondDetail";
        readonly name: "detail";
        readonly type: "tuple";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "uint256";
        readonly name: "start";
        readonly type: "uint256";
    }, {
        readonly internalType: "uint256";
        readonly name: "stop";
        readonly type: "uint256";
    }];
    readonly name: "getList";
    readonly outputs: readonly [{
        readonly components: readonly [{
            readonly internalType: "address";
            readonly name: "creator";
            readonly type: "address";
        }, {
            readonly internalType: "address";
            readonly name: "token";
            readonly type: "address";
        }, {
            readonly internalType: "uint8";
            readonly name: "decimals";
            readonly type: "uint8";
        }, {
            readonly internalType: "string";
            readonly name: "symbol";
            readonly type: "string";
        }, {
            readonly internalType: "string";
            readonly name: "name";
            readonly type: "string";
        }, {
            readonly internalType: "uint40";
            readonly name: "createdAt";
            readonly type: "uint40";
        }, {
            readonly internalType: "uint128";
            readonly name: "currentSupply";
            readonly type: "uint128";
        }, {
            readonly internalType: "uint128";
            readonly name: "maxSupply";
            readonly type: "uint128";
        }, {
            readonly internalType: "uint128";
            readonly name: "priceForNextMint";
            readonly type: "uint128";
        }, {
            readonly internalType: "address";
            readonly name: "reserveToken";
            readonly type: "address";
        }, {
            readonly internalType: "uint8";
            readonly name: "reserveDecimals";
            readonly type: "uint8";
        }, {
            readonly internalType: "string";
            readonly name: "reserveSymbol";
            readonly type: "string";
        }, {
            readonly internalType: "string";
            readonly name: "reserveName";
            readonly type: "string";
        }, {
            readonly internalType: "uint256";
            readonly name: "reserveBalance";
            readonly type: "uint256";
        }];
        readonly internalType: "struct MCV2_Bond.BondInfo[]";
        readonly name: "info";
        readonly type: "tuple[]";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "address";
        readonly name: "token";
        readonly type: "address";
    }, {
        readonly internalType: "uint256";
        readonly name: "tokensToBurn";
        readonly type: "uint256";
    }];
    readonly name: "getRefundForTokens";
    readonly outputs: readonly [{
        readonly internalType: "uint256";
        readonly name: "refundAmount";
        readonly type: "uint256";
    }, {
        readonly internalType: "uint256";
        readonly name: "royalty";
        readonly type: "uint256";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "address";
        readonly name: "token";
        readonly type: "address";
    }, {
        readonly internalType: "uint256";
        readonly name: "tokensToMint";
        readonly type: "uint256";
    }];
    readonly name: "getReserveForToken";
    readonly outputs: readonly [{
        readonly internalType: "uint256";
        readonly name: "reserveAmount";
        readonly type: "uint256";
    }, {
        readonly internalType: "uint256";
        readonly name: "royalty";
        readonly type: "uint256";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "address";
        readonly name: "wallet";
        readonly type: "address";
    }, {
        readonly internalType: "address";
        readonly name: "reserveToken";
        readonly type: "address";
    }];
    readonly name: "getRoyaltyInfo";
    readonly outputs: readonly [{
        readonly internalType: "uint256";
        readonly name: "";
        readonly type: "uint256";
    }, {
        readonly internalType: "uint256";
        readonly name: "";
        readonly type: "uint256";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "address";
        readonly name: "token";
        readonly type: "address";
    }];
    readonly name: "getSteps";
    readonly outputs: readonly [{
        readonly components: readonly [{
            readonly internalType: "uint128";
            readonly name: "rangeTo";
            readonly type: "uint128";
        }, {
            readonly internalType: "uint128";
            readonly name: "price";
            readonly type: "uint128";
        }];
        readonly internalType: "struct MCV2_Bond.BondStep[]";
        readonly name: "";
        readonly type: "tuple[]";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "address";
        readonly name: "creator";
        readonly type: "address";
    }, {
        readonly internalType: "uint256";
        readonly name: "start";
        readonly type: "uint256";
    }, {
        readonly internalType: "uint256";
        readonly name: "stop";
        readonly type: "uint256";
    }];
    readonly name: "getTokensByCreator";
    readonly outputs: readonly [{
        readonly internalType: "address[]";
        readonly name: "addresses";
        readonly type: "address[]";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "address";
        readonly name: "reserveToken";
        readonly type: "address";
    }, {
        readonly internalType: "uint256";
        readonly name: "start";
        readonly type: "uint256";
    }, {
        readonly internalType: "uint256";
        readonly name: "stop";
        readonly type: "uint256";
    }];
    readonly name: "getTokensByReserveToken";
    readonly outputs: readonly [{
        readonly internalType: "address[]";
        readonly name: "addresses";
        readonly type: "address[]";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [];
    readonly name: "maxRoyaltyRange";
    readonly outputs: readonly [{
        readonly internalType: "uint256";
        readonly name: "";
        readonly type: "uint256";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "address";
        readonly name: "token";
        readonly type: "address";
    }];
    readonly name: "maxSupply";
    readonly outputs: readonly [{
        readonly internalType: "uint128";
        readonly name: "";
        readonly type: "uint128";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "address";
        readonly name: "token";
        readonly type: "address";
    }, {
        readonly internalType: "uint256";
        readonly name: "tokensToMint";
        readonly type: "uint256";
    }, {
        readonly internalType: "uint256";
        readonly name: "maxReserveAmount";
        readonly type: "uint256";
    }, {
        readonly internalType: "address";
        readonly name: "receiver";
        readonly type: "address";
    }];
    readonly name: "mint";
    readonly outputs: readonly [{
        readonly internalType: "uint256";
        readonly name: "";
        readonly type: "uint256";
    }];
    readonly stateMutability: "nonpayable";
    readonly type: "function";
}, {
    readonly inputs: readonly [];
    readonly name: "owner";
    readonly outputs: readonly [{
        readonly internalType: "address";
        readonly name: "";
        readonly type: "address";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "address";
        readonly name: "token";
        readonly type: "address";
    }];
    readonly name: "priceForNextMint";
    readonly outputs: readonly [{
        readonly internalType: "uint128";
        readonly name: "";
        readonly type: "uint128";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [];
    readonly name: "protocolBeneficiary";
    readonly outputs: readonly [{
        readonly internalType: "address";
        readonly name: "";
        readonly type: "address";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [];
    readonly name: "renounceOwnership";
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "address";
        readonly name: "";
        readonly type: "address";
    }];
    readonly name: "tokenBond";
    readonly outputs: readonly [{
        readonly internalType: "address";
        readonly name: "creator";
        readonly type: "address";
    }, {
        readonly internalType: "uint16";
        readonly name: "mintRoyalty";
        readonly type: "uint16";
    }, {
        readonly internalType: "uint16";
        readonly name: "burnRoyalty";
        readonly type: "uint16";
    }, {
        readonly internalType: "uint40";
        readonly name: "createdAt";
        readonly type: "uint40";
    }, {
        readonly internalType: "address";
        readonly name: "reserveToken";
        readonly type: "address";
    }, {
        readonly internalType: "uint256";
        readonly name: "reserveBalance";
        readonly type: "uint256";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [];
    readonly name: "tokenCount";
    readonly outputs: readonly [{
        readonly internalType: "uint256";
        readonly name: "";
        readonly type: "uint256";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "uint256";
        readonly name: "";
        readonly type: "uint256";
    }];
    readonly name: "tokens";
    readonly outputs: readonly [{
        readonly internalType: "address";
        readonly name: "";
        readonly type: "address";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "address";
        readonly name: "newOwner";
        readonly type: "address";
    }];
    readonly name: "transferOwnership";
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "address";
        readonly name: "token";
        readonly type: "address";
    }, {
        readonly internalType: "address";
        readonly name: "creator";
        readonly type: "address";
    }];
    readonly name: "updateBondCreator";
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "uint256";
        readonly name: "amount";
        readonly type: "uint256";
    }];
    readonly name: "updateCreationFee";
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "uint256";
        readonly name: "ratio";
        readonly type: "uint256";
    }];
    readonly name: "updateMaxRoyaltyRange";
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "address";
        readonly name: "protocolBeneficiary_";
        readonly type: "address";
    }];
    readonly name: "updateProtocolBeneficiary";
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "address";
        readonly name: "";
        readonly type: "address";
    }, {
        readonly internalType: "address";
        readonly name: "";
        readonly type: "address";
    }];
    readonly name: "userTokenRoyaltyBalance";
    readonly outputs: readonly [{
        readonly internalType: "uint256";
        readonly name: "";
        readonly type: "uint256";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "address";
        readonly name: "";
        readonly type: "address";
    }, {
        readonly internalType: "address";
        readonly name: "";
        readonly type: "address";
    }];
    readonly name: "userTokenRoyaltyClaimed";
    readonly outputs: readonly [{
        readonly internalType: "uint256";
        readonly name: "";
        readonly type: "uint256";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [];
    readonly name: "version";
    readonly outputs: readonly [{
        readonly internalType: "string";
        readonly name: "";
        readonly type: "string";
    }];
    readonly stateMutability: "pure";
    readonly type: "function";
}];

declare const ERC1155_ABI: readonly [{
    readonly inputs: readonly [{
        readonly internalType: "address";
        readonly name: "sender";
        readonly type: "address";
    }, {
        readonly internalType: "uint256";
        readonly name: "balance";
        readonly type: "uint256";
    }, {
        readonly internalType: "uint256";
        readonly name: "needed";
        readonly type: "uint256";
    }, {
        readonly internalType: "uint256";
        readonly name: "tokenId";
        readonly type: "uint256";
    }];
    readonly name: "ERC1155InsufficientBalance";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly internalType: "address";
        readonly name: "approver";
        readonly type: "address";
    }];
    readonly name: "ERC1155InvalidApprover";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly internalType: "uint256";
        readonly name: "idsLength";
        readonly type: "uint256";
    }, {
        readonly internalType: "uint256";
        readonly name: "valuesLength";
        readonly type: "uint256";
    }];
    readonly name: "ERC1155InvalidArrayLength";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly internalType: "address";
        readonly name: "operator";
        readonly type: "address";
    }];
    readonly name: "ERC1155InvalidOperator";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly internalType: "address";
        readonly name: "receiver";
        readonly type: "address";
    }];
    readonly name: "ERC1155InvalidReceiver";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly internalType: "address";
        readonly name: "sender";
        readonly type: "address";
    }];
    readonly name: "ERC1155InvalidSender";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly internalType: "address";
        readonly name: "operator";
        readonly type: "address";
    }, {
        readonly internalType: "address";
        readonly name: "owner";
        readonly type: "address";
    }];
    readonly name: "ERC1155MissingApprovalForAll";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "MCV2_MultiToken__AlreadyInitialized";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "MCV2_MultiToken__BurnAmountExceedsTotalSupply";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "MCV2_MultiToken__NotApproved";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "MCV2_MultiToken__PermissionDenied";
    readonly type: "error";
}, {
    readonly anonymous: false;
    readonly inputs: readonly [{
        readonly indexed: true;
        readonly internalType: "address";
        readonly name: "account";
        readonly type: "address";
    }, {
        readonly indexed: true;
        readonly internalType: "address";
        readonly name: "operator";
        readonly type: "address";
    }, {
        readonly indexed: false;
        readonly internalType: "bool";
        readonly name: "approved";
        readonly type: "bool";
    }];
    readonly name: "ApprovalForAll";
    readonly type: "event";
}, {
    readonly anonymous: false;
    readonly inputs: readonly [{
        readonly indexed: true;
        readonly internalType: "address";
        readonly name: "operator";
        readonly type: "address";
    }, {
        readonly indexed: true;
        readonly internalType: "address";
        readonly name: "from";
        readonly type: "address";
    }, {
        readonly indexed: true;
        readonly internalType: "address";
        readonly name: "to";
        readonly type: "address";
    }, {
        readonly indexed: false;
        readonly internalType: "uint256[]";
        readonly name: "ids";
        readonly type: "uint256[]";
    }, {
        readonly indexed: false;
        readonly internalType: "uint256[]";
        readonly name: "values";
        readonly type: "uint256[]";
    }];
    readonly name: "TransferBatch";
    readonly type: "event";
}, {
    readonly anonymous: false;
    readonly inputs: readonly [{
        readonly indexed: true;
        readonly internalType: "address";
        readonly name: "operator";
        readonly type: "address";
    }, {
        readonly indexed: true;
        readonly internalType: "address";
        readonly name: "from";
        readonly type: "address";
    }, {
        readonly indexed: true;
        readonly internalType: "address";
        readonly name: "to";
        readonly type: "address";
    }, {
        readonly indexed: false;
        readonly internalType: "uint256";
        readonly name: "id";
        readonly type: "uint256";
    }, {
        readonly indexed: false;
        readonly internalType: "uint256";
        readonly name: "value";
        readonly type: "uint256";
    }];
    readonly name: "TransferSingle";
    readonly type: "event";
}, {
    readonly anonymous: false;
    readonly inputs: readonly [{
        readonly indexed: false;
        readonly internalType: "string";
        readonly name: "value";
        readonly type: "string";
    }, {
        readonly indexed: true;
        readonly internalType: "uint256";
        readonly name: "id";
        readonly type: "uint256";
    }];
    readonly name: "URI";
    readonly type: "event";
}, {
    readonly inputs: readonly [{
        readonly internalType: "address";
        readonly name: "account";
        readonly type: "address";
    }, {
        readonly internalType: "uint256";
        readonly name: "id";
        readonly type: "uint256";
    }];
    readonly name: "balanceOf";
    readonly outputs: readonly [{
        readonly internalType: "uint256";
        readonly name: "";
        readonly type: "uint256";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "address[]";
        readonly name: "accounts";
        readonly type: "address[]";
    }, {
        readonly internalType: "uint256[]";
        readonly name: "ids";
        readonly type: "uint256[]";
    }];
    readonly name: "balanceOfBatch";
    readonly outputs: readonly [{
        readonly internalType: "uint256[]";
        readonly name: "";
        readonly type: "uint256[]";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [];
    readonly name: "bond";
    readonly outputs: readonly [{
        readonly internalType: "address";
        readonly name: "";
        readonly type: "address";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "address";
        readonly name: "account";
        readonly type: "address";
    }, {
        readonly internalType: "uint256";
        readonly name: "amount";
        readonly type: "uint256";
    }];
    readonly name: "burnByBond";
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
    readonly type: "function";
}, {
    readonly inputs: readonly [];
    readonly name: "contractURI";
    readonly outputs: readonly [{
        readonly internalType: "string";
        readonly name: "";
        readonly type: "string";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [];
    readonly name: "decimals";
    readonly outputs: readonly [{
        readonly internalType: "uint8";
        readonly name: "";
        readonly type: "uint8";
    }];
    readonly stateMutability: "pure";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "string";
        readonly name: "name_";
        readonly type: "string";
    }, {
        readonly internalType: "string";
        readonly name: "symbol_";
        readonly type: "string";
    }, {
        readonly internalType: "string";
        readonly name: "uri_";
        readonly type: "string";
    }];
    readonly name: "init";
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "address";
        readonly name: "account";
        readonly type: "address";
    }, {
        readonly internalType: "address";
        readonly name: "operator";
        readonly type: "address";
    }];
    readonly name: "isApprovedForAll";
    readonly outputs: readonly [{
        readonly internalType: "bool";
        readonly name: "";
        readonly type: "bool";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "address";
        readonly name: "to";
        readonly type: "address";
    }, {
        readonly internalType: "uint256";
        readonly name: "amount";
        readonly type: "uint256";
    }];
    readonly name: "mintByBond";
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
    readonly type: "function";
}, {
    readonly inputs: readonly [];
    readonly name: "name";
    readonly outputs: readonly [{
        readonly internalType: "string";
        readonly name: "";
        readonly type: "string";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "address";
        readonly name: "from";
        readonly type: "address";
    }, {
        readonly internalType: "address";
        readonly name: "to";
        readonly type: "address";
    }, {
        readonly internalType: "uint256[]";
        readonly name: "ids";
        readonly type: "uint256[]";
    }, {
        readonly internalType: "uint256[]";
        readonly name: "values";
        readonly type: "uint256[]";
    }, {
        readonly internalType: "bytes";
        readonly name: "data";
        readonly type: "bytes";
    }];
    readonly name: "safeBatchTransferFrom";
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "address";
        readonly name: "from";
        readonly type: "address";
    }, {
        readonly internalType: "address";
        readonly name: "to";
        readonly type: "address";
    }, {
        readonly internalType: "uint256";
        readonly name: "id";
        readonly type: "uint256";
    }, {
        readonly internalType: "uint256";
        readonly name: "value";
        readonly type: "uint256";
    }, {
        readonly internalType: "bytes";
        readonly name: "data";
        readonly type: "bytes";
    }];
    readonly name: "safeTransferFrom";
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "address";
        readonly name: "operator";
        readonly type: "address";
    }, {
        readonly internalType: "bool";
        readonly name: "approved";
        readonly type: "bool";
    }];
    readonly name: "setApprovalForAll";
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "bytes4";
        readonly name: "interfaceId";
        readonly type: "bytes4";
    }];
    readonly name: "supportsInterface";
    readonly outputs: readonly [{
        readonly internalType: "bool";
        readonly name: "";
        readonly type: "bool";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [];
    readonly name: "symbol";
    readonly outputs: readonly [{
        readonly internalType: "string";
        readonly name: "";
        readonly type: "string";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [];
    readonly name: "totalSupply";
    readonly outputs: readonly [{
        readonly internalType: "uint256";
        readonly name: "";
        readonly type: "uint256";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "uint256";
        readonly name: "";
        readonly type: "uint256";
    }];
    readonly name: "uri";
    readonly outputs: readonly [{
        readonly internalType: "string";
        readonly name: "";
        readonly type: "string";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}];

declare const ERC20_ABI: readonly [{
    readonly inputs: readonly [{
        readonly internalType: "address";
        readonly name: "spender";
        readonly type: "address";
    }, {
        readonly internalType: "uint256";
        readonly name: "allowance";
        readonly type: "uint256";
    }, {
        readonly internalType: "uint256";
        readonly name: "needed";
        readonly type: "uint256";
    }];
    readonly name: "ERC20InsufficientAllowance";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly internalType: "address";
        readonly name: "sender";
        readonly type: "address";
    }, {
        readonly internalType: "uint256";
        readonly name: "balance";
        readonly type: "uint256";
    }, {
        readonly internalType: "uint256";
        readonly name: "needed";
        readonly type: "uint256";
    }];
    readonly name: "ERC20InsufficientBalance";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly internalType: "address";
        readonly name: "approver";
        readonly type: "address";
    }];
    readonly name: "ERC20InvalidApprover";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly internalType: "address";
        readonly name: "receiver";
        readonly type: "address";
    }];
    readonly name: "ERC20InvalidReceiver";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly internalType: "address";
        readonly name: "sender";
        readonly type: "address";
    }];
    readonly name: "ERC20InvalidSender";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly internalType: "address";
        readonly name: "spender";
        readonly type: "address";
    }];
    readonly name: "ERC20InvalidSpender";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "MCV2_Token__AlreadyInitialized";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "MCV2_Token__PermissionDenied";
    readonly type: "error";
}, {
    readonly anonymous: false;
    readonly inputs: readonly [{
        readonly indexed: true;
        readonly internalType: "address";
        readonly name: "owner";
        readonly type: "address";
    }, {
        readonly indexed: true;
        readonly internalType: "address";
        readonly name: "spender";
        readonly type: "address";
    }, {
        readonly indexed: false;
        readonly internalType: "uint256";
        readonly name: "value";
        readonly type: "uint256";
    }];
    readonly name: "Approval";
    readonly type: "event";
}, {
    readonly anonymous: false;
    readonly inputs: readonly [{
        readonly indexed: true;
        readonly internalType: "address";
        readonly name: "from";
        readonly type: "address";
    }, {
        readonly indexed: true;
        readonly internalType: "address";
        readonly name: "to";
        readonly type: "address";
    }, {
        readonly indexed: false;
        readonly internalType: "uint256";
        readonly name: "value";
        readonly type: "uint256";
    }];
    readonly name: "Transfer";
    readonly type: "event";
}, {
    readonly inputs: readonly [{
        readonly internalType: "address";
        readonly name: "owner";
        readonly type: "address";
    }, {
        readonly internalType: "address";
        readonly name: "spender";
        readonly type: "address";
    }];
    readonly name: "allowance";
    readonly outputs: readonly [{
        readonly internalType: "uint256";
        readonly name: "";
        readonly type: "uint256";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "address";
        readonly name: "spender";
        readonly type: "address";
    }, {
        readonly internalType: "uint256";
        readonly name: "value";
        readonly type: "uint256";
    }];
    readonly name: "approve";
    readonly outputs: readonly [{
        readonly internalType: "bool";
        readonly name: "";
        readonly type: "bool";
    }];
    readonly stateMutability: "nonpayable";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "address";
        readonly name: "account";
        readonly type: "address";
    }];
    readonly name: "balanceOf";
    readonly outputs: readonly [{
        readonly internalType: "uint256";
        readonly name: "";
        readonly type: "uint256";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [];
    readonly name: "bond";
    readonly outputs: readonly [{
        readonly internalType: "address";
        readonly name: "";
        readonly type: "address";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "address";
        readonly name: "account";
        readonly type: "address";
    }, {
        readonly internalType: "uint256";
        readonly name: "amount";
        readonly type: "uint256";
    }];
    readonly name: "burnByBond";
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
    readonly type: "function";
}, {
    readonly inputs: readonly [];
    readonly name: "decimals";
    readonly outputs: readonly [{
        readonly internalType: "uint8";
        readonly name: "";
        readonly type: "uint8";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "string";
        readonly name: "name_";
        readonly type: "string";
    }, {
        readonly internalType: "string";
        readonly name: "symbol_";
        readonly type: "string";
    }];
    readonly name: "init";
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "address";
        readonly name: "to";
        readonly type: "address";
    }, {
        readonly internalType: "uint256";
        readonly name: "amount";
        readonly type: "uint256";
    }];
    readonly name: "mintByBond";
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
    readonly type: "function";
}, {
    readonly inputs: readonly [];
    readonly name: "name";
    readonly outputs: readonly [{
        readonly internalType: "string";
        readonly name: "";
        readonly type: "string";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [];
    readonly name: "symbol";
    readonly outputs: readonly [{
        readonly internalType: "string";
        readonly name: "";
        readonly type: "string";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [];
    readonly name: "totalSupply";
    readonly outputs: readonly [{
        readonly internalType: "uint256";
        readonly name: "";
        readonly type: "uint256";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "address";
        readonly name: "to";
        readonly type: "address";
    }, {
        readonly internalType: "uint256";
        readonly name: "value";
        readonly type: "uint256";
    }];
    readonly name: "transfer";
    readonly outputs: readonly [{
        readonly internalType: "bool";
        readonly name: "";
        readonly type: "bool";
    }];
    readonly stateMutability: "nonpayable";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "address";
        readonly name: "from";
        readonly type: "address";
    }, {
        readonly internalType: "address";
        readonly name: "to";
        readonly type: "address";
    }, {
        readonly internalType: "uint256";
        readonly name: "value";
        readonly type: "uint256";
    }];
    readonly name: "transferFrom";
    readonly outputs: readonly [{
        readonly internalType: "bool";
        readonly name: "";
        readonly type: "bool";
    }];
    readonly stateMutability: "nonpayable";
    readonly type: "function";
}];

declare const LOCKER_ABI: readonly [{
    readonly inputs: readonly [{
        readonly internalType: "address";
        readonly name: "target";
        readonly type: "address";
    }];
    readonly name: "AddressEmptyCode";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly internalType: "address";
        readonly name: "account";
        readonly type: "address";
    }];
    readonly name: "AddressInsufficientBalance";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "FailedInnerCall";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "LockUp__AlreadyClaimed";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "LockUp__InvalidPaginationParameters";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly internalType: "string";
        readonly name: "param";
        readonly type: "string";
    }];
    readonly name: "LockUp__InvalidParams";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "LockUp__NotYetUnlocked";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "LockUp__PermissionDenied";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly internalType: "address";
        readonly name: "token";
        readonly type: "address";
    }];
    readonly name: "SafeERC20FailedOperation";
    readonly type: "error";
}, {
    readonly anonymous: false;
    readonly inputs: readonly [{
        readonly indexed: true;
        readonly internalType: "uint256";
        readonly name: "lockUpId";
        readonly type: "uint256";
    }, {
        readonly indexed: true;
        readonly internalType: "address";
        readonly name: "token";
        readonly type: "address";
    }, {
        readonly indexed: false;
        readonly internalType: "bool";
        readonly name: "isERC20";
        readonly type: "bool";
    }, {
        readonly indexed: true;
        readonly internalType: "address";
        readonly name: "receiver";
        readonly type: "address";
    }, {
        readonly indexed: false;
        readonly internalType: "uint256";
        readonly name: "amount";
        readonly type: "uint256";
    }, {
        readonly indexed: false;
        readonly internalType: "uint40";
        readonly name: "unlockTime";
        readonly type: "uint40";
    }];
    readonly name: "LockedUp";
    readonly type: "event";
}, {
    readonly anonymous: false;
    readonly inputs: readonly [{
        readonly indexed: true;
        readonly internalType: "uint256";
        readonly name: "lockUpId";
        readonly type: "uint256";
    }, {
        readonly indexed: true;
        readonly internalType: "address";
        readonly name: "token";
        readonly type: "address";
    }, {
        readonly indexed: false;
        readonly internalType: "bool";
        readonly name: "isERC20";
        readonly type: "bool";
    }, {
        readonly indexed: true;
        readonly internalType: "address";
        readonly name: "receiver";
        readonly type: "address";
    }, {
        readonly indexed: false;
        readonly internalType: "uint256";
        readonly name: "amount";
        readonly type: "uint256";
    }];
    readonly name: "Unlocked";
    readonly type: "event";
}, {
    readonly inputs: readonly [{
        readonly internalType: "address";
        readonly name: "token";
        readonly type: "address";
    }, {
        readonly internalType: "bool";
        readonly name: "isERC20";
        readonly type: "bool";
    }, {
        readonly internalType: "uint256";
        readonly name: "amount";
        readonly type: "uint256";
    }, {
        readonly internalType: "uint40";
        readonly name: "unlockTime";
        readonly type: "uint40";
    }, {
        readonly internalType: "address";
        readonly name: "receiver";
        readonly type: "address";
    }, {
        readonly internalType: "string";
        readonly name: "title";
        readonly type: "string";
    }];
    readonly name: "createLockUp";
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "address";
        readonly name: "receiver";
        readonly type: "address";
    }, {
        readonly internalType: "uint256";
        readonly name: "start";
        readonly type: "uint256";
    }, {
        readonly internalType: "uint256";
        readonly name: "stop";
        readonly type: "uint256";
    }];
    readonly name: "getLockUpIdsByReceiver";
    readonly outputs: readonly [{
        readonly internalType: "uint256[]";
        readonly name: "ids";
        readonly type: "uint256[]";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "address";
        readonly name: "token";
        readonly type: "address";
    }, {
        readonly internalType: "uint256";
        readonly name: "start";
        readonly type: "uint256";
    }, {
        readonly internalType: "uint256";
        readonly name: "stop";
        readonly type: "uint256";
    }];
    readonly name: "getLockUpIdsByToken";
    readonly outputs: readonly [{
        readonly internalType: "uint256[]";
        readonly name: "ids";
        readonly type: "uint256[]";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [];
    readonly name: "lockUpCount";
    readonly outputs: readonly [{
        readonly internalType: "uint256";
        readonly name: "";
        readonly type: "uint256";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "uint256";
        readonly name: "";
        readonly type: "uint256";
    }];
    readonly name: "lockUps";
    readonly outputs: readonly [{
        readonly internalType: "address";
        readonly name: "token";
        readonly type: "address";
    }, {
        readonly internalType: "bool";
        readonly name: "isERC20";
        readonly type: "bool";
    }, {
        readonly internalType: "uint40";
        readonly name: "unlockTime";
        readonly type: "uint40";
    }, {
        readonly internalType: "bool";
        readonly name: "unlocked";
        readonly type: "bool";
    }, {
        readonly internalType: "uint256";
        readonly name: "amount";
        readonly type: "uint256";
    }, {
        readonly internalType: "address";
        readonly name: "receiver";
        readonly type: "address";
    }, {
        readonly internalType: "string";
        readonly name: "title";
        readonly type: "string";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "address";
        readonly name: "";
        readonly type: "address";
    }, {
        readonly internalType: "address";
        readonly name: "";
        readonly type: "address";
    }, {
        readonly internalType: "uint256";
        readonly name: "";
        readonly type: "uint256";
    }, {
        readonly internalType: "uint256";
        readonly name: "";
        readonly type: "uint256";
    }, {
        readonly internalType: "bytes";
        readonly name: "";
        readonly type: "bytes";
    }];
    readonly name: "onERC1155Received";
    readonly outputs: readonly [{
        readonly internalType: "bytes4";
        readonly name: "";
        readonly type: "bytes4";
    }];
    readonly stateMutability: "pure";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "uint256";
        readonly name: "lockUpId";
        readonly type: "uint256";
    }];
    readonly name: "unlock";
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
    readonly type: "function";
}];

declare const MERKLE_ABI: readonly [{
    readonly inputs: readonly [{
        readonly internalType: "address";
        readonly name: "target";
        readonly type: "address";
    }];
    readonly name: "AddressEmptyCode";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly internalType: "address";
        readonly name: "account";
        readonly type: "address";
    }];
    readonly name: "AddressInsufficientBalance";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "FailedInnerCall";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "MerkleDistributor__AlreadyClaimed";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "MerkleDistributor__AlreadyRefunded";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "MerkleDistributor__Finished";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "MerkleDistributor__InvalidCaller";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "MerkleDistributor__InvalidPaginationParameters";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly internalType: "string";
        readonly name: "param";
        readonly type: "string";
    }];
    readonly name: "MerkleDistributor__InvalidParams";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "MerkleDistributor__InvalidProof";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "MerkleDistributor__NoClaimableTokensLeft";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "MerkleDistributor__NotStarted";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "MerkleDistributor__NothingToRefund";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "MerkleDistributor__PermissionDenied";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "MerkleDistributor__Refunded";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly internalType: "address";
        readonly name: "token";
        readonly type: "address";
    }];
    readonly name: "SafeERC20FailedOperation";
    readonly type: "error";
}, {
    readonly anonymous: false;
    readonly inputs: readonly [{
        readonly indexed: true;
        readonly internalType: "uint256";
        readonly name: "distributionId";
        readonly type: "uint256";
    }, {
        readonly indexed: false;
        readonly internalType: "address";
        readonly name: "account";
        readonly type: "address";
    }];
    readonly name: "Claimed";
    readonly type: "event";
}, {
    readonly anonymous: false;
    readonly inputs: readonly [{
        readonly indexed: true;
        readonly internalType: "uint256";
        readonly name: "distributionId";
        readonly type: "uint256";
    }, {
        readonly indexed: true;
        readonly internalType: "address";
        readonly name: "token";
        readonly type: "address";
    }, {
        readonly indexed: false;
        readonly internalType: "bool";
        readonly name: "isERC20";
        readonly type: "bool";
    }, {
        readonly indexed: false;
        readonly internalType: "uint40";
        readonly name: "startTime";
        readonly type: "uint40";
    }];
    readonly name: "Created";
    readonly type: "event";
}, {
    readonly anonymous: false;
    readonly inputs: readonly [{
        readonly indexed: true;
        readonly internalType: "uint256";
        readonly name: "distributionId";
        readonly type: "uint256";
    }, {
        readonly indexed: false;
        readonly internalType: "uint256";
        readonly name: "amount";
        readonly type: "uint256";
    }];
    readonly name: "Refunded";
    readonly type: "event";
}, {
    readonly inputs: readonly [{
        readonly internalType: "uint256";
        readonly name: "distributionId";
        readonly type: "uint256";
    }, {
        readonly internalType: "bytes32[]";
        readonly name: "merkleProof";
        readonly type: "bytes32[]";
    }];
    readonly name: "claim";
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "address";
        readonly name: "token";
        readonly type: "address";
    }, {
        readonly internalType: "bool";
        readonly name: "isERC20";
        readonly type: "bool";
    }, {
        readonly internalType: "uint176";
        readonly name: "amountPerClaim";
        readonly type: "uint176";
    }, {
        readonly internalType: "uint40";
        readonly name: "walletCount";
        readonly type: "uint40";
    }, {
        readonly internalType: "uint40";
        readonly name: "startTime";
        readonly type: "uint40";
    }, {
        readonly internalType: "uint40";
        readonly name: "endTime";
        readonly type: "uint40";
    }, {
        readonly internalType: "bytes32";
        readonly name: "merkleRoot";
        readonly type: "bytes32";
    }, {
        readonly internalType: "string";
        readonly name: "title";
        readonly type: "string";
    }, {
        readonly internalType: "string";
        readonly name: "ipfsCID";
        readonly type: "string";
    }];
    readonly name: "createDistribution";
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
    readonly type: "function";
}, {
    readonly inputs: readonly [];
    readonly name: "distributionCount";
    readonly outputs: readonly [{
        readonly internalType: "uint256";
        readonly name: "";
        readonly type: "uint256";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "uint256";
        readonly name: "";
        readonly type: "uint256";
    }];
    readonly name: "distributions";
    readonly outputs: readonly [{
        readonly internalType: "address";
        readonly name: "token";
        readonly type: "address";
    }, {
        readonly internalType: "bool";
        readonly name: "isERC20";
        readonly type: "bool";
    }, {
        readonly internalType: "uint40";
        readonly name: "walletCount";
        readonly type: "uint40";
    }, {
        readonly internalType: "uint40";
        readonly name: "claimedCount";
        readonly type: "uint40";
    }, {
        readonly internalType: "uint176";
        readonly name: "amountPerClaim";
        readonly type: "uint176";
    }, {
        readonly internalType: "uint40";
        readonly name: "startTime";
        readonly type: "uint40";
    }, {
        readonly internalType: "uint40";
        readonly name: "endTime";
        readonly type: "uint40";
    }, {
        readonly internalType: "address";
        readonly name: "owner";
        readonly type: "address";
    }, {
        readonly internalType: "uint40";
        readonly name: "refundedAt";
        readonly type: "uint40";
    }, {
        readonly internalType: "bytes32";
        readonly name: "merkleRoot";
        readonly type: "bytes32";
    }, {
        readonly internalType: "string";
        readonly name: "title";
        readonly type: "string";
    }, {
        readonly internalType: "string";
        readonly name: "ipfsCID";
        readonly type: "string";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "uint256";
        readonly name: "distributionId";
        readonly type: "uint256";
    }];
    readonly name: "getAmountClaimed";
    readonly outputs: readonly [{
        readonly internalType: "uint256";
        readonly name: "";
        readonly type: "uint256";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "uint256";
        readonly name: "distributionId";
        readonly type: "uint256";
    }];
    readonly name: "getAmountLeft";
    readonly outputs: readonly [{
        readonly internalType: "uint256";
        readonly name: "";
        readonly type: "uint256";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "address";
        readonly name: "owner";
        readonly type: "address";
    }, {
        readonly internalType: "uint256";
        readonly name: "start";
        readonly type: "uint256";
    }, {
        readonly internalType: "uint256";
        readonly name: "stop";
        readonly type: "uint256";
    }];
    readonly name: "getDistributionIdsByOwner";
    readonly outputs: readonly [{
        readonly internalType: "uint256[]";
        readonly name: "ids";
        readonly type: "uint256[]";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "address";
        readonly name: "token";
        readonly type: "address";
    }, {
        readonly internalType: "uint256";
        readonly name: "start";
        readonly type: "uint256";
    }, {
        readonly internalType: "uint256";
        readonly name: "stop";
        readonly type: "uint256";
    }];
    readonly name: "getDistributionIdsByToken";
    readonly outputs: readonly [{
        readonly internalType: "uint256[]";
        readonly name: "ids";
        readonly type: "uint256[]";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "uint256";
        readonly name: "distributionId";
        readonly type: "uint256";
    }, {
        readonly internalType: "address";
        readonly name: "wallet";
        readonly type: "address";
    }];
    readonly name: "isClaimed";
    readonly outputs: readonly [{
        readonly internalType: "bool";
        readonly name: "";
        readonly type: "bool";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "uint256";
        readonly name: "distributionId";
        readonly type: "uint256";
    }];
    readonly name: "isWhitelistOnly";
    readonly outputs: readonly [{
        readonly internalType: "bool";
        readonly name: "";
        readonly type: "bool";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "uint256";
        readonly name: "distributionId";
        readonly type: "uint256";
    }, {
        readonly internalType: "address";
        readonly name: "wallet";
        readonly type: "address";
    }, {
        readonly internalType: "bytes32[]";
        readonly name: "merkleProof";
        readonly type: "bytes32[]";
    }];
    readonly name: "isWhitelisted";
    readonly outputs: readonly [{
        readonly internalType: "bool";
        readonly name: "";
        readonly type: "bool";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "address";
        readonly name: "";
        readonly type: "address";
    }, {
        readonly internalType: "address";
        readonly name: "";
        readonly type: "address";
    }, {
        readonly internalType: "uint256";
        readonly name: "";
        readonly type: "uint256";
    }, {
        readonly internalType: "uint256";
        readonly name: "";
        readonly type: "uint256";
    }, {
        readonly internalType: "bytes";
        readonly name: "";
        readonly type: "bytes";
    }];
    readonly name: "onERC1155Received";
    readonly outputs: readonly [{
        readonly internalType: "bytes4";
        readonly name: "";
        readonly type: "bytes4";
    }];
    readonly stateMutability: "pure";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "uint256";
        readonly name: "distributionId";
        readonly type: "uint256";
    }];
    readonly name: "refund";
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
    readonly type: "function";
}];

declare const ZAP_ABI: readonly [{
    readonly inputs: readonly [{
        readonly internalType: "address";
        readonly name: "bondAddress";
        readonly type: "address";
    }, {
        readonly internalType: "address";
        readonly name: "wethAddress";
        readonly type: "address";
    }];
    readonly stateMutability: "nonpayable";
    readonly type: "constructor";
}, {
    readonly inputs: readonly [{
        readonly internalType: "address";
        readonly name: "target";
        readonly type: "address";
    }];
    readonly name: "AddressEmptyCode";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly internalType: "address";
        readonly name: "account";
        readonly type: "address";
    }];
    readonly name: "AddressInsufficientBalance";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "FailedInnerCall";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "MCV2_ZapV1__EthTransferFailed";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "MCV2_ZapV1__InvalidReceiver";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "MCV2_ZapV1__ReserveIsNotWETH";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "MCV2_ZapV1__SlippageLimitExceeded";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly internalType: "address";
        readonly name: "owner";
        readonly type: "address";
    }];
    readonly name: "OwnableInvalidOwner";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly internalType: "address";
        readonly name: "account";
        readonly type: "address";
    }];
    readonly name: "OwnableUnauthorizedAccount";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly internalType: "address";
        readonly name: "token";
        readonly type: "address";
    }];
    readonly name: "SafeERC20FailedOperation";
    readonly type: "error";
}, {
    readonly anonymous: false;
    readonly inputs: readonly [{
        readonly indexed: true;
        readonly internalType: "address";
        readonly name: "previousOwner";
        readonly type: "address";
    }, {
        readonly indexed: true;
        readonly internalType: "address";
        readonly name: "newOwner";
        readonly type: "address";
    }];
    readonly name: "OwnershipTransferred";
    readonly type: "event";
}, {
    readonly inputs: readonly [];
    readonly name: "BOND";
    readonly outputs: readonly [{
        readonly internalType: "contract MCV2_Bond";
        readonly name: "";
        readonly type: "address";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [];
    readonly name: "WETH";
    readonly outputs: readonly [{
        readonly internalType: "contract IWETH";
        readonly name: "";
        readonly type: "address";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "address";
        readonly name: "token";
        readonly type: "address";
    }, {
        readonly internalType: "uint256";
        readonly name: "tokensToBurn";
        readonly type: "uint256";
    }, {
        readonly internalType: "uint256";
        readonly name: "minRefund";
        readonly type: "uint256";
    }, {
        readonly internalType: "address";
        readonly name: "receiver";
        readonly type: "address";
    }];
    readonly name: "burnToEth";
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "address";
        readonly name: "token";
        readonly type: "address";
    }, {
        readonly internalType: "uint256";
        readonly name: "tokensToMint";
        readonly type: "uint256";
    }, {
        readonly internalType: "address";
        readonly name: "receiver";
        readonly type: "address";
    }];
    readonly name: "mintWithEth";
    readonly outputs: readonly [];
    readonly stateMutability: "payable";
    readonly type: "function";
}, {
    readonly inputs: readonly [];
    readonly name: "owner";
    readonly outputs: readonly [{
        readonly internalType: "address";
        readonly name: "";
        readonly type: "address";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [];
    readonly name: "renounceOwnership";
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "address";
        readonly name: "receiver";
        readonly type: "address";
    }];
    readonly name: "rescueETH";
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "address";
        readonly name: "newOwner";
        readonly type: "address";
    }];
    readonly name: "transferOwnership";
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
    readonly type: "function";
}, {
    readonly stateMutability: "payable";
    readonly type: "receive";
}];

type BondErrorNames = ExtractAbiErrorNames<typeof BOND_ABI>;
type ERC20ErrorNames = ExtractAbiErrorNames<typeof ERC20_ABI>;
type ERC1155ErrorNames = ExtractAbiErrorNames<typeof ERC1155_ABI>;
type LockerErrorNames = ExtractAbiErrorNames<typeof LOCKER_ABI>;
type MerkleErrorNames = ExtractAbiErrorNames<typeof MERKLE_ABI>;
type ZapErrorNames = ExtractAbiErrorNames<typeof ZAP_ABI>;
type AllContractErrorNames = BondErrorNames | ERC20ErrorNames | ERC1155ErrorNames | LockerErrorNames | MerkleErrorNames | ZapErrorNames;

declare const CONTRACT_ADDRESSES: {
    readonly ERC20: {
        readonly 1: "0xAa70bC79fD1cB4a6FBA717018351F0C3c64B79Df";
        readonly 10: "0xAa70bC79fD1cB4a6FBA717018351F0C3c64B79Df";
        readonly 42161: "0xAa70bC79fD1cB4a6FBA717018351F0C3c64B79Df";
        readonly 43114: "0x5DaE94e149CF2112Ec625D46670047814aA9aC2a";
        readonly 137: "0xAa70bC79fD1cB4a6FBA717018351F0C3c64B79Df";
        readonly 56: "0xAa70bC79fD1cB4a6FBA717018351F0C3c64B79Df";
        readonly 8453: "0xAa70bC79fD1cB4a6FBA717018351F0C3c64B79Df";
        readonly 11155111: "0x749bA94344521727f55a3007c777FbeB5F52C2Eb";
    };
    readonly ERC1155: {
        readonly 1: "0x6c61918eECcC306D35247338FDcf025af0f6120A";
        readonly 10: "0x6c61918eECcC306D35247338FDcf025af0f6120A";
        readonly 42161: "0x6c61918eECcC306D35247338FDcf025af0f6120A";
        readonly 43114: "0x621c335b4BD8f2165E120DC70d3AfcAfc6628681";
        readonly 137: "0x6c61918eECcC306D35247338FDcf025af0f6120A";
        readonly 56: "0x6c61918eECcC306D35247338FDcf025af0f6120A";
        readonly 8453: "0x6c61918eECcC306D35247338FDcf025af0f6120A";
        readonly 11155111: "0x3cABE5125C5D8922c5f38c5b779F6E96F563cdc0";
    };
    readonly BOND: {
        readonly 1: "0xc5a076cad94176c2996B32d8466Be1cE757FAa27";
        readonly 10: "0xc5a076cad94176c2996B32d8466Be1cE757FAa27";
        readonly 42161: "0xc5a076cad94176c2996B32d8466Be1cE757FAa27";
        readonly 43114: "0x3Fd5B4DcDa968C8e22898523f5343177F94ccfd1";
        readonly 137: "0xc5a076cad94176c2996B32d8466Be1cE757FAa27";
        readonly 56: "0xc5a076cad94176c2996B32d8466Be1cE757FAa27";
        readonly 8453: "0xc5a076cad94176c2996B32d8466Be1cE757FAa27";
        readonly 11155111: "0x8dce343A86Aa950d539eeE0e166AFfd0Ef515C0c";
    };
    readonly ZAP: {
        readonly 1: "0x91523b39813F3F4E406ECe406D0bEAaA9dE251fa";
        readonly 10: "0x91523b39813F3F4E406ECe406D0bEAaA9dE251fa";
        readonly 42161: "0x91523b39813F3F4E406ECe406D0bEAaA9dE251fa";
        readonly 43114: "0x29b0E6D2C2884aEa3FB4CB5dD1C7002A8E10c724";
        readonly 137: "0x91523b39813F3F4E406ECe406D0bEAaA9dE251fa";
        readonly 56: "0x91523b39813F3F4E406ECe406D0bEAaA9dE251fa";
        readonly 8453: "0x91523b39813F3F4E406ECe406D0bEAaA9dE251fa";
        readonly 11155111: "0x1Bf3183acc57571BecAea0E238d6C3A4d00633da";
    };
    readonly LOCKER: {
        readonly 1: "0xA3dCf3Ca587D9929d540868c924f208726DC9aB6";
        readonly 10: "0xA3dCf3Ca587D9929d540868c924f208726DC9aB6";
        readonly 42161: "0xA3dCf3Ca587D9929d540868c924f208726DC9aB6";
        readonly 43114: "0x5b64cECC5cF3E4B1A668Abd895D16BdDC0c77a17";
        readonly 137: "0xA3dCf3Ca587D9929d540868c924f208726DC9aB6";
        readonly 56: "0xA3dCf3Ca587D9929d540868c924f208726DC9aB6";
        readonly 8453: "0xA3dCf3Ca587D9929d540868c924f208726DC9aB6";
        readonly 11155111: "0x7c204B1B03A88D24088941068f6DFC809f2fd022";
    };
    readonly MERKLE: {
        readonly 1: "0x1349A9DdEe26Fe16D0D44E35B3CB9B0CA18213a4";
        readonly 10: "0x1349A9DdEe26Fe16D0D44E35B3CB9B0CA18213a4";
        readonly 42161: "0x1349A9DdEe26Fe16D0D44E35B3CB9B0CA18213a4";
        readonly 43114: "0x841A2bD2fc97DCB865b4Ddb352540148Bad2dB09";
        readonly 137: "0x1349A9DdEe26Fe16D0D44E35B3CB9B0CA18213a4";
        readonly 56: "0x1349A9DdEe26Fe16D0D44E35B3CB9B0CA18213a4";
        readonly 8453: "0x1349A9DdEe26Fe16D0D44E35B3CB9B0CA18213a4";
        readonly 11155111: "0x0CD940395566d509168977Cf10E5296302efA57A";
    };
    readonly ONEINCH: {
        readonly 1: "0x0AdDd25a91563696D8567Df78D5A01C9a991F9B8";
        readonly 10: "0x0AdDd25a91563696D8567Df78D5A01C9a991F9B8";
        readonly 42161: "0x0AdDd25a91563696D8567Df78D5A01C9a991F9B8";
        readonly 43114: "0x0AdDd25a91563696D8567Df78D5A01C9a991F9B8";
        readonly 137: "0x0AdDd25a91563696D8567Df78D5A01C9a991F9B8";
        readonly 56: "0x0AdDd25a91563696D8567Df78D5A01C9a991F9B8";
        readonly 8453: "0x0AdDd25a91563696D8567Df78D5A01C9a991F9B8";
        readonly 11155111: "0x";
    };
};
type ExcludeValue<T, V> = T extends V ? never : T;
type ExtractChainIds<T> = T extends {
    [key: string]: infer U;
} ? U extends {
    [key: number]: any;
} ? keyof U : never : never;
type ContractType = keyof typeof CONTRACT_ADDRESSES;
type ContractChainType = ExtractChainIds<typeof CONTRACT_ADDRESSES>;
type MainnetChain = ExcludeValue<ContractChainType, 11155111>;

declare const COINGECKO_NETWORK_IDS: {
    readonly 1: "ethereum";
    readonly 10: "optimistic-ethereum";
    readonly 42161: "arbitrum-one";
    readonly 43114: "avalanche";
    readonly 8453: "base";
    readonly 137: "polygon-pos";
    readonly 56: "binance-smart-chain";
    readonly 11155111: "ethereum";
};
type BaseToken = {
    name: string;
    symbol: string;
    address: `0x${string}`;
    decimals: number;
    image?: {
        small: string | null;
        large: string | null;
    };
};
type WrappedToken = {
    image: string;
    tokenAddress: `0x${string}`;
    nativeSymbol: string;
    oneInchSymbol: 'USDT' | 'USDbC';
    decimals: number;
};
declare const WRAPPED_NATIVE_TOKENS: Record<ContractChainType, WrappedToken>;
declare const TOKENS: Record<ContractChainType, Record<`0x${string}`, BaseToken>>;
type TokenChain = keyof typeof TOKENS;
type TokenSymbol = keyof (typeof TOKENS)[TokenChain];

type ChainType = {
    readonly id: ContractChainType;
    readonly name: 'Ethereum' | 'Base' | 'Optimism' | 'Arbitrum' | 'Avalanche' | 'Polygon' | 'BNBChain' | 'Sepolia';
    readonly icon: string;
    readonly color: string;
    readonly openseaSlug: string;
    readonly isTestnet?: boolean;
    readonly enabled?: boolean;
};
declare const CHAINS: Array<ChainType>;
type LowerCaseChainNames = (typeof CHAINS)[number]['name'] extends infer X ? X extends string ? Lowercase<X> : never : never;
declare function chainIdToString(chainId?: number): "" | "ethereum" | "sepolia" | "bnbchain" | "polygon" | "arbitrum" | "optimism" | "avalanche" | "base";
declare function chainNameToPublicIconURL(chainName: LowerCaseChainNames): string;
declare function chainStringToId(name: LowerCaseChainNames): 1 | 10 | 42161 | 43114 | 137 | 56 | 8453 | 11155111 | undefined;
type ChainMapType = Record<ContractChainType, ChainType>;
declare const CHAIN_MAP: ChainMapType;
declare const CHAIN_NAME_ID_MAP: Record<string, ContractChainType>;

declare const ONEINCH_ABI: readonly [{
    readonly inputs: readonly [{
        readonly internalType: "contract MultiWrapper";
        readonly name: "_multiWrapper";
        readonly type: "address";
    }, {
        readonly internalType: "contract IOracle[]";
        readonly name: "existingOracles";
        readonly type: "address[]";
    }, {
        readonly internalType: "enum OffchainOracle.OracleType[]";
        readonly name: "oracleTypes";
        readonly type: "uint8[]";
    }, {
        readonly internalType: "contract IERC20[]";
        readonly name: "existingConnectors";
        readonly type: "address[]";
    }, {
        readonly internalType: "contract IERC20";
        readonly name: "wBase";
        readonly type: "address";
    }, {
        readonly internalType: "address";
        readonly name: "owner";
        readonly type: "address";
    }];
    readonly stateMutability: "nonpayable";
    readonly type: "constructor";
}, {
    readonly inputs: readonly [];
    readonly name: "ArraysLengthMismatch";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "ConnectorAlreadyAdded";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "InvalidOracleTokenKind";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "OracleAlreadyAdded";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "SameTokens";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "TooBigThreshold";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "UnknownConnector";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "UnknownOracle";
    readonly type: "error";
}, {
    readonly anonymous: false;
    readonly inputs: readonly [{
        readonly indexed: false;
        readonly internalType: "contract IERC20";
        readonly name: "connector";
        readonly type: "address";
    }];
    readonly name: "ConnectorAdded";
    readonly type: "event";
}, {
    readonly anonymous: false;
    readonly inputs: readonly [{
        readonly indexed: false;
        readonly internalType: "contract IERC20";
        readonly name: "connector";
        readonly type: "address";
    }];
    readonly name: "ConnectorRemoved";
    readonly type: "event";
}, {
    readonly anonymous: false;
    readonly inputs: readonly [{
        readonly indexed: false;
        readonly internalType: "contract MultiWrapper";
        readonly name: "multiWrapper";
        readonly type: "address";
    }];
    readonly name: "MultiWrapperUpdated";
    readonly type: "event";
}, {
    readonly anonymous: false;
    readonly inputs: readonly [{
        readonly indexed: false;
        readonly internalType: "contract IOracle";
        readonly name: "oracle";
        readonly type: "address";
    }, {
        readonly indexed: false;
        readonly internalType: "enum OffchainOracle.OracleType";
        readonly name: "oracleType";
        readonly type: "uint8";
    }];
    readonly name: "OracleAdded";
    readonly type: "event";
}, {
    readonly anonymous: false;
    readonly inputs: readonly [{
        readonly indexed: false;
        readonly internalType: "contract IOracle";
        readonly name: "oracle";
        readonly type: "address";
    }, {
        readonly indexed: false;
        readonly internalType: "enum OffchainOracle.OracleType";
        readonly name: "oracleType";
        readonly type: "uint8";
    }];
    readonly name: "OracleRemoved";
    readonly type: "event";
}, {
    readonly anonymous: false;
    readonly inputs: readonly [{
        readonly indexed: true;
        readonly internalType: "address";
        readonly name: "previousOwner";
        readonly type: "address";
    }, {
        readonly indexed: true;
        readonly internalType: "address";
        readonly name: "newOwner";
        readonly type: "address";
    }];
    readonly name: "OwnershipTransferred";
    readonly type: "event";
}, {
    readonly inputs: readonly [{
        readonly internalType: "contract IERC20";
        readonly name: "connector";
        readonly type: "address";
    }];
    readonly name: "addConnector";
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "contract IOracle";
        readonly name: "oracle";
        readonly type: "address";
    }, {
        readonly internalType: "enum OffchainOracle.OracleType";
        readonly name: "oracleKind";
        readonly type: "uint8";
    }];
    readonly name: "addOracle";
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
    readonly type: "function";
}, {
    readonly inputs: readonly [];
    readonly name: "connectors";
    readonly outputs: readonly [{
        readonly internalType: "contract IERC20[]";
        readonly name: "allConnectors";
        readonly type: "address[]";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "contract IERC20";
        readonly name: "srcToken";
        readonly type: "address";
    }, {
        readonly internalType: "contract IERC20";
        readonly name: "dstToken";
        readonly type: "address";
    }, {
        readonly internalType: "bool";
        readonly name: "useWrappers";
        readonly type: "bool";
    }];
    readonly name: "getRate";
    readonly outputs: readonly [{
        readonly internalType: "uint256";
        readonly name: "weightedRate";
        readonly type: "uint256";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "contract IERC20";
        readonly name: "srcToken";
        readonly type: "address";
    }, {
        readonly internalType: "bool";
        readonly name: "useSrcWrappers";
        readonly type: "bool";
    }];
    readonly name: "getRateToEth";
    readonly outputs: readonly [{
        readonly internalType: "uint256";
        readonly name: "weightedRate";
        readonly type: "uint256";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "contract IERC20";
        readonly name: "srcToken";
        readonly type: "address";
    }, {
        readonly internalType: "bool";
        readonly name: "useSrcWrappers";
        readonly type: "bool";
    }, {
        readonly internalType: "contract IERC20[]";
        readonly name: "customConnectors";
        readonly type: "address[]";
    }, {
        readonly internalType: "uint256";
        readonly name: "thresholdFilter";
        readonly type: "uint256";
    }];
    readonly name: "getRateToEthWithCustomConnectors";
    readonly outputs: readonly [{
        readonly internalType: "uint256";
        readonly name: "weightedRate";
        readonly type: "uint256";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "contract IERC20";
        readonly name: "srcToken";
        readonly type: "address";
    }, {
        readonly internalType: "bool";
        readonly name: "useSrcWrappers";
        readonly type: "bool";
    }, {
        readonly internalType: "uint256";
        readonly name: "thresholdFilter";
        readonly type: "uint256";
    }];
    readonly name: "getRateToEthWithThreshold";
    readonly outputs: readonly [{
        readonly internalType: "uint256";
        readonly name: "weightedRate";
        readonly type: "uint256";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "contract IERC20";
        readonly name: "srcToken";
        readonly type: "address";
    }, {
        readonly internalType: "contract IERC20";
        readonly name: "dstToken";
        readonly type: "address";
    }, {
        readonly internalType: "bool";
        readonly name: "useWrappers";
        readonly type: "bool";
    }, {
        readonly internalType: "contract IERC20[]";
        readonly name: "customConnectors";
        readonly type: "address[]";
    }, {
        readonly internalType: "uint256";
        readonly name: "thresholdFilter";
        readonly type: "uint256";
    }];
    readonly name: "getRateWithCustomConnectors";
    readonly outputs: readonly [{
        readonly internalType: "uint256";
        readonly name: "weightedRate";
        readonly type: "uint256";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "contract IERC20";
        readonly name: "srcToken";
        readonly type: "address";
    }, {
        readonly internalType: "contract IERC20";
        readonly name: "dstToken";
        readonly type: "address";
    }, {
        readonly internalType: "bool";
        readonly name: "useWrappers";
        readonly type: "bool";
    }, {
        readonly internalType: "uint256";
        readonly name: "thresholdFilter";
        readonly type: "uint256";
    }];
    readonly name: "getRateWithThreshold";
    readonly outputs: readonly [{
        readonly internalType: "uint256";
        readonly name: "weightedRate";
        readonly type: "uint256";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [];
    readonly name: "multiWrapper";
    readonly outputs: readonly [{
        readonly internalType: "contract MultiWrapper";
        readonly name: "";
        readonly type: "address";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [];
    readonly name: "oracles";
    readonly outputs: readonly [{
        readonly internalType: "contract IOracle[]";
        readonly name: "allOracles";
        readonly type: "address[]";
    }, {
        readonly internalType: "enum OffchainOracle.OracleType[]";
        readonly name: "oracleTypes";
        readonly type: "uint8[]";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [];
    readonly name: "owner";
    readonly outputs: readonly [{
        readonly internalType: "address";
        readonly name: "";
        readonly type: "address";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "contract IERC20";
        readonly name: "connector";
        readonly type: "address";
    }];
    readonly name: "removeConnector";
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "contract IOracle";
        readonly name: "oracle";
        readonly type: "address";
    }, {
        readonly internalType: "enum OffchainOracle.OracleType";
        readonly name: "oracleKind";
        readonly type: "uint8";
    }];
    readonly name: "removeOracle";
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
    readonly type: "function";
}, {
    readonly inputs: readonly [];
    readonly name: "renounceOwnership";
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "contract MultiWrapper";
        readonly name: "_multiWrapper";
        readonly type: "address";
    }];
    readonly name: "setMultiWrapper";
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "address";
        readonly name: "newOwner";
        readonly type: "address";
    }];
    readonly name: "transferOwnership";
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
    readonly type: "function";
}];

declare global {
    interface Window {
        ethereum: any;
    }
}
type GenericWriteParams<A extends Abi = Abi, T extends ContractFunctionName<A, 'payable' | 'nonpayable'> = ContractFunctionName<A, 'payable' | 'nonpayable'>, R extends ContractFunctionArgs<A, 'payable' | 'nonpayable', T> = ContractFunctionArgs<A, 'payable' | 'nonpayable', T>> = {
    functionName: T;
    args: R;
    value?: bigint;
    onRequestSignature?: () => void;
    onSigned?: (tx: `0x${string}`) => void;
    onSuccess?: (receipt: WaitForTransactionReceiptReturnType) => void;
    onError?: (error: unknown) => void;
};
type GenericLogicConstructorParams<A extends SupportedAbiType = SupportedAbiType> = {
    chainId: ContractChainType;
    type: ContractType;
    abi: A;
    options?: PublicClientConfig;
};
declare class GenericContractLogic<A extends SupportedAbiType> {
    static instances: Partial<Record<ContractChainType, GenericContractLogic<SupportedAbiType>>>;
    private abi;
    private contractType;
    private chain;
    private chainId;
    private publicClient;
    private walletClient?;
    constructor(params: GenericLogicConstructorParams<A>);
    withConfig(options?: PublicClientConfig): void;
    withPrivateKey(privateKey: `0x${string}`): this;
    withAccount(account: `0x${string}`): this;
    withProvider(provider: any): Promise<this>;
    private initializeWallet;
    static network<T extends SupportedAbiType>(chainId: ContractChainType, type: ContractType, abi: T): GenericContractLogic<T>;
    read<T extends ContractFunctionName<A, 'view' | 'pure'>, R extends ContractFunctionArgs<A, 'view' | 'pure', T>>(params: {
        functionName: T;
        args: R;
    }): Promise<ReadContractReturnType<A, T, R>>;
    write<T extends ContractFunctionName<A, 'payable' | 'nonpayable'>, R extends ContractFunctionArgs<A, 'payable' | 'nonpayable', T>>(params: GenericWriteParams<A, T, R>): Promise<WaitForTransactionReceiptReturnType>;
}

type CreateTokenParams = {
    tokenType: 'ERC20' | 'ERC1155';
    name: string;
    symbol: string;
    reserveToken: {
        address: `0x${string}`;
        decimals: number;
    };
    mintRoyalty: number;
    burnRoyalty: number;
    stepData: {
        rangeTo: number;
        price: number;
    }[];
};
declare class BondContractLogic extends GenericContractLogic<typeof BOND_ABI> {
    private generateCreateArgs;
    createToken(params: CreateTokenParams & Pick<GenericWriteParams, 'onError' | 'onRequestSignature' | 'onSigned' | 'onSuccess'>): Promise<any>;
}

declare global {
    interface Window {
        ethereum: any;
    }
}
type AbiType<T extends ContractType> = T extends 'BOND' ? typeof BOND_ABI : T extends 'ERC20' ? typeof ERC20_ABI : T extends 'ERC1155' ? typeof ERC1155_ABI : T extends 'LOCKER' ? typeof LOCKER_ABI : T extends 'MERKLE' ? typeof MERKLE_ABI : T extends 'ZAP' ? typeof ZAP_ABI : T extends 'ONEINCH' ? typeof ONEINCH_ABI : never;
type SupportedAbiType = typeof BOND_ABI | typeof ERC20_ABI | typeof ERC1155_ABI | typeof LOCKER_ABI | typeof MERKLE_ABI | typeof ZAP_ABI | typeof ONEINCH_ABI;
declare class GenericContract<T extends ContractType> {
    private contractType;
    private abi;
    constructor(type: T);
    network(id: ContractChainType | LowerCaseChainNames): T extends "BOND" ? BondContractLogic : GenericContractLogic<AbiType<T>>;
}

declare const bondContract: GenericContract<"BOND">;
declare const erc20Contract: GenericContract<"ERC20">;
declare const erc1155Contract: GenericContract<"ERC1155">;
declare const zapContract: GenericContract<"ZAP">;
declare const merkleContract: GenericContract<"MERKLE">;
declare const oneInchContract: GenericContract<"ONEINCH">;
declare const abis: Record<ContractType, Abi>;
declare const whitelistedTokens: Record<1 | 10 | 42161 | 43114 | 137 | 56 | 8453 | 11155111, Record<`0x${string}`, BaseToken>>;
declare const errorMessages: Record<AllContractErrorNames, {
    message: string;
    reportToBugsnag?: boolean | undefined;
}>;
declare const supportedChains: readonly ["ethereum", "sepolia", "bnbchain", "polygon", "arbitrum", "optimism", "avalanche", "base"];
declare const supportedChainsMap: Record<LowerCaseChainNames, ContractChainType>;

export { type BaseToken, CHAINS, CHAIN_MAP, CHAIN_NAME_ID_MAP, COINGECKO_NETWORK_IDS, CONTRACT_ADDRESSES, type ChainType, type ContractChainType, type ContractType, type LowerCaseChainNames, type MainnetChain, TOKENS, type TokenChain, type TokenSymbol, WRAPPED_NATIVE_TOKENS, type WrappedToken, abis, bondContract, chainIdToString, chainNameToPublicIconURL, chainStringToId, erc1155Contract, erc20Contract, errorMessages, merkleContract, oneInchContract, supportedChains, supportedChainsMap, whitelistedTokens, zapContract };
