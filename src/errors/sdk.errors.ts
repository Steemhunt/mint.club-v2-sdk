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
