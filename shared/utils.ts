import * as helpers from "@nomicfoundation/hardhat-network-helpers";
import { assert } from "ts-essentials";

const snapshots: helpers.SnapshotRestorer[] = [];
/**
 * Runs `fn` once, saves EVM state and restores it before each tests.
 */
export function snapshottedBeforeEach(fn: () => Promise<void>) {
  before(async () => {
    snapshots.push(await helpers.takeSnapshot());
    await fn();
  });

  beforeEach(async () => {
    snapshots.push(await helpers.takeSnapshot());
  });

  async function restoreLatestSnapshot() {
    const snapshot = snapshots.pop();
    assert(snapshot, "no snapshot");
    snapshot.restore();
  }
  afterEach(restoreLatestSnapshot);
  after(restoreLatestSnapshot);
}
