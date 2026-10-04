import { afterEach, expect, mock, spyOn, test } from 'bun:test';
import { MerkleTree } from 'merkletreejs';
import { keccak256 } from 'viem';
import { Airdrop, EMPTY_ROOT } from '../src/helpers/AirdropHelper';
import { Client } from '../src/helpers/ClientHelper';
import { airdropContract } from '../src/contracts';
import { api, baseFetcher } from '../src/utils/api';

const WALLETS = [
  '0x1111111111111111111111111111111111111111',
  '0x2222222222222222222222222222222222222222',
  '0x3333333333333333333333333333333333333333',
] as const;
const tree = new MerkleTree(
  WALLETS.map((address) => keccak256(address)),
  keccak256,
  { sortPairs: true },
);
afterEach(() => mock.restore());

function airdrop() {
  const helper = new Airdrop(8453);
  spyOn(helper, 'getAirdropById').mockResolvedValue({ ipfsCID: 'test-cid', merkleRoot: tree.getHexRoot() } as any);
  return helper;
}

test('whitelist lookup generates bytes32 sibling hashes for the requested account', async () => {
  const helper = airdrop();
  spyOn(api, 'get').mockResolvedValue([...WALLETS]);
  const read = mock(async (params: any) => tree.verify(params.args[2], keccak256(params.args[1]), tree.getHexRoot()));
  spyOn(airdropContract, 'network').mockReturnValue({ read } as any);
  expect(await helper.getIsWhitelisted(1, WALLETS[1])).toBe(true);
  expect(read.mock.calls[0][0].args[2]).toEqual(tree.getHexProof(keccak256(WALLETS[1])));
  expect(await helper.getIsWhitelisted(1, '0x4444444444444444444444444444444444444444')).toBe(false);
});

test('claims use the connected account proof and IPFS fallback retains the same tree', async () => {
  const helper = airdrop();
  spyOn(Client.prototype, 'account').mockResolvedValue(WALLETS[2]);
  spyOn(api, 'get').mockRejectedValue(new Error('API unavailable'));
  spyOn(baseFetcher, 'get').mockResolvedValue([...WALLETS]);
  const write = mock(async () => ({ status: 'success' }));
  spyOn(airdropContract, 'network').mockReturnValue({ write } as any);
  await helper.claimAirdrop({ airdropId: 1 });
  expect(write.mock.calls[0][0].args).toEqual([1n, tree.getHexProof(keccak256(WALLETS[2]))]);
});

test('public airdrops use an empty proof without fetching an empty CID or connecting a wallet', async () => {
  const helper = airdrop();
  spyOn(helper, 'getAirdropById').mockResolvedValue({ ipfsCID: '', merkleRoot: EMPTY_ROOT } as any);
  const fetch = spyOn(api, 'get');
  const account = spyOn(Client.prototype, 'account');
  const write = mock(async () => ({ status: 'success' }));
  spyOn(airdropContract, 'network').mockReturnValue({ write } as any);
  expect(await helper.getMerkleProof(1)).toEqual([]);
  await helper.claimAirdrop({ airdropId: 1 });
  expect(write.mock.calls[0][0].args).toEqual([1n, []]);
  expect(fetch).not.toHaveBeenCalled();
  expect(account).not.toHaveBeenCalled();
});
