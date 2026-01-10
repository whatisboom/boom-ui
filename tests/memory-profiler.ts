// tests/memory-profiler.ts
import v8 from 'v8';
import path from 'path';
import fs from 'fs';
import type {
  MemorySnapshot,
  MemoryDelta,
  MemoryThresholds,
  LeakReport
} from './memory-profiler.types';

export const THRESHOLDS: MemoryThresholds = {
  heapGrowth: 10 * 1024 * 1024, // 10MB
  detachedNodes: 5,
  activeListeners: 0,
  activeTimers: 0
};

export class MemoryProfiler {
  private baseline: MemorySnapshot | null = null;
  private testSnapshots = new Map<string, MemorySnapshot>();

  snapshot(): MemorySnapshot {
    const mem = process.memoryUsage();
    return {
      heapUsed: mem.heapUsed,
      heapTotal: mem.heapTotal,
      external: mem.external,
      arrayBuffers: mem.arrayBuffers,
      timestamp: Date.now()
    };
  }

  captureBaseline(): void {
    this.baseline = this.snapshot();
  }

  calculateDelta(before: MemorySnapshot, after: MemorySnapshot): MemorySnapshot {
    return {
      heapUsed: after.heapUsed - before.heapUsed,
      heapTotal: after.heapTotal - before.heapTotal,
      external: after.external - before.external,
      arrayBuffers: after.arrayBuffers - before.arrayBuffers,
      timestamp: after.timestamp - before.timestamp
    };
  }

  compareToBaseline(
    label: string,
    detachedNodes: number,
    activeListeners: number,
    activeTimers: number
  ): MemoryDelta {
    if (!this.baseline) {
      throw new Error('No baseline captured. Call captureBaseline() first.');
    }

    const current = this.snapshot();
    const delta = this.calculateDelta(this.baseline, current);

    return {
      heapGrowth: delta.heapUsed,
      detachedNodes,
      activeListeners,
      activeTimers,
      label
    };
  }

  checkLeaks(delta: MemoryDelta, thresholds: MemoryThresholds = THRESHOLDS): LeakReport {
    const leaks: string[] = [];

    if (delta.heapGrowth > thresholds.heapGrowth) {
      const mb = (delta.heapGrowth / 1024 / 1024).toFixed(2);
      leaks.push(`Heap grew ${mb}MB (threshold: ${thresholds.heapGrowth / 1024 / 1024}MB)`);
    }

    if (delta.detachedNodes > thresholds.detachedNodes) {
      leaks.push(`${delta.detachedNodes} detached nodes (threshold: ${thresholds.detachedNodes})`);
    }

    if (delta.activeListeners > thresholds.activeListeners) {
      leaks.push(`${delta.activeListeners} leaked listeners (threshold: ${thresholds.activeListeners})`);
    }

    if (delta.activeTimers > thresholds.activeTimers) {
      leaks.push(`${delta.activeTimers} leaked timers (threshold: ${thresholds.activeTimers})`);
    }

    return {
      leaks,
      delta,
      passed: leaks.length === 0
    };
  }

  logMemoryUsage(label: string): void {
    if (process.env.MEMORY_PROFILE !== 'true') {
      return;
    }

    const snapshot = this.snapshot();
    const mb = (snapshot.heapUsed / 1024 / 1024).toFixed(2);
    console.log(`[MEMORY ${label}] Heap: ${mb}MB`);
  }
}

export function captureHeapSnapshot(label: string): string | null {
  if (process.env.HEAP_SNAPSHOT !== 'true') {
    return null;
  }

  const snapshotDir = path.join(process.cwd(), '.heap-snapshots');
  if (!fs.existsSync(snapshotDir)) {
    fs.mkdirSync(snapshotDir, { recursive: true });
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const filename = path.join(snapshotDir, `${label}-${timestamp}.heapsnapshot`);

  const snapshot = v8.writeHeapSnapshot(filename);
  console.log(`Heap snapshot written to ${snapshot}`);

  return snapshot;
}

// Singleton instance
export const memoryProfiler = new MemoryProfiler();

// Convenience functions
export function logMemoryUsage(label: string): void {
  memoryProfiler.logMemoryUsage(label);
}

export function captureBaseline(): void {
  memoryProfiler.captureBaseline();
}
