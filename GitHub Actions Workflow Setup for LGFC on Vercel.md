# GitHub Actions Workflow Setup for LGFC on Vercel

## Overview

This workflow automates the build, test, and deployment process for the Lou Gehrig Fan Club website to Vercel with Supabase and Backblaze integration.

## Workflow Architecture

```
Push to main/develop or Create PR
    ↓
┌───────────────────────────────────────┐
│  1. Install Dependencies (cached)     │
└───────────────────────────────────────┘
    ↓
┌─────────────────┬─────────────────────┐
│  2. Lint Code   │  3. Run Tests       │
└─────────────────┴─────────────────────┘
    ↓
┌───────────────────────────────────────┐
│  4. Build Next.js Application         │
└───────────────────────────────────────┘
    ↓
┌─────────────────┬─────────────────────┐
│  5a. Deploy     │  5b. Deploy         │
│   Preview       │   Production        │
│  (PRs/develop)  │   (main only)       │
└─────────────────┴─────────────────────┘
    ↓ (production only)
┌───────────────────────────────────────┐
│  6. Database Health Check             │
└───────────────────────────────────────┘
    ↓
┌───────────────────────────────────────┐
│  7. Send Notifications                │
└───────────────────────────────────────┘
```

## File Structure

Create these files in your repository:

```
.github/
└── workflows/
    ├── deploy.yml          # Main deployment workflow
    ├── lighthouse.yml      # Performance monitoring (optional)
    └── security.yml        # Security scanning (optional)
```

## Required GitHub Secrets

Add these secrets in your GitHub repository settings:
`Settings → Secrets and variables → Actions → New repository secret`

### Vercel Secrets

```
VERCEL_TOKEN              # Vercel API token
VERCEL_ORG_ID            # Your Vercel organization ID
VERCEL_PROJECT_ID        # Your Vercel project ID
```

### Supabase Secrets

```
NEXT_PUBLIC_SUPABASE_URL          # https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY     # Public anonymous key
SUPABASE_SERVICE_ROLE_KEY         # Secret service role key
```

### Backblaze Secrets

```
BACKBLAZE_KEY_ID                  # Application key ID
BACKBLAZE_APPLICATION_KEY         # Application key (secret)
BACKBLAZE_BUCKET_NAME             # Bucket name
BACKBLAZE_ENDPOINT                # S3 endpoint
NEXT_PUBLIC_MEDIA_CDN_URL         # CDN URL for media
```

### Application Secrets

```
NEXT_PUBLIC_SITE_URL              # Your production URL
```

## Step-by-Step Setup

### 1. Get Vercel Credentials

**Get Vercel Token:**

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Link your project
vercel link

# Get your project details
vercel project ls
```

**Find Organization ID and Project ID:**

- Go to Vercel Dashboard → Project Settings
- **Org ID:** Settings → General → Organization ID
- **Project ID:** Project Settings → General → Project ID

**Generate Vercel Token:**

- Go to: https://vercel.com/account/tokens
- Create new token with scope: “Full Account”
- Copy the token (shown only once)

### 2. Add Secrets to GitHub

```bash
# Using GitHub CLI (recommended)
gh secret set VERCEL_TOKEN
gh secret set VERCEL_ORG_ID
gh secret set VERCEL_PROJECT_ID
gh secret set NEXT_PUBLIC_SUPABASE_URL
gh secret set NEXT_PUBLIC_SUPABASE_ANON_KEY
gh secret set SUPABASE_SERVICE_ROLE_KEY
gh secret set BACKBLAZE_KEY_ID
gh secret set BACKBLAZE_APPLICATION_KEY
gh secret set BACKBLAZE_BUCKET_NAME
gh secret set BACKBLAZE_ENDPOINT
gh secret set NEXT_PUBLIC_MEDIA_CDN_URL
gh secret set NEXT_PUBLIC_SITE_URL
```

Or use the provided script:

```bash
./scripts/create_secrets.sh
```

### 3. Create Workflow File

Create `.github/workflows/deploy.yml` with the main workflow content.

### 4. Configure Branch Protection (Optional but Recommended)

In GitHub repository settings:

**Settings → Branches → Add rule**

For branch: `main`

- ✅ Require a pull request before merging
- ✅ Require status checks to pass before merging
  - Select: `Build Next.js Application`
  - Select: `Lint and Type Check`
- ✅ Require branches to be up to date before merging

## Workflow Triggers

### Automatic Triggers

**Production Deployment:**

- Triggered on: Push to `main` branch
- Deploys to: Vercel Production
- URL: Your configured production domain

**Preview Deployment:**

- Triggered on: Pull requests to `main` or `develop`
- Triggered on: Push to `develop` branch
- Deploys to: Vercel Preview
- URL: Auto-generated preview URL (commented on PR)

### Manual Triggers

Add this to enable manual workflow runs:

```yaml
on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]
  workflow_dispatch:  # Enable manual runs
    inputs:
      environment:
        description: 'Environment to deploy to'
        required: true
        default: 'preview'
        type: choice
        options:
          - preview
          - production
```

## Workflow Features

### 1. Dependency Caching

- Caches `node_modules` for faster builds
- Cache key based on `package-lock.json`
- Reduces build time by 50-70%

### 2. Parallel Jobs

- Linting and testing run in parallel
- Faster feedback on code quality issues

### 3. Environment-Specific Builds

- Preview builds for PRs and develop branch
- Production builds only for main branch
- Different environment variables per environment

### 4. Health Checks

- Verifies Supabase connection after deployment
- Ensures database is accessible
- Fails deployment if health check fails

### 5. PR Comments

- Automatically comments preview URL on pull requests
- Provides quick access to preview deployments

### 6. Build Artifacts

- Uploads build artifacts for debugging
- Retained for 1 day
- Useful for troubleshooting build issues

## Testing the Workflow

### Test Preview Deployment

```bash
# Create a feature branch
git checkout -b feature/test-workflow

# Make a change
echo "# Test" >> README.md

# Commit and push
git add .
git commit -m "Test workflow"
git push origin feature/test-workflow

# Create pull request on GitHub
# Workflow will automatically run and deploy preview
```

### Test Production Deployment

```bash
# Merge PR to main or push directly to main
git checkout main
git merge feature/test-workflow
git push origin main

# Workflow will automatically deploy to production
```

## Monitoring Deployments

### View Workflow Status

**In GitHub:**

1. Go to repository → Actions tab
1. Click on workflow run to see details
1. View logs for each job

**Using GitHub CLI:**

```bash
# List recent workflow runs
gh run list --workflow=deploy.yml

# View specific run
gh run view [run-id]

# Watch live run
gh run watch
```

### View Deployment Status in Vercel

1. Go to Vercel Dashboard
1. Select your project
1. View deployments tab
1. See real-time build logs

## Troubleshooting

### Common Issues

**Issue: “VERCEL_TOKEN is not set”**

```bash
# Verify secret is set
gh secret list

# Set secret if missing
gh secret set VERCEL_TOKEN
```

**Issue: “Build failed - TypeScript errors”**

```bash
# Check TypeScript locally
npx tsc --noEmit

# Fix errors and commit
```

**Issue: “Supabase connection failed”**

```bash
# Verify Supabase URL and keys
echo $NEXT_PUBLIC_SUPABASE_URL

# Test connection locally
npm run test:db
```

**Issue: “Vercel deployment timeout”**

```yaml
# Increase timeout in workflow
- name: Deploy to Vercel Production
  timeout-minutes: 15  # Add this
```

### Debug Mode

Enable debug logging:

**In GitHub:**
Settings → Secrets → Add variable `ACTIONS_STEP_DEBUG` = `true`

**Or add to workflow:**

```yaml
env:
  ACTIONS_STEP_DEBUG: true
```

## Performance Optimization

### Build Caching

The workflow already caches:

- ✅ npm packages
- ✅ Next.js build cache (via Vercel)

### Build Speed Tips

1. **Use npm ci instead of npm install** (already implemented)
1. **Enable Next.js build cache:**
   
   ```json
   // next.config.js
   module.exports = {
     generateBuildId: async () => {
       return process.env.VERCEL_GIT_COMMIT_SHA || 'development'
     }
   }
   ```
1. **Optimize dependencies:**
   
   ```bash
   # Remove unused dependencies
   npm prune
   
   # Update to latest versions
   npm update
   ```

## Advanced Workflows

### Lighthouse Performance Testing

Create `.github/workflows/lighthouse.yml`:

```yaml
name: Lighthouse CI

on:
  pull_request:
    branches: [main]

jobs:
  lighthouse:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      
      - name: Install Lighthouse CI
        run: npm install -g @lhci/cli
      
      - name: Run Lighthouse
        run: lhci autorun
        env:
          LHCI_GITHUB_APP_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

### Security Scanning

Create `.github/workflows/security.yml`:

```yaml
name: Security Scan

on:
  push:
    branches: [main, develop]
  schedule:
    - cron: '0 0 * * 0'  # Weekly

jobs:
  security:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Run npm audit
        run: npm audit --audit-level=moderate
      
      - name: Run Snyk Security Scan
        uses: snyk/actions/node@master
        env:
          SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}
```

## Cost Optimization

### GitHub Actions Minutes

- Free tier: 2,000 minutes/month
- Current workflow: ~5-10 minutes per run
- Estimated runs: 200-400 per month (well within limits)

### Vercel Deployments

- Hobby plan: Unlimited deployments
- Pro plan: Unlimited deployments
- No additional costs for workflow integration

## Best Practices

### 1. Branch Strategy

```
main (production)
  ↑
develop (staging)
  ↑
feature/* (preview)
```

### 2. Commit Messages

Follow conventional commits:

```
feat: add voting component
fix: resolve supabase connection issue
docs: update workflow documentation
chore: update dependencies
```

### 3. PR Process

1. Create feature branch
1. Make changes and commit
1. Push and create PR
1. Wait for workflow to pass
1. Review preview deployment
1. Merge to main after approval

### 4. Environment Variables

- Never commit secrets to repository
- Use GitHub Secrets for sensitive data
- Prefix public variables with `NEXT_PUBLIC_`

## Maintenance

### Weekly Tasks

- [ ] Review workflow run history
- [ ] Check for failed deployments
- [ ] Monitor performance metrics

### Monthly Tasks

- [ ] Update dependencies: `npm update`
- [ ] Review and rotate API tokens
- [ ] Check Vercel usage and costs
- [ ] Review Supabase database size

### Quarterly Tasks

- [ ] Security audit: `npm audit`
- [ ] Review workflow efficiency
- [ ] Update Node.js version if needed
- [ ] Optimize build times

## Support

**Workflow Issues:**

- Check workflow logs in Actions tab
- Review error messages
- Contact: LouGehrigFanClub@gmail.com

**Vercel Issues:**

- Check Vercel dashboard logs
- Consult: https://vercel.com/docs

**Supabase Issues:**

- Check Supabase dashboard
- Consult: https://supabase.com/docs

## Additional Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Vercel CLI Documentation](https://vercel.com/docs/cli)
- [Next.js Deployment Guide](https://nextjs.org/docs/deployment)
- [Supabase Integration Guide](https://supabase.com/docs/guides/getting-started)

-----

**Last Updated:** October 2024  
**Version:** 1.0.0