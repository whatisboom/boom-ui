// tests/timer-tracker.ts
interface TrackedTimer {
  id: number;
  type: 'setTimeout' | 'setInterval' | 'requestAnimationFrame';
  stack: string;
  timestamp: number;
}

class TimerTracker {
  private timers = new Map<number, TrackedTimer>();
  private originalSetTimeout: typeof setTimeout;
  private originalSetInterval: typeof setInterval;
  private originalClearTimeout: typeof clearTimeout;
  private originalClearInterval: typeof clearInterval;
  private originalRequestAnimationFrame: typeof requestAnimationFrame;
  private originalCancelAnimationFrame: typeof cancelAnimationFrame;
  private installed = false;

  constructor() {
    this.originalSetTimeout = global.setTimeout;
    this.originalSetInterval = global.setInterval;
    this.originalClearTimeout = global.clearTimeout;
    this.originalClearInterval = global.clearInterval;
    this.originalRequestAnimationFrame = global.requestAnimationFrame;
    this.originalCancelAnimationFrame = global.cancelAnimationFrame;
  }

  install(): void {
    if (this.installed) return;
    this.installed = true;

    const tracker = this;

    global.setTimeout = function(...args: Parameters<typeof setTimeout>): ReturnType<typeof setTimeout> {
      const id = tracker.originalSetTimeout.apply(this, args) as unknown as number;
      tracker.timers.set(id, {
        id,
        type: 'setTimeout',
        stack: new Error().stack || '',
        timestamp: Date.now()
      });
      return id as unknown as ReturnType<typeof setTimeout>;
    } as typeof setTimeout;

    global.setInterval = function(...args: Parameters<typeof setInterval>): ReturnType<typeof setInterval> {
      const id = tracker.originalSetInterval.apply(this, args) as unknown as number;
      tracker.timers.set(id, {
        id,
        type: 'setInterval',
        stack: new Error().stack || '',
        timestamp: Date.now()
      });
      return id as unknown as ReturnType<typeof setInterval>;
    } as typeof setInterval;

    global.clearTimeout = function(id?: number): void {
      if (id !== undefined) {
        tracker.timers.delete(id);
      }
      tracker.originalClearTimeout(id);
    };

    global.clearInterval = function(id?: number): void {
      if (id !== undefined) {
        tracker.timers.delete(id);
      }
      tracker.originalClearInterval(id);
    };

    global.requestAnimationFrame = function(callback: FrameRequestCallback): number {
      const id = tracker.originalRequestAnimationFrame(callback);
      tracker.timers.set(id, {
        id,
        type: 'requestAnimationFrame',
        stack: new Error().stack || '',
        timestamp: Date.now()
      });
      return id;
    };

    global.cancelAnimationFrame = function(id: number): void {
      tracker.timers.delete(id);
      tracker.originalCancelAnimationFrame(id);
    };
  }

  clearAll(): void {
    for (const [id, timer] of this.timers) {
      if (timer.type === 'setTimeout' || timer.type === 'setInterval') {
        this.originalClearTimeout(id);
      } else if (timer.type === 'requestAnimationFrame') {
        this.originalCancelAnimationFrame(id);
      }
    }
    this.timers.clear();
  }

  getActiveCount(): number {
    return this.timers.size;
  }

  getActiveTimers(): TrackedTimer[] {
    return Array.from(this.timers.values());
  }

  logLeakedTimers(): void {
    if (this.timers.size === 0) return;

    console.warn(`[TIMER LEAK] ${this.timers.size} timer(s) not cleaned up:`);
    for (const timer of this.timers.values()) {
      console.warn(`  - ${timer.type} (id: ${timer.id})`);
      console.warn(`    Stack: ${timer.stack.split('\n').slice(1, 3).join('\n')}`);
    }
  }

  reset(): void {
    this.clearAll();
  }
}

export const timerTracker = new TimerTracker();

export function installTimerTracking(): void {
  timerTracker.install();
}

export function clearAllTrackedTimers(): void {
  timerTracker.clearAll();
}

export function getActiveTimerCount(): number {
  return timerTracker.getActiveCount();
}

export function logLeakedTimers(): void {
  timerTracker.logLeakedTimers();
}
