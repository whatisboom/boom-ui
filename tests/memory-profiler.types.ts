// tests/memory-profiler.types.ts
export interface MemorySnapshot {
  heapUsed: number;
  heapTotal: number;
  external: number;
  arrayBuffers: number;
  timestamp: number;
}

export interface MemoryDelta {
  heapGrowth: number;
  detachedNodes: number;
  activeListeners: number;
  activeTimers: number;
  label: string;
}

export interface MemoryThresholds {
  heapGrowth: number;
  detachedNodes: number;
  activeListeners: number;
  activeTimers: number;
}

export interface LeakReport {
  leaks: string[];
  delta: MemoryDelta;
  passed: boolean;
}
