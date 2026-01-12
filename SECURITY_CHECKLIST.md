# Security Review Checklist

Use this checklist when reviewing code changes (PRs) or implementing new components.

## Pre-Submission (Contributors)

Before submitting a PR:

- [ ] Run `npm audit` to check for vulnerabilities
- [ ] All tests pass (`npm run test:ci`)
- [ ] Type checking passes (`npm run typecheck`)
- [ ] Linting passes with zero warnings (`npm run lint`)
- [ ] No secrets, API keys, or credentials committed
- [ ] New dependencies have security justification in PR description

## Code Review (Maintainers)

### XSS & Injection Prevention

- [ ] **No use of `dangerouslySetInnerHTML`** unless explicitly justified with sanitization
- [ ] **No use of `innerHTML` or `outerHTML`** in TypeScript/JavaScript code
- [ ] **No use of `eval()` or `Function()` constructor**
- [ ] **User-provided content** is passed via React props (not string interpolation)
- [ ] **Event handlers** don't execute user-provided strings as code
- [ ] **Style props** from untrusted sources are validated/typed (not arbitrary objects)
- [ ] **URLs from user input** use proper validation (no `javascript:` protocol)

### Example Safe Patterns

```tsx
// ✅ SAFE - React's built-in escaping
<div>{userProvidedText}</div>
<div title={userProvidedTitle}>{content}</div>

// ✅ SAFE - Type-safe style object
interface ButtonProps {
  variant: 'primary' | 'secondary'; // controlled enum
}

// ✅ SAFE - Validated URL
const sanitizedUrl = url.startsWith('http://') || url.startsWith('https://')
  ? url
  : `https://${url}`;
```

### Example Unsafe Patterns

```tsx
// ❌ UNSAFE - dangerouslySetInnerHTML without sanitization
<div dangerouslySetInnerHTML={{ __html: userContent }} />

// ❌ UNSAFE - innerHTML manipulation
element.innerHTML = userContent

// ❌ UNSAFE - eval or Function constructor
eval(userCode)
new Function(userCode)()

// ❌ UNSAFE - string interpolation into HTML attributes
<div onClick={() => eval(userProvidedHandler)} />
<a href={`javascript:${userCode}`}>Link</a>

// ❌ UNSAFE - uncontrolled style object from user
<div style={userProvidedStyles} /> // could inject CSS attacks
```

## Dependency Security

- [ ] **New dependencies** are from reputable sources (high npm downloads, active maintenance)
- [ ] **New dependencies** have no known high/critical vulnerabilities (`npm audit`)
- [ ] **Dependency updates** don't introduce new vulnerabilities
- [ ] **Dev dependencies** with moderate vulnerabilities are documented if accepting risk
- [ ] **Transitive dependencies** are reviewed (check `npm ls <package>`)

### Dependency Evaluation Criteria

When adding new dependencies, verify:

1. **Necessity**: Could this be implemented without a dependency?
2. **Reputation**:
   - Weekly downloads > 10k
   - Last published within 6 months
   - GitHub stars > 100
   - Active issue triage
3. **Security**:
   - No known vulnerabilities
   - Uses TypeScript or has `@types` package
   - Has security policy (SECURITY.md)
4. **License**: Compatible with MIT (this project's license)

## Secrets & Credentials

- [ ] **No hardcoded API keys, tokens, or passwords**
- [ ] **No `.env` files** committed (should be in `.gitignore`)
- [ ] **No private keys or certificates** committed
- [ ] **Test data** doesn't contain real user information
- [ ] **Example code** in docs uses placeholder credentials (e.g., `YOUR_API_KEY`)

### If secrets are accidentally committed:

1. Immediately rotate the exposed credential
2. Force push with secret removed (requires `--force`, notify team)
3. Audit git history to ensure complete removal
4. Document incident in PR/commit message

## Component-Specific Checks

### Form Components

- [ ] **Input validation** is performed on user input
- [ ] **Form submission** doesn't execute user-provided code
- [ ] **File uploads** (if added) validate file types and sizes
- [ ] **Form fields** have appropriate `type` attributes (e.g., `type="email"`)

### Link Components

- [ ] **External links** include `rel="noopener noreferrer"` when using `target="_blank"`
- [ ] **href values** are validated (no `javascript:` protocol)
- [ ] **URL construction** uses proper encoding

### Modal/Dialog Components

- [ ] **Focus trap** properly implemented (accessibility)
- [ ] **Scroll lock** properly cleans up on unmount (memory safety)
- [ ] **Event listeners** are removed in cleanup functions

### Animation Components

- [ ] **Animation frames** are cancelled in cleanup (`cancelAnimationFrame`)
- [ ] **Timers** are cleared in cleanup (`clearTimeout`, `clearInterval`)
- [ ] **Framer Motion** animations use finite durations (no infinite loops)

## Memory Safety

- [ ] **Event listeners** added to `window`/`document` are removed in cleanup
- [ ] **Timers** (`setTimeout`, `setInterval`) are cleared in cleanup
- [ ] **Animation frames** (`requestAnimationFrame`) are cancelled in cleanup
- [ ] **Subscriptions** or observers are unsubscribed in cleanup
- [ ] **`useEffect` cleanup functions** are implemented where needed

### Memory Leak Test

Run tests with memory profiling:

```bash
MEMORY_PROFILE=true npm test -- src/components/YourComponent/YourComponent.test.tsx
```

Check for:
- Memory usage trends upward over repeated mount/unmount cycles
- Event listeners that persist after unmount
- Timers that continue after component cleanup

## Accessibility (a11y) - Security Intersection

- [ ] **All interactive elements** are keyboard accessible (security UX)
- [ ] **Focus indicators** are visible (prevents clickjacking confusion)
- [ ] **ARIA labels** accurately describe element purpose (no misleading labels)
- [ ] **vitest-axe** tests pass (run `npm test`)

Accessibility affects security because:
- Hidden inputs can trick users (phishing)
- Misleading ARIA labels can deceive assistive technology users
- Keyboard traps can prevent users from exiting malicious content

## Documentation

- [ ] **Security implications** are documented if component handles sensitive data
- [ ] **Props accepting user input** have clear TypeScript types (not `any`)
- [ ] **Example code** in Storybook follows security best practices
- [ ] **README/docs** mention sanitization requirements if applicable

## GitHub Actions / CI/CD

- [ ] **Workflow permissions** follow principle of least privilege
- [ ] **Secrets** use GitHub Secrets (not hardcoded)
- [ ] **Third-party actions** are pinned to commit SHA (not `@latest`)
- [ ] **npm publish** uses OIDC tokens (already configured)

## Pre-Merge Final Check

Before merging PR:

- [ ] All CI checks pass (typecheck, lint, test, build)
- [ ] No new high/critical npm audit findings
- [ ] Code review approval from maintainer
- [ ] Security considerations addressed in this checklist
- [ ] Breaking changes (if any) documented in PR description

---

## Questions to Ask During Review

1. **Could this code execute user-provided content as JavaScript?**
2. **Does this component accept HTML strings from consumers?**
3. **Are there any new dependencies? Why are they necessary?**
4. **Could this change introduce a memory leak?**
5. **Does this affect the build or publish process?**
6. **Are there edge cases where unsafe content could be rendered?**

## Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [React Security Best Practices](https://react.dev/learn/reusing-logic-with-custom-hooks)
- [npm Security Best Practices](https://docs.npmjs.com/about-security)
- [GitHub Security Advisories](https://github.com/advisories)
- [CVSS Scoring Calculator](https://www.first.org/cvss/calculator/3.1)

---

**Last updated**: 2026-01-12
