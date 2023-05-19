import * as hnh from "@nomicfoundation/hardhat-network-helpers";
import { ethers } from "ethers";
import ms from "ms";
import { assert } from "ts-essentials";
import { z } from "zod";

const snapshots: hnh.SnapshotRestorer[] = [];
/**
 * Runs `fn` once, saves EVM state and restores it before each tests.
 */
export function snapshottedBeforeEach(fn: () => Promise<void>) {
  before(async () => {
    snapshots.push(await hnh.takeSnapshot());
    await fn();
  });

  beforeEach(async () => {
    snapshots.push(await hnh.takeSnapshot());
  });

  async function restoreLatestSnapshot() {
    const snapshot = snapshots.pop();
    assert(snapshot, "no snapshot");
    snapshot.restore();
  }
  afterEach(restoreLatestSnapshot);
  after(restoreLatestSnapshot);
}

export function zPrivateKey() {
  return z
    .string()
    .refine((s) => /^0x[0-9-a-fA-F]{64}$/.test(s), "Invalid private key");
}

export function sec(s: string): number {
  return Math.floor(ms(s) / 1000);
}

export async function parseUnits(
  token: { decimals: () => Promise<number> },
  value: string,
) {
  return ethers.utils.parseUnits(value, await token.decimals());
}

export async function formatUnits(
  token: { decimals: () => Promise<number> },
  units: ethers.BigNumberish,
) {
  return ethers.utils.formatUnits(units, await token.decimals());
}
