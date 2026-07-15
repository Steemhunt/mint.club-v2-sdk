import { describe, expect, test } from 'bun:test';
import {
  CHAIN_MAP,
  RPCS,
  getMintClubContractAddress,
  mintclub,
  robinhood,
  supportedChains,
  supportedChainsMap,
  whitelistedTokens,
} from '../src';

describe('Robinhood Chain support', () => {
  test('registers chain metadata and RPC', () => {
    expect(robinhood.id).toBe(4663);
    expect(CHAIN_MAP[robinhood.id].chain).toEqual(robinhood);
    expect(supportedChains).toContain('robinhood');
    expect(supportedChainsMap.robinhood).toBe(robinhood.id);
    expect(RPCS.find(({ id }) => id === robinhood.id)?.rpcs).toContain('https://rpc.mainnet.chain.robinhood.com');
  });

  test('registers deployed contracts', () => {
    expect(getMintClubContractAddress('ERC20', robinhood.id)).toBe('0xEb54dACB4C2ccb64F8074eceEa33b5eBb38E5387');
    expect(getMintClubContractAddress('ERC1155', robinhood.id)).toBe('0xaF987E88bf30581F7074E628c894A3FCbf4EE12e');
    expect(getMintClubContractAddress('BOND', robinhood.id)).toBe('0x91523b39813F3F4E406ECe406D0bEAaA9dE251fa');
    expect(getMintClubContractAddress('ZAP', robinhood.id)).toBe('0xA3dCf3Ca587D9929d540868c924f208726DC9aB6');
    expect(getMintClubContractAddress('LOCKER', robinhood.id)).toBe('0x3bc6B601196752497a68B2625DB4f2205C3b150b');
    expect(getMintClubContractAddress('MERKLE', robinhood.id)).toBe('0x1349A9DdEe26Fe16D0D44E35B3CB9B0CA18213a4');
    expect(getMintClubContractAddress('STAKE', robinhood.id)).toBe('0xF44939c1613143ad587c79602182De7DcF593e33');
  });

  test('creates a network client and exposes reserve tokens', () => {
    expect(mintclub.network('robinhood').getPublicClient().chain?.id).toBe(robinhood.id);
    expect(whitelistedTokens[robinhood.id]['0x0Bd7D308f8E1639FAb988df18A8011f41EAcAD73']?.symbol).toBe('WETH');
    expect(whitelistedTokens[robinhood.id]['0x5fc5360D0400a0Fd4f2af552ADD042D716F1d168']?.symbol).toBe('USDG');
  });
});
