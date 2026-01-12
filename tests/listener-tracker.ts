// tests/listener-tracker.ts
interface TrackedListener {
  target: EventTarget;
  type: string;
  listener: EventListenerOrEventListenerObject;
  options?: boolean | AddEventListenerOptions;
  stack: string;
  timestamp: number;
}

class ListenerTracker {
  private listeners = new Map<string, TrackedListener>();
  private originalAddEventListener: typeof EventTarget.prototype.addEventListener;
  private originalRemoveEventListener: typeof EventTarget.prototype.removeEventListener;
  private installed = false;
  private listenerIdCounter = 0;

  constructor() {
    this.originalAddEventListener = EventTarget.prototype.addEventListener;
    this.originalRemoveEventListener = EventTarget.prototype.removeEventListener;
  }

  private getListenerId(
    target: EventTarget,
    type: string,
    listener: EventListenerOrEventListenerObject
  ): string {
    // Simple approach: increment counter for each add
    return `${this.listenerIdCounter++}`;
  }

  install(): void {
    if (this.installed) return;
    this.installed = true;

    const tracker = this;

    EventTarget.prototype.addEventListener = function(
      type: string,
      listener: EventListenerOrEventListenerObject | null,
      options?: boolean | AddEventListenerOptions
    ): void {
      if (listener) {
        const id = tracker.getListenerId(this, type, listener);
        tracker.listeners.set(id, {
          target: this,
          type,
          listener,
          options,
          stack: new Error().stack || '',
          timestamp: Date.now()
        });
      }
      tracker.originalAddEventListener.call(this, type, listener, options);
    };

    EventTarget.prototype.removeEventListener = function(
      type: string,
      listener: EventListenerOrEventListenerObject | null,
      options?: boolean | EventListenerOptions
    ): void {
      // Remove from tracking - find matching listener
      for (const [id, tracked] of tracker.listeners) {
        if (tracked.target === this && tracked.type === type && tracked.listener === listener) {
          tracker.listeners.delete(id);
          break;
        }
      }
      tracker.originalRemoveEventListener.call(this, type, listener, options);
    };
  }

  removeAll(): void {
    for (const tracked of this.listeners.values()) {
      try {
        this.originalRemoveEventListener.call(
          tracked.target,
          tracked.type,
          tracked.listener,
          tracked.options
        );
      } catch (e) {
        // Ignore errors during cleanup
      }
    }
    this.listeners.clear();
  }

  getActiveCount(): number {
    return this.listeners.size;
  }

  getActiveListeners(): TrackedListener[] {
    return Array.from(this.listeners.values());
  }

  logLeakedListeners(): void {
    if (this.listeners.size === 0) return;

    console.warn(`[LISTENER LEAK] ${this.listeners.size} listener(s) not cleaned up:`);
    for (const listener of this.listeners.values()) {
      const targetName = listener.target.constructor.name;
      console.warn(`  - ${listener.type} on ${targetName}`);
      console.warn(`    Stack: ${listener.stack.split('\n').slice(1, 3).join('\n')}`);
    }
  }

  reset(): void {
    this.removeAll();
  }
}

export const listenerTracker = new ListenerTracker();

export function installListenerTracking(): void {
  listenerTracker.install();
}

export function removeAllTrackedListeners(): void {
  listenerTracker.removeAll();
}

export function getActiveListenerCount(): number {
  return listenerTracker.getActiveCount();
}

export function logLeakedListeners(): void {
  listenerTracker.logLeakedListeners();
}
