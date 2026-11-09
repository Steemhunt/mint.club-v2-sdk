// Publishes @mint.club/v2-sdk from an up-to-date `main` and then pushes the release tag.
//   npm run release [-- --dry-run]
// The Release workflow runs `--verify-tag <tag> <commit>` on tag push to confirm the npm publish
// before it creates the GitHub release. Same flow as Steemhunt/mint.club-v2-ai.
import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const packageName = '@mint.club/v2-sdk';
const npmRegistry = 'https://registry.npmjs.org/';

export function buildReleasePlan(manifest) {
  if (manifest?.name !== packageName) {
    throw new Error(`Package name ${manifest?.name} does not match ${packageName}`);
  }
  const version = manifest.version;
  if (!/^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/.test(version ?? '')) {
    throw new Error(`Release version must be stable semver: ${version}`);
  }
  return { name: packageName, version, tag: `v${version}` };
}

export function assertPublishedMetadata(plan, expectedHead, metadata) {
  if (metadata?.version !== plan.version) {
    throw new Error(`${plan.name}@${plan.version} is not available on npm`);
  }
  if (metadata.gitHead !== expectedHead) {
    throw new Error(
      `${plan.name}@${plan.version} was published from ${metadata.gitHead ?? 'an unknown commit'}, expected ${expectedHead}`,
    );
  }
}

function run(command, args, { capture = false } = {}) {
  const result = spawnSync(command, args, {
    cwd: root,
    encoding: 'utf8',
    stdio: capture ? 'pipe' : 'inherit',
    maxBuffer: 20 * 1024 * 1024,
  });
  if (result.error) throw result.error;
  if (result.status !== 0) {
    const detail = `${result.stderr ?? ''}${result.stdout ?? ''}`.trim();
    throw new Error(`${command} ${args.join(' ')} failed${detail ? `: ${detail}` : ''}`);
  }
  return capture ? result.stdout.trim() : '';
}

function publishedMetadata(plan) {
  const result = spawnSync(
    'npm',
    [
      'view',
      `${plan.name}@${plan.version}`,
      'version',
      'gitHead',
      '--json',
      '--prefer-online',
      '--registry',
      npmRegistry,
    ],
    { cwd: root, encoding: 'utf8', maxBuffer: 5 * 1024 * 1024 },
  );
  if (result.error) throw result.error;
  if (result.status === 0) return result.stdout.trim() ? JSON.parse(result.stdout) : undefined;

  const detail = `${result.stderr ?? ''}${result.stdout ?? ''}`;
  if (/\bE404\b|404 Not Found/i.test(detail)) return undefined;
  throw new Error(`Could not query ${plan.name}@${plan.version}: ${detail.trim()}`);
}

function delay(milliseconds) {
  return new Promise((resolveDelay) => setTimeout(resolveDelay, milliseconds));
}

async function waitForPublished(plan, expectedHead, attempts = 36) {
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    const metadata = publishedMetadata(plan);
    if (metadata) {
      assertPublishedMetadata(plan, expectedHead, metadata);
      return;
    }
    if (attempt < attempts) await delay(5_000);
  }
  throw new Error(`${plan.name}@${plan.version} did not become available on npm in time`);
}

function currentPlan() {
  return buildReleasePlan(JSON.parse(readFileSync(resolve(root, 'package.json'), 'utf8')));
}

function assertCleanWorkingTree() {
  if (run('git', ['status', '--porcelain'], { capture: true })) {
    throw new Error('Release requires a clean working tree');
  }
}

function tagCommit(tag) {
  const result = spawnSync('git', ['rev-parse', '--verify', `${tag}^{commit}`], { cwd: root, encoding: 'utf8' });
  if (result.status === 0) return result.stdout.trim();
  if (result.status === 128) return undefined;
  throw new Error(result.stderr.trim() || `Could not resolve ${tag}`);
}

async function verifyTag(tag, expectedHead) {
  const plan = currentPlan();
  if (tag !== plan.tag) {
    throw new Error(`Tag ${tag} does not match package version ${plan.version}`);
  }
  await waitForPublished(plan, expectedHead, 18);
  console.log(`Verified ${tag}: ${plan.name}@${plan.version} was published from ${expectedHead}`);
}

async function publishRelease(dryRun) {
  const plan = currentPlan();
  assertCleanWorkingTree();
  if (run('git', ['branch', '--show-current'], { capture: true }) !== 'main') {
    throw new Error('Release must run from the main branch');
  }
  run('git', ['fetch', 'origin', 'main', '--tags']);
  const head = run('git', ['rev-parse', 'HEAD'], { capture: true });
  if (head !== run('git', ['rev-parse', 'origin/main'], { capture: true })) {
    throw new Error('Local main must exactly match origin/main');
  }
  let existingTagCommit = tagCommit(plan.tag);
  if (existingTagCommit && existingTagCommit !== head) {
    throw new Error(`${plan.tag} already points to ${existingTagCommit}`);
  }
  run('npm', ['whoami', '--registry', npmRegistry]);

  // `npm test` is not a release gate here because the suite includes live-network tests; run it separately.
  for (const args of [['ci'], ['run', 'typecheck'], ['run', 'build']]) run('npm', args);
  assertCleanWorkingTree();
  run('git', ['fetch', 'origin', 'main', '--tags']);
  if (head !== run('git', ['rev-parse', 'origin/main'], { capture: true })) {
    throw new Error('Remote main changed during release validation');
  }
  existingTagCommit = tagCommit(plan.tag);
  if (existingTagCommit && existingTagCommit !== head) {
    throw new Error(`${plan.tag} already points to ${existingTagCommit}`);
  }

  const metadata = publishedMetadata(plan);
  if (metadata) {
    assertPublishedMetadata(plan, head, metadata);
    console.log(`Already published: ${plan.name}@${plan.version}`);
  } else if (dryRun) {
    console.log(`Would publish: ${plan.name}@${plan.version}`);
  } else {
    run('npm', ['publish', '--access', 'public', '--registry', npmRegistry]);
    assertCleanWorkingTree();
    await waitForPublished(plan, head);
  }

  if (dryRun) {
    console.log(`Would push release tag: ${plan.tag}`);
    return;
  }
  if (!existingTagCommit) run('git', ['tag', '-a', plan.tag, '-m', `Release ${plan.tag}`]);
  run('git', ['push', 'origin', `refs/tags/${plan.tag}`]);
  console.log(`Published ${plan.version} and pushed ${plan.tag}; the Release workflow creates the GitHub release`);
}

async function main() {
  const args = process.argv.slice(2);
  if (args[0] === '--verify-tag') {
    if (args.length !== 3) throw new Error('Usage: publish-release.mjs --verify-tag <tag> <commit>');
    await verifyTag(args[1], args[2]);
    return;
  }
  if (args.length > 1 || (args[0] && args[0] !== '--dry-run')) {
    throw new Error('Usage: npm run release [-- --dry-run]');
  }
  await publishRelease(args[0] === '--dry-run');
}

const entryPoint = process.argv[1] ? pathToFileURL(resolve(process.argv[1])).href : undefined;
if (entryPoint === import.meta.url) {
  main().catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  });
}
