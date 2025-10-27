# 🚀 Quick Start: Deploy LGFC to Vercel

This guide will get your Lou Gehrig Fan Club website deployed to Vercel with GitHub Actions in under 30 minutes.

## Prerequisites

- GitHub account
- Vercel account
- Supabase account (free tier)
- Backblaze B2 account (free tier)
- Node.js 18+ installed locally

## Step 1: Clone and Setup Repository (2 minutes)

```bash
# Clone the repository
git clone https://github.com/wdhunter645/lgfc-on-vercel.git
cd lgfc-on-vercel

# Install dependencies
npm install

# Test local development
npm run dev
# Visit http://localhost:3000
```

## Step 2: Setup Workflows (5 minutes)

```bash
# Run the workflow setup script
chmod +x scripts/setup-workflows.sh
./scripts/setup-workflows.sh

# This creates:
# - .github/workflows/deploy.yml
# - .github/workflows/lighthouse.yml  
# - .github/workflows/security.yml
# - lighthouse-budget.json
# - lighthouserc.js
```

## Step 3: Create Supabase Project (5 minutes)

1. **Go to:** https://supabase.com/dashboard
1. **Create new project:**
- Name: `lgfc-production`
- Database password: (generate strong password)
- Region: Choose closest to your audience
1. **Get credentials:**
- Go to Settings → API
- Copy: `Project URL` and `anon public` key
- Copy: `service_role` key (keep secret!)
1. **Run migrations:**
   
   ```bash
   # Set environment variables temporarily
   export NEXT_PUBLIC_SUPABASE_URL="your-project-url"
   export SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"
   
   # Run migrations
   npm run db:migrate
   ```

## Step 4: Create Backblaze B2 Bucket (5 minutes)

1. **Go to:** https://www.backblaze.com/b2/cloud-storage.html
1. **Create bucket:**
- Bucket Name: `lgfc-media-production`
- Files: Public
1. **Create application key:**
- Go to App Keys → Add New Application Key
- Name: `lgfc-vercel`
- Access: Read and Write
- Copy: `keyID` and `applicationKey`

## Step 5: Connect to Vercel (5 minutes)

### Option A: Vercel Dashboard (Easiest)

1. **Go to:** https://vercel.com/new
1. **Import Git Repository:**
- Select: `wdhunter645/lgfc-on-vercel`
- Click: Import
1. **Configure:**
- Framework: Next.js (auto-detected)
- Root Directory: `./`
- Click: Deploy (will fail - that’s OK, we need env vars)
1. **Add Environment Variables:**
- Go to: Project Settings → Environment Variables
- Add all variables from Step 7 below

### Option B: Vercel CLI (Faster)

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Link project
vercel link

# Get your project details
vercel project ls

# Note your ORG_ID and PROJECT_ID
```

## Step 6: Create GitHub Personal Access Token (2 minutes)

1. **Go to:** https://github.com/settings/tokens/new
1. **Create token:**
- Name: `lgfc-workflow`
- Expiration: 90 days
- Scopes:
  - ✅ `repo` (full control)
  - ✅ `read:org`
  - ✅ `workflow`
1. **Copy token** (shown only once!)

## Step 7: Set GitHub Secrets (5 minutes)

### Method 1: Using Script (Fastest)

```bash
# Create .env file with all values
cat > .env << 'EOF'
# Vercel
VERCEL_TOKEN=your_vercel_token_here
VERCEL_ORG_ID=your_org_id
VERCEL_PROJECT_ID=your_project_id

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbG...
SUPABASE_SERVICE_ROLE_KEY=eyJhbG...

# Backblaze
BACKBLAZE_KEY_ID=your_key_id
BACKBLAZE_APPLICATION_KEY=your_app_key
BACKBLAZE_BUCKET_NAME=lgfc-media-production
BACKBLAZE_ENDPOINT=s3.us-west-004.backblazeb2.com
NEXT_PUBLIC_MEDIA_CDN_URL=https://f004.backblazeb2.com/file/lgfc-media-production

# Application
NEXT_PUBLIC_SITE_URL=https://your-domain.vercel.app
EOF

# Authenticate with GitHub
gh auth login
# (paste your PAT token when prompted)

# Run the secrets creation script
./scripts/create_secrets.sh
```

### Method 2: Manual (One at a time)

```bash
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

### Method 3: GitHub UI

1. Go to: Repository → Settings → Secrets and variables → Actions
1. Click “New repository secret”
1. Add each secret from the list above

## Step 8: Deploy! (1 minute)

```bash
# Commit workflow files
git add .github/ lighthouse* scripts/
git commit -m "chore: add CI/CD workflows"

# Push to main branch (triggers production deployment)
git push origin main
```

## Step 9: Monitor Deployment (2 minutes)

```bash
# Watch workflow progress
gh run watch

# Or visit GitHub Actions tab:
# https://github.com/wdhunter645/lgfc-on-vercel/actions
```

## Step 10: Verify Deployment (2 minutes)

### Check Workflow Status

```bash
# List recent runs
gh run list

# View specific run
gh run view

# Check deployment status
vercel ls
```

### Test Your Site

1. **Visit production URL:** `https://your-project.vercel.app`
1. **Test features:**
- [ ] Homepage loads
- [ ] Prototype accessible at `/prototype/index.html`
- [ ] No console errors
1. **Run health checks:**
   
   ```bash
   npm run test:db
   ```

## Troubleshooting

### Issue: Workflow fails with “VERCEL_TOKEN not set”

**Solution:**

```bash
# Verify secrets are set
gh secret list

# Re-set the secret
gh secret set VERCEL_TOKEN
```

### Issue: Supabase connection fails

**Solution:**

```bash
# Test connection locally
npm run test:db

# Check environment variables
echo $NEXT_PUBLIC_SUPABASE_URL

# Verify in Vercel dashboard
vercel env ls
```

### Issue: Build fails

**Solution:**

```bash
# Test build locally
npm run build

# Check logs
gh run view --log-failed
```

### Issue: 403 errors when creating secrets

**Solution:**

```bash
# Make sure PAT has correct scopes
gh auth status

# Re-authenticate with new token
gh auth logout
gh auth login
```

## Next Steps

### 1. Add Sample Data

```bash
# Seed database with sample content
npm run db:seed
```

### 2. Configure Custom Domain

In Vercel Dashboard:

1. Go to: Project Settings → Domains
1. Add your custom domain
1. Update DNS records as instructed
1. Update `NEXT_PUBLIC_SITE_URL` secret

### 3. Enable Branch Protection

In GitHub Repository Settings:

1. Settings → Branches → Add rule
1. Branch name: `main`
1. Enable:
- ✅ Require pull request before merging
- ✅ Require status checks to pass
- ✅ Require branches to be up to date

### 4. Set Up Development Environment

```bash
# Create develop branch
git checkout -b develop
git push origin develop

# Set up develop branch in Vercel
vercel --prod=false
```

### 5. Test Preview Deployments

```bash
# Create feature branch
git checkout -b feature/test-preview

# Make a change
echo "# Test" >> README.md

# Commit and push
git add .
git commit -m "test: preview deployment"
git push origin feature/test-preview

# Create PR on GitHub
# Workflow will automatically deploy preview
```

## Workflow Features

### ✅ Automatic Deployments

- **Production:** Push to `main` → deploys to production
- **Preview:** PRs and `develop` branch → preview deployments
- **Comments:** Preview URLs automatically posted to PRs

### ✅ Quality Checks

- **Linting:** ESLint checks on every push
- **Type checking:** TypeScript validation
- **Testing:** Jest tests (when added)
- **Security:** Weekly vulnerability scans

### ✅ Performance Monitoring

- **Lighthouse:** Weekly performance audits
- **Budgets:** Enforces performance budgets
- **Reports:** Uploaded as artifacts

## Common Commands

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm run start            # Start production server

# Quality
npm run lint             # Run linter
npm run type-check       # Check TypeScript
npm run test             # Run tests
npm run format           # Format code

#
```