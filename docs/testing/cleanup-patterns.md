# Component Cleanup Patterns

## Event Listeners

Always remove event listeners in useEffect cleanup:

```typescript
useEffect(() => {
  const handler = (e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose();
  };

  window.addEventListener('keydown', handler);

  return () => {
    window.removeEventListener('keydown', handler);
  };
}, [onClose]);
```

## Timers

Always clear timers:

```typescript
useEffect(() => {
  const timer = setTimeout(() => {
    onDismiss();
  }, duration);

  return () => clearTimeout(timer);
}, [duration, onDismiss]);
```

## Intervals

Always clear intervals:

```typescript
useEffect(() => {
  const interval = setInterval(() => {
    updateData();
  }, 1000);

  return () => clearInterval(interval);
}, []);
```

## Animation Frames

Always cancel animation frames:

```typescript
useEffect(() => {
  let rafId: number;

  const animate = () => {
    // animation logic
    rafId = requestAnimationFrame(animate);
  };

  rafId = requestAnimationFrame(animate);

  return () => {
    cancelAnimationFrame(rafId);
  };
}, []);
```

## Scroll Lock

Use the useScrollLock hook which handles cleanup automatically:

```typescript
import { useScrollLock } from '@/hooks/useScrollLock';

function Modal({ isOpen }: Props) {
  useScrollLock(isOpen);
  // ...
}
```

The hook automatically:
- Saves original overflow and padding values
- Sets `overflow: hidden` on body
- Restores original values on cleanup

## Focus Trap

Use the useFocusTrap hook:

```typescript
import { useFocusTrap } from '@/hooks/useFocusTrap';

function Dialog({ isOpen }: Props) {
  const contentRef = useRef<HTMLDivElement>(null);
  useFocusTrap(contentRef, isOpen);

  return <div ref={contentRef}>...</div>;
}
```

The hook automatically:
- Traps tab navigation within the ref element
- Removes event listeners on cleanup

## Portal Cleanup

Portals created via the Portal component are automatically cleaned up.

If creating portals manually, ensure cleanup:

```typescript
useEffect(() => {
  const container = document.createElement('div');
  container.id = 'my-portal';
  document.body.appendChild(container);

  return () => {
    container.remove();
  };
}, []);
```

## Common Mistakes

### ❌ Missing Cleanup

```typescript
useEffect(() => {
  window.addEventListener('click', handler);
  // Missing cleanup!
}, []);
```

### ✅ Proper Cleanup

```typescript
useEffect(() => {
  window.addEventListener('click', handler);
  return () => window.removeEventListener('click', handler);
}, []);
```

### ❌ Timer Not Cleared

```typescript
useEffect(() => {
  setTimeout(() => doSomething(), 1000);
  // Missing cleanup!
}, []);
```

### ✅ Timer Cleared

```typescript
useEffect(() => {
  const timer = setTimeout(() => doSomething(), 1000);
  return () => clearTimeout(timer);
}, []);
```

### ❌ Interval Without Cleanup

```typescript
useEffect(() => {
  setInterval(() => updateData(), 1000);
  // Will leak!
}, []);
```

### ✅ Interval With Cleanup

```typescript
useEffect(() => {
  const interval = setInterval(() => updateData(), 1000);
  return () => clearInterval(interval);
}, []);
```

## ESLint Rules

The project includes an ESLint rule to warn about `addEventListener` usage:

```javascript
'no-restricted-syntax': [
  'warn',
  {
    selector: 'CallExpression[callee.property.name="addEventListener"]',
    message: 'Ensure addEventListener has corresponding removeEventListener in useEffect cleanup'
  }
]
```

This serves as a reminder to add cleanup functions.

## Testing for Leaks

Run tests with memory profiling:

```bash
# Profile specific component
MEMORY_PROFILE=true npm test -- src/components/MyComponent/MyComponent.test.tsx

# All tests
MEMORY_PROFILE=true npm test
```

Look for warnings like:
- `[TIMER LEAK] X timer(s) not cleaned up`
- `[LISTENER LEAK] X listener(s) not cleaned up`

## Best Practices

1. **Always return cleanup functions** from useEffect when:
   - Adding event listeners
   - Creating timers/intervals
   - Creating animation frames
   - Modifying document/body styles
   - Creating DOM nodes

2. **Use built-in hooks** when available:
   - `useScrollLock` for scroll locking
   - `useFocusTrap` for focus management
   - `useKeyboardShortcut` for keyboard events
   - `useClickOutside` for outside click detection

3. **Test your components** with memory profiling enabled to catch leaks early

4. **Follow the principle**: If you start something in useEffect, stop it in the cleanup function
