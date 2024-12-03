import { expect, test } from 'bun:test';
import { mintclub } from '../../../src';
import { MetadataValidationError } from '../../../src/errors/sdk.errors';

test(`CHICKEN on base - getMintclubMetadata`, async () => {
  const tokenMetadata = await mintclub.network('base').token('CHICKEN').getMintClubMetadata();
  console.log(tokenMetadata);
  expect(tokenMetadata).toBeDefined();
});

test(`CHICKEN on base - createMintClubMetadata validation`, async () => {
  const token = mintclub.network('base').token('CHICKEN');

  // Should throw error when no params provided
  let error = null;
  try {
    await token.createMintClubMetadata({});
  } catch (e) {
    error = e;
  }
  expect(error).toBeInstanceOf(MetadataValidationError);

  // Should throw error for invalid website
  error = null;
  try {
    await token.createMintClubMetadata({
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
      website: 'https://example.com',
      distributionPlan: 'a'.repeat(1001),
    });
  } catch (e) {
    error = e;
  }
  expect(error).toBeInstanceOf(MetadataValidationError);

  // Should pass with valid params including distribution plan and creator comment
  const metadata = await token.createMintClubMetadata({
    website: 'https://example.com',
    distributionPlan: 'Community distribution',
    creatorComment: 'Test creation',
  });
  expect(metadata).toBeDefined();
});

test(`CHICKEN on base - updateMintClubMetadata validation`, async () => {
  const token = mintclub.network('base').token('CHICKEN');

  // Should throw error when no signature provided
  let error = null;
  try {
    await token.updateMintClubMetadata({
      website: 'https://example.com',
      distributionPlan: 'Community distribution',
    } as any);
  } catch (e) {
    error = e;
  }
  expect(error).toBeInstanceOf(MetadataValidationError);

  // Should throw error for long distribution plan
  error = null;
  try {
    await token.updateMintClubMetadata({
      website: 'https://example.com',
      distributionPlan: 'a'.repeat(1001),
      signature: '0x123',
      message: 'Test message',
    });
  } catch (e) {
    error = e;
  }
  expect(error).toBeInstanceOf(MetadataValidationError);

  // Should pass with valid params
  const metadata = await token.updateMintClubMetadata({
    website: 'https://example.com',
    distributionPlan: 'Community distribution',
    creatorComment: 'Test update',
    signature: '0x123',
    message: 'Test message',
  });
  expect(metadata).toBeDefined();
});
