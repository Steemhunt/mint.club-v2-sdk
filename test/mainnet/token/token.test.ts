import { expect, test } from 'bun:test';
import { mintclub } from '../../../src';
import { MetadataValidationError } from '../../../src/errors/sdk.errors';

const authorization = { message: 'Test message', signature: '0x1234' };

test(`CHICKEN on base - getMintclubMetadata`, async () => {
  const tokenMetadata = await mintclub.network('base').token('CHICKEN').getMintClubMetadata();
  console.log(tokenMetadata);
  expect(tokenMetadata).toBeDefined();
});

test(`CHICKEN on base - createMintClubMetadata validation`, async () => {
  const token = mintclub.network('base').token('CHICKEN');

  // Should throw error when no params provided
  let error: unknown = null;
  try {
    await token.createMintClubMetadata(authorization);
  } catch (e) {
    error = e;
  }
  expect(error).toBeInstanceOf(MetadataValidationError);

  // Should throw error for invalid website
  error = null;
  try {
    await token.createMintClubMetadata({
      ...authorization,
      website: 'invalid-url',
    });
  } catch (e) {
    error = e;
  }
  expect(error).toBeInstanceOf(MetadataValidationError);

  // Should throw error for long distribution plan
  error = null;
  try {
    await token.createMintClubMetadata({
      ...authorization,
      website: 'https://example.com',
      distributionPlan: 'a'.repeat(1001),
    });
  } catch (e) {
    error = e;
  }
  expect(error).toBeInstanceOf(MetadataValidationError);

  // Should throw error for long creator comment
  error = null;
  try {
    await token.createMintClubMetadata({
      ...authorization,
      website: 'https://example.com',
      creatorComment: 'a'.repeat(1001),
    });
  } catch (e) {
    error = e;
  }
  expect(error).toBeInstanceOf(MetadataValidationError);
});

test(`CHICKEN on base - updateMintClubMetadata validation`, async () => {
  const token = mintclub.network('base').token('CHICKEN');

  // Should throw error when no metadata fields are provided
  let error: unknown = null;
  try {
    await token.updateMintClubMetadata(authorization);
  } catch (e) {
    error = e;
  }
  expect(error).toBeInstanceOf(MetadataValidationError);

  // Should throw error for long distribution plan
  error = null;
  try {
    await token.updateMintClubMetadata({
      ...authorization,
      website: 'https://example.com',
      distributionPlan: 'a'.repeat(1001),
    });
  } catch (e) {
    error = e;
  }
  expect(error).toBeInstanceOf(MetadataValidationError);
});
