# SearchCommand Test Organization

## Why Tests Are Split

The SearchCommand tests are split across multiple files due to a **Vitest within-file isolation bug**. When tests were grouped together in a single file, they passed individually but failed when run together, even with proper cleanup and isolated test cases.

### The Problem

Vitest's within-file test isolation does not provide complete thread-level isolation. Tests in the same file share some state that persists between test runs, particularly when using:
- Framer Motion components
- Portal components (Modal, Overlay)
- Complex component mocking

### The Solution

Splitting tests into separate files ensures complete isolation because each file runs in its own thread with fresh imports and completely independent state.

## Test File Organization

| File | Purpose | Key Tests |
|------|---------|-----------|
| `SearchCommand.test.tsx` | Basic rendering and state | - Renders when open<br>- Doesn't render when closed<br>- Basic structure |
| `SearchCommand.motion-results.test.tsx` | Results rendering with motion | - Results grouped by category<br>- Results display with motion animations |
| `SearchCommand.motion-select.test.tsx` | Selection behavior | - Click to select results<br>- Selection callbacks |
| `SearchCommand.motion-empty.test.tsx` | Empty state handling | - Empty state message<br>- No results display |
| `SearchCommand.motion-keyboard.test.tsx` | Keyboard interactions | - Arrow key navigation<br>- Enter to select<br>- Escape to close |
| `SearchCommand.motion.test.tsx` | Motion integration tests | - Animation behavior<br>- Modal/overlay interactions |

## When to Apply This Pattern

**Only split tests into separate files when:**

1. ✅ Tests pass individually (`npx vitest path/to/test.tsx`)
2. ✅ Tests fail when run together in the same file
3. ✅ You've verified that cleanup is properly implemented
4. ✅ The component uses Framer Motion with portals or overlays
5. ✅ The issue is reproducible across multiple test runs

**Don't split tests if:**

- ❌ Tests are failing due to missing cleanup (fix cleanup first)
- ❌ The component doesn't use motion or portals
- ❌ Tests can be fixed with better mocking or test utilities
- ❌ The failure is intermittent or not reproducible

## Known Limitations

### Skipped Test: Keyboard Navigation

The `SearchCommand.motion-keyboard.test.tsx` file contains a skipped test for keyboard navigation within Portal components. This is due to a **jsdom limitation**, not a component bug:

- **Issue:** jsdom doesn't properly handle focus management for portaled elements
- **Impact:** Keyboard navigation tests fail in jsdom but work correctly in real browsers
- **Verification:** The feature works correctly in Storybook and production
- **Workaround:** Test is skipped with a comment explaining the limitation

## Future Work

If Vitest improves its within-file isolation (see [Vitest issue tracker](https://github.com/vitest-dev/vitest/issues)), these tests can potentially be consolidated back into fewer files. Monitor Vitest releases for improvements to test isolation.

## Developer Guidance

### Running SearchCommand Tests

```bash
# Run all SearchCommand tests
npm test -- SearchCommand

# Run specific test file
npm test -- SearchCommand.motion-results.test.tsx

# Run tests in watch mode
npm test -- SearchCommand --watch
```

### Adding New SearchCommand Tests

When adding new tests to SearchCommand:

1. **Start in the main test file** (`SearchCommand.test.tsx`)
2. **If tests fail when run with existing tests**, move to a new file following the naming pattern:
   - `SearchCommand.[feature].test.tsx` for basic tests
   - `SearchCommand.motion-[feature].test.tsx` for motion-dependent tests
3. **Document in this README** if you add a new test file
4. **Include a comment** in the test file explaining why it's separate

### Example Comment for Split Test Files

```typescript
/**
 * SearchCommand motion-keyboard tests
 *
 * These tests are in a separate file due to Vitest within-file isolation
 * limitations with Framer Motion + Portal components. See TEST-ORGANIZATION.md
 * for details.
 */
```

## Related Documentation

- **Memory Cleanup Patterns:** See `CLAUDE.md` for memory cleanup best practices
- **Test Utilities:** See `tests/test-utils.tsx` for enhanced rendering utilities
- **Global Test Setup:** See `tests/setup.ts` for cleanup infrastructure
