# CI/CD Pipeline

This document describes the Continuous Integration setup for the MMA Gym App.

## Overview

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Feature   │    │    Pull     │    │   Merge     │
│   Branch    │───▶│   Request   │───▶│   to main   │
└─────────────┘    └─────────────┘    └─────────────┘
                          │
                    ┌─────▼─────┐
                    │    CI     │
                    │  Checks   │
                    │ (Lint +   │
                    │  Tests)   │
                    └───────────┘
                          │
                    ┌─────▼─────┐
                    │  ✅ Pass  │──▶ Can merge
                    │  ❌ Fail  │──▶ Blocked
                    └───────────┘
```

## CI Workflow (`ci.yml`)

**Triggers:**
- Pull requests to `main` or `develop`
- Pushes to `main` or `develop`

**Steps:**
1. Checkout code
2. Setup Node.js 20
3. Install dependencies (`npm ci`)
4. Run linting (`npm run lint`)
5. Run tests (`npm test`)

**Required Secrets:**
- `DATABASE_URL` - Supabase connection string for running tests

## Setup Instructions

### 1. Add GitHub Secrets

Go to your repository: **Settings > Secrets and variables > Actions**

Add this secret:

| Secret | Description |
|--------|-------------|
| `DATABASE_URL` | Supabase PostgreSQL connection string |

### 2. Configure Branch Protection (Recommended)

Go to: **Settings > Branches > Add rule**

For `main` branch:

- [x] Require a pull request before merging
- [x] Require status checks to pass before merging
  - [x] Require branches to be up to date before merging
  - Select required checks: `Lint & Test`
- [x] Require conversation resolution before merging

This ensures failed tests block merging.

## Running Checks Locally

Before pushing, run checks locally:

```bash
cd backend

# Run linting
npm run lint

# Fix auto-fixable lint issues
npm run lint:fix

# Run tests
npm test
```

## Workflow Status

Check workflow status at:
- Actions tab: https://github.com/Kavindra312/mma-gym-app/actions
- Status badge in README

## Troubleshooting

### Tests fail in CI but pass locally

1. Ensure `DATABASE_URL` secret is set in GitHub
2. Check if tests rely on local-only data
3. Review test output in Actions tab

### Lint fails

1. Run `npm run lint:fix` to auto-fix issues
2. Manually fix remaining issues
3. Commit and push

## Future: Staging Deployment

When ready for staging deployment, options include:
- **Vercel** - Free tier, easy Node.js deployment
- **Railway** - Simple container deployment
- **Render** - Free tier with PostgreSQL support
- **Fly.io** - Edge deployment with free tier
