# Git Workflow Reference

This project uses **git-flow** for branch management and releases.

## Branch Structure

**Long-lived branches:**
- `main` - Production-ready code, only updated via release merges
- `develop` - Default branch for daily development, integration branch

**Short-lived branches:**
- `feature/*` - Feature development (created from `develop`)
- `release/v*` - Release preparation (created from `develop`)
- `hotfix/v*` - Emergency production fixes (created from `main`)

## Branch Management Rules

**NEVER reuse git branches.** Once a branch has been merged to `develop` or `main`, create a new branch for any additional work.

**Why:** Each branch should represent a single, focused unit of work. Reusing branches:
- Creates confusing commit history
- Makes code review difficult
- Complicates cherry-picking or reverting

**Correct pattern:**
```bash
git checkout develop
git pull
git checkout -b feature/descriptive-name-for-new-work
```

## Force Push Guidelines

**NEVER use `git push --force` or `git push -f` unless absolutely necessary.**

**When force push is NEVER acceptable:**
- On `main` or `develop` branches
- On any branch with an open pull request
- On any branch where others have based their work
- To "fix" a merge conflict (use proper merge resolution)
- To remove a commit (use `git revert` instead)

**The ONLY acceptable use cases:**
1. **Local history rewrite on unshared feature branch** - You're the only one who has ever pulled this branch
   ```bash
   git checkout feature/my-branch
   git rebase -i develop
   git push --force-with-lease origin feature/my-branch
   ```

2. **Recovering from accidental push of sensitive data** - Immediately after accidentally pushing secrets/credentials

**Always use `--force-with-lease` instead of `--force`** - it fails if someone else pushed since your last fetch.

**Safe alternatives:**
- Instead of rebasing shared branches → Use merge commits
- Instead of fixing a bad commit → Use `git revert`
- Instead of cleaning up history → Accept commits are permanent, or squash during PR merge

## Git Worktrees

This project uses git worktrees (`.worktrees/` directory) for isolated development environments.

**CRITICAL: Always update branches before creating new worktrees:**

```bash
# WRONG - creating worktree without updating
git worktree add .worktrees/my-feature -b feature/my-feature

# CORRECT - update first, then create worktree
git checkout develop
git pull origin develop
git worktree add .worktrees/my-feature -b feature/my-feature
cd .worktrees/my-feature
npm install
```

**Worktree best practices:**
- Always pull latest `develop` before creating feature branch worktrees
- Always pull latest `main` before creating hotfix branch worktrees
- Run `npm install` in new worktrees
- Delete when done: `git worktree remove .worktrees/my-feature`
- The `.worktrees/` directory is in `.gitignore`

## Daily Development Workflow

```bash
# Create feature branch
git checkout develop
git pull
git checkout -b feature/my-feature

# Develop and commit changes
# ...

# Push and create PR targeting develop
git push -u origin feature/my-feature
# Create PR: feature/my-feature → develop
```

**CI/CD Build Times:**
- Expect CI checks to take approximately **5 minutes**
- Includes: typecheck, lint, test, build, and build-storybook jobs
- PRs with auto-merge enabled will merge automatically once all checks pass

## Release Process

```bash
# 1. Determine version (semver):
#    - Breaking changes → Major (v1.0.0)
#    - New features → Minor (v0.5.0)
#    - Bug fixes only → Patch (v0.4.1)

# 2. Create release branch from develop
git checkout develop
git pull
git checkout -b release/v0.5.0

# 3. Bump version in package.json
# Edit package.json: "version": "0.5.0"

# 4. Commit and push
git add package.json
git commit -m "Bump version to 0.5.0"
git push -u origin release/v0.5.0

# 5. Create PR: release/v0.5.0 → main
# Wait for CI checks to pass, then merge
# GitHub Actions will automatically:
#    - Detect the version change
#    - Create tag v0.5.0
#    - Publish to npm
#    - Create GitHub release with notes
#    - Merge main to develop
#    - Delete the release branch
```

## Hotfix Process (Emergency Fixes)

```bash
# 1. Create hotfix from main
git checkout main
git pull
git checkout -b hotfix/v0.4.1

# 2. Fix bug and bump version
# Edit package.json: "version": "0.4.1"
git add .
git commit -m "Fix critical bug and bump to v0.4.1"

# 3. Create PR: hotfix/v0.4.1 → main
# Merge after review - automation handles the rest
```

## Publishing Details

**Fully Automated via GitHub Actions:**

When a release or hotfix branch is merged to `main`, the workflow automatically:
1. Detects version change in `package.json`
2. Creates a git tag (e.g., `v0.5.0`)
3. Runs pre-publish checks (via `prepublishOnly` hook)
4. Publishes to npm with provenance
5. Creates GitHub release with auto-generated notes
6. Merges the release/hotfix branch back to `develop`
7. Deletes the release/hotfix branch
8. Posts a summary comment on the original PR

**Conflict Handling:**
- If merge to `develop` has conflicts, a PR is automatically created for manual resolution

**Pre-publish checks** (enforced by `prepublishOnly` hook):
- Type checking passes (`npm run typecheck`)
- All tests pass (`npm run test:ci`)
- Build succeeds (`npm run build`)

**Security:**
- Uses npm OIDC for secure publishing (no long-lived tokens)
- Publishes with provenance (`--provenance` flag) for supply chain security
