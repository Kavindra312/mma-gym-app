# CI/CD Pipeline

This document describes the Continuous Integration and Continuous Deployment setup for the MMA Gym App.

## Overview

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Feature   │    │    Pull     │    │   Merge to  │    │   Deploy    │
│   Branch    │───▶│   Request   │───▶│   develop   │───▶│  to Staging │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
                          │
                    ┌─────▼─────┐
                    │    CI     │
                    │  Checks   │
                    │ (Lint +   │
                    │  Tests)   │
                    └───────────┘
```

## Workflows

### 1. CI Workflow (`ci.yml`)

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

### 2. Deploy Staging Workflow (`deploy-staging.yml`)

**Triggers:**
- Push to `develop` branch

**Steps:**
1. Checkout code
2. Trigger Railway deployment via webhook

**Required Secrets:**
- `RAILWAY_WEBHOOK_URL` - Railway deploy webhook URL

## Branch Strategy

```
main (production)
  │
  └── develop (staging)
        │
        ├── feature/add-user-profile
        ├── feature/qr-check-in
        └── bugfix/fix-login-error
```

- **main** - Production-ready code only
- **develop** - Integration branch, deploys to staging
- **feature/*** - New features, branched from develop
- **bugfix/*** - Bug fixes, branched from develop

## Setup Instructions

### 1. Add GitHub Secrets

Go to your repository: **Settings > Secrets and variables > Actions**

Add these secrets:

| Secret | Description |
|--------|-------------|
| `DATABASE_URL` | Supabase PostgreSQL connection string |
| `RAILWAY_WEBHOOK_URL` | Railway deploy webhook (from Railway dashboard) |

### 2. Configure Branch Protection

Go to: **Settings > Branches > Add rule**

#### For `main` branch:

- [x] Require a pull request before merging
- [x] Require status checks to pass before merging
  - [x] Require branches to be up to date before merging
  - Select required checks: `Lint & Test`
- [x] Require conversation resolution before merging
- [ ] Include administrators (optional)

#### For `develop` branch:

- [x] Require a pull request before merging
- [x] Require status checks to pass before merging
  - [x] Require branches to be up to date before merging
  - Select required checks: `Lint & Test`

### 3. Set Up Railway

1. Create a new project at [railway.app](https://railway.app)
2. Connect your GitHub repository
3. Configure environment variables:
   ```
   NODE_ENV=staging
   DATABASE_URL=<your-supabase-url>
   JWT_SECRET=<generate-secure-secret>
   PORT=3001
   ```
4. Set the start command: `npm start`
5. Set the root directory: `backend`
6. Copy the deploy webhook URL from **Settings > Deploy**

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
- Actions tab: `https://github.com/Kavindra312/mma-gym-app/actions`
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

### Deploy fails

1. Check Railway logs for errors
2. Verify environment variables are set
3. Ensure webhook URL is correct in GitHub secrets
