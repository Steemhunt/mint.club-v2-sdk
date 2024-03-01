import { BaseError } from './base';

export class TokenAlreadyExistsError extends BaseError {
  constructor() {
    super('Token already exists', {
      docsPath: 'docs/sdk/network/token',
    });
  }
}

export class ChainNotSupportedError extends BaseError {
  constructor(chain: any) {
    super(`Chain ${chain} is not supported`);
  }
}

export class WrongCreateParameterError extends BaseError {
  constructor() {
    super('Wrong parameters provided. Either curveData or stepData should be provided, not both', {
      docsPath: 'docs/sdk/network/curve',
    });
  }
}

export class SymbolNotDefinedError extends BaseError {
  constructor() {
    super('You must pass in a symbol, not an address to call the `create` function', {
      docsPath: 'docs/sdk/network/token/create',
    });
  }
}

export class InvalidImageProvidedError extends BaseError {
  constructor() {
    super(
      'You must provide a valid url for the media. It should be either a http/https url, or a CIDv0 or CIDv1 ipfs hash that starts with `ipfs://...`',
      {
        docsPath: 'docs/sdk/network/nft/create',
      },
    );
  }
}

export class FilebaseKeyNeededErrror extends BaseError {
  constructor() {
    super('You must provide a filebaseApiKey to upload Files to the IPFS', {
      docsPath: 'docs/sdk/network/nft/create',
    });
  }
}

export class NoEthereumProviderError extends BaseError {
  constructor() {
    super('window.ethereum not found', {
      docsPath: 'docs/sdk/network/transactions',
    });
  }
}

export class WalletNotConnectedError extends BaseError {
  constructor() {
    super('Wallet not connected', {
      docsPath: 'docs/sdk/network/transactions',
    });
  }
}
