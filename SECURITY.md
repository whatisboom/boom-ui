# Security Policy

## Supported Versions

We release patches for security vulnerabilities for the following versions:

| Version | Supported          |
| ------- | ------------------ |
| 0.4.x   | :white_check_mark: |
| < 0.4   | :x:                |

**Note**: boom-ui is pre-1.0. Only the latest minor version (0.x) receives security patches.
We strongly recommend staying current with the latest release.

## Reporting a Vulnerability

**Please do not report security vulnerabilities through public GitHub issues.**

Instead, please report them using [GitHub Security Advisories](https://github.com/whatisboom/boom-ui/security/advisories/new).

**What to include:**
- Type of vulnerability (XSS, dependency issue, etc.)
- Affected component(s) and version(s)
- Step-by-step reproduction instructions
- Potential impact assessment
- Suggested fix (if available)

**Response timeline:**
- Initial response: Within 72 hours
- Status updates: Every 5 business days
- Critical vulnerabilities: Patched within 7 days
- High severity: Patched within 30 days
- Medium/Low: Included in next minor release

## Security Update Process

When a vulnerability is reported:

1. **Triage** (48-72 hours): Maintainers assess severity using CVSS scoring
2. **Development**: Patch created on private branch
3. **Testing**: Comprehensive test coverage for fix
4. **Release**: Hotfix published to npm with version bump
5. **Disclosure**: Public CVE and advisory published immediately with release

Critical vulnerabilities follow hotfix process (`hotfix/v*` branch → `main` → backport to `develop`).

## Dependency Security

boom-ui maintains dependency security through:

- **Automated scanning**: Dependabot runs weekly npm audits
- **Security updates**: Automated PRs for vulnerable dependencies (reviewed before merging)
- **Pre-push validation**: Git hooks fail on high/critical vulnerabilities
- **Quarterly audits**: Manual review of all dependencies every 3 months

### Known Accepted Risks

**Moderate severity vulnerabilities in dev dependencies** (as of 2026-01-12):
- `vue-template-compiler`, `@vue/language-core`, `vue-tsc` (via `vite-plugin-dts`)
- **Rationale for acceptance**:
  - Dev dependencies only - not shipped to npm consumers
  - Vue template compilation XSS vulnerability doesn't affect React runtime
  - Used only for TypeScript declaration (.d.ts) file generation during build
  - Monitored for updates, will be revisited in quarterly audits
  - Pre-push hook allows moderate vulnerabilities (only blocks high/critical)

## XSS & Injection Prevention

boom-ui components are designed to prevent XSS vulnerabilities:

- ✅ All components use React's built-in escaping
- ✅ No use of `dangerouslySetInnerHTML`
- ✅ Props are type-safe via TypeScript

**For consumers:**
- User-provided content passed as React props is automatically escaped
- If you need to render user-generated HTML, use a sanitization library like [DOMPurify](https://github.com/cure53/DOMPurify)
- Avoid string interpolation of user content into HTML attributes or event handlers

**Code patterns we avoid:**
```tsx
// ❌ UNSAFE - string interpolation into HTML
<div dangerouslySetInnerHTML={{ __html: userContent }} />

// ❌ UNSAFE - direct innerHTML manipulation
element.innerHTML = userContent

// ✅ SAFE - React's default escaping
<div>{userContent}</div>

// ✅ SAFE - properly sanitized HTML (consumer responsibility)
import DOMPurify from 'dompurify'
<div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(userHtml) }} />
```

## Supply Chain Security

boom-ui uses multiple layers of supply chain protection:

- **npm Provenance**: All packages published with `--provenance` flag (see [attestations](https://www.npmjs.com/package/@whatisboom/boom-ui?activeTab=attestations))
- **OIDC Authentication**: GitHub Actions uses short-lived OIDC tokens (no stored npm tokens)
- **Signed Releases**: All git tags are signed
- **Minimal Dependencies**: Only 2 runtime dependencies (`react` and `framer-motion` as peer dependencies)
- **Automated Publishing**: GitHub Actions workflow publishes on tag push to `main` (no manual publishes)

## Security Best Practices for Contributors

When contributing to boom-ui:

- ✅ Run `npm audit` before submitting PRs (pre-push hook enforces this)
- ✅ All CI checks must pass (includes type checking, linting, testing)
- ✅ Never commit secrets, API keys, or credentials (use environment variables)
- ⚠️ Use of `eval()`, `Function()`, or `innerHTML` requires maintainer security review
- ⚠️ Adding new dependencies requires justification (comment in PR explaining necessity)
- ⚠️ Use of `dangerouslySetInnerHTML` requires explicit security justification

See [SECURITY_CHECKLIST.md](./SECURITY_CHECKLIST.md) for detailed code review guidelines.

## Known Security Limitations

boom-ui is a UI component library. The following are **out of scope**:

- **Authentication and authorization**: Consumer's responsibility to implement
- **Server-side rendering (SSR) security**: Consumers using Next.js/Remix should follow their framework's security guidelines
- **Data sanitization**: Consumers must sanitize user input before passing to component props
- **Content Security Policy (CSP)**: Consumers should configure appropriate CSP headers for their application
- **CSS injection via style props**: Consumers should validate/sanitize style objects from untrusted sources

## Security Contact

For sensitive security matters not suitable for GitHub Security Advisories:

**Email**: brandon@whatisboom.com

**PGP key**: Not currently available (all reports via GitHub Security Advisories)

---

**Last updated**: 2026-01-12
**Next scheduled review**: 2026-04-12 (quarterly)
