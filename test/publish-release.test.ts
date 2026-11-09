import { describe, expect, test } from 'bun:test';
import { assertPublishedMetadata, buildReleasePlan } from '../scripts/publish-release.mjs';

const manifest = { name: '@mint.club/v2-sdk', version: '4.1.0' };

describe('release plan', () => {
  test('derives the release tag from a stable package version', () => {
    expect(buildReleasePlan(manifest)).toEqual({ name: '@mint.club/v2-sdk', version: '4.1.0', tag: 'v4.1.0' });
  });

  test('rejects other package names and prerelease versions', () => {
    expect(() => buildReleasePlan({ ...manifest, name: 'mint.club-v2-sdk' })).toThrow('does not match');
    expect(() => buildReleasePlan({ ...manifest, version: '4.1.0-beta.1' })).toThrow('stable semver');
  });

  test('accepts only a publish of the same version from the expected commit', () => {
    const plan = buildReleasePlan(manifest);
    expect(() => assertPublishedMetadata(plan, 'abc', { version: '4.1.0', gitHead: 'abc' })).not.toThrow();
    expect(() => assertPublishedMetadata(plan, 'abc', undefined)).toThrow('not available on npm');
    expect(() => assertPublishedMetadata(plan, 'abc', { version: '4.1.0', gitHead: 'def' })).toThrow(
      'was published from def',
    );
  });
});
