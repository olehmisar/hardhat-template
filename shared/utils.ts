import { ethers } from 'hardhat';

export async function getSignersWithAddresses() {
  const signers = await ethers.getSigners();
  return signers.map((signer) => [signer, signer.address] as const);
}

export async function getBlockTimestamp() {
  return (await ethers.provider.getBlock('latest')).timestamp;
}

export async function evmIncreaseTime(offset: number) {
  await ethers.provider.send('evm_mine', [(await getBlockTimestamp()) + offset]);
}

const snapshots: string[] = [];
/**
 * Runs `fn` once, saves EVM state and restores it before each tests.
 */
export function snapshottedBeforeEach(fn: () => Promise<void>) {
  before(async () => {
    snapshots.push(await ethers.provider.send('evm_snapshot', []));
    await fn();
  });

  beforeEach(async () => {
    snapshots.push(await ethers.provider.send('evm_snapshot', []));
  });

  afterEach(async () => {
    if (!(await ethers.provider.send('evm_revert', [snapshots.pop()]))) {
      throw new Error('evm_revert failed');
    }
  });

  after(async () => {
    if (!(await ethers.provider.send('evm_revert', [snapshots.pop()]))) {
      throw new Error('evm_revert failed');
    }
  });
}
