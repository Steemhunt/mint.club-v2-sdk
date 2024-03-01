import { BaseError } from './base';

export class TokenAlreadyExistsError extends BaseError {
  constructor() {
    super('Token already exists', {
      docsPath: 'docs/main/sdk/token',
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
      docsPath: 'docs/main/sdk/curve',
    });
  }
}
