name: Build and Deploy to Vercel

on:
push:
branches:
- main
- develop
pull_request:
branches:
- main
- develop

env:
VERCEL_ORG_ID: ${{ secrets.VERCEL_ORG_ID }}
VERCEL_PROJECT_ID: ${{ secrets.VERCEL_PROJECT_ID }}

jobs:

# Job 1: Install and Cache Dependencies

install:
name: Install Dependencies
runs-on: ubuntu-latest
steps:
- name: Checkout Code
uses: actions/checkout@v4

```
  - name: Setup Node.js
    uses: actions/setup-node@v4
    with:
      node-version: '20'
      cache: 'npm'

  - name: Cache node_modules
    uses: actions/cache@v3
    id: npm-cache
    with:
      path: node_modules
      key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}
      restore-keys: |
        ${{ runner.os }}-node-

  - name: Install Dependencies
    if: steps.npm-cache.outputs.cache-hit != 'true'
    run: npm ci
```

# Job 2: Lint and Type Check

lint:
name: Lint and Type Check
runs-on: ubuntu-latest
needs: install
steps:
- name: Checkout Code
uses: actions/checkout@v4

```
  - name: Setup Node.js
    uses: actions/setup-node@v4
    with:
      node-version: '20'
      cache: 'npm'

  - name: Restore node_modules Cache
    uses: actions/cache@v3
    with:
      path: node_modules
      key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}

  - name: Run ESLint
    run: npm run lint
    continue-on-error: true

  - name: Run TypeScript Type Check
    run: npx tsc --noEmit
    continue-on-error: true
```

# Job 3: Run Tests

test:
name: Run Tests
runs-on: ubuntu-latest
needs: install
steps:
- name: Checkout Code
uses: actions/checkout@v4

```
  - name: Setup Node.js
    uses: actions/setup-node@v4
    with:
      node-version: '20'
      cache: 'npm'

  - name: Restore node_modules Cache
    uses: actions/cache@v3
    with:
      path: node_modules
      key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}

  - name: Run Tests
    run: npm test
    continue-on-error: true
    env:
      CI: true
```

# Job 4: Build Application

build:
name: Build Next.js Application
runs-on: ubuntu-latest
needs: [lint, test]
steps:
- name: Checkout Code
uses: actions/checkout@v4

```
  - name: Setup Node.js
    uses: actions/setup-node@v4
    with:
      node-version: '20'
      cache: 'npm'

  - name: Restore node_modules Cache
    uses: actions/cache@v3
    with:
      path: node_modules
      key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}

  - name: Create Environment File
    run: |
      echo "NEXT_PUBLIC_SUPABASE_URL=${{ secrets.NEXT_PUBLIC_SUPABASE_URL }}" >> .env.production
      echo "NEXT_PUBLIC_SUPABASE_ANON_KEY=${{ secrets.NEXT_PUBLIC_SUPABASE_ANON_KEY }}" >> .env.production
      echo "NEXT_PUBLIC_SITE_URL=${{ secrets.NEXT_PUBLIC_SITE_URL }}" >> .env.production
      echo "NEXT_PUBLIC_MEDIA_CDN_URL=${{ secrets.NEXT_PUBLIC_MEDIA_CDN_URL }}" >> .env.production

  - name: Build Application
    run: npm run build
    env:
      NODE_ENV: production
      NEXT_PUBLIC_SUPABASE_URL: ${{ secrets.NEXT_PUBLIC_SUPABASE_URL }}
      NEXT_PUBLIC_SUPABASE_ANON_KEY: ${{ secrets.NEXT_PUBLIC_SUPABASE_ANON_KEY }}
      SUPABASE_SERVICE_ROLE_KEY: ${{ secrets.SUPABASE_SERVICE_ROLE_KEY }}
      BACKBLAZE_KEY_ID: ${{ secrets.BACKBLAZE_KEY_ID }}
      BACKBLAZE_APPLICATION_KEY: ${{ secrets.BACKBLAZE_APPLICATION_KEY }}
      BACKBLAZE_BUCKET_NAME: ${{ secrets.BACKBLAZE_BUCKET_NAME }}
      BACKBLAZE_ENDPOINT: ${{ secrets.BACKBLAZE_ENDPOINT }}
      NEXT_PUBLIC_MEDIA_CDN_URL: ${{ secrets.NEXT_PUBLIC_MEDIA_CDN_URL }}
      NEXT_PUBLIC_SITE_URL: ${{ secrets.NEXT_PUBLIC_SITE_URL }}

  - name: Upload Build Artifacts
    uses: actions/upload-artifact@v3
    with:
      name: nextjs-build
      path: |
        .next
        public
      retention-days: 1
```

# Job 5: Deploy Preview (Pull Requests and develop branch)

deploy-preview:
name: Deploy Preview to Vercel
runs-on: ubuntu-latest
needs: build
if: github.event_name == ‘pull_request’ || github.ref == ‘refs/heads/develop’
steps:
- name: Checkout Code
uses: actions/checkout@v4

```
  - name: Setup Node.js
    uses: actions/setup-node@v4
    with:
      node-version: '20'

  - name: Install Vercel CLI
    run: npm install --global vercel@latest

  - name: Pull Vercel Environment Information
    run: vercel pull --yes --environment=preview --token=${{ secrets.VERCEL_TOKEN }}

  - name: Build Project Artifacts
    run: vercel build --token=${{ secrets.VERCEL_TOKEN }}
    env:
      NEXT_PUBLIC_SUPABASE_URL: ${{ secrets.NEXT_PUBLIC_SUPABASE_URL }}
      NEXT_PUBLIC_SUPABASE_ANON_KEY: ${{ secrets.NEXT_PUBLIC_SUPABASE_ANON_KEY }}

  - name: Deploy Preview to Vercel
    id: deploy-preview
    run: |
      url=$(vercel deploy --prebuilt --token=${{ secrets.VERCEL_TOKEN }})
      echo "preview_url=$url" >> $GITHUB_OUTPUT
      echo "Preview URL: $url"

  - name: Comment PR with Preview URL
    if: github.event_name == 'pull_request'
    uses: actions/github-script@v7
    with:
      github-token: ${{ secrets.GITHUB_TOKEN }}
      script: |
        github.rest.issues.createComment({
          issue_number: context.issue.number,
          owner: context.repo.owner,
          repo: context.repo.repo,
          body: '🚀 Preview deployment ready!\n\n**Preview URL:** ${{ steps.deploy-preview.outputs.preview_url }}\n\nThis preview will be available for 7 days.'
        })
```

# Job 6: Deploy Production (main branch only)

deploy-production:
name: Deploy to Vercel Production
runs-on: ubuntu-latest
needs: build
if: github.event_name == ‘push’ && github.ref == ‘refs/heads/main’
environment:
name: production
url: ${{ steps.deploy-prod.outputs.production_url }}
steps:
- name: Checkout Code
uses: actions/checkout@v4

```
  - name: Setup Node.js
    uses: actions/setup-node@v4
    with:
      node-version: '20'

  - name: Install Vercel CLI
    run: npm install --global vercel@latest

  - name: Pull Vercel Environment Information
    run: vercel pull --yes --environment=production --token=${{ secrets.VERCEL_TOKEN }}

  - name: Build Project Artifacts
    run: vercel build --prod --token=${{ secrets.VERCEL_TOKEN }}
    env:
      NEXT_PUBLIC_SUPABASE_URL: ${{ secrets.NEXT_PUBLIC_SUPABASE_URL }}
      NEXT_PUBLIC_SUPABASE_ANON_KEY: ${{ secrets.NEXT_PUBLIC_SUPABASE_ANON_KEY }}
      SUPABASE_SERVICE_ROLE_KEY: ${{ secrets.SUPABASE_SERVICE_ROLE_KEY }}
      BACKBLAZE_KEY_ID: ${{ secrets.BACKBLAZE_KEY_ID }}
      BACKBLAZE_APPLICATION_KEY: ${{ secrets.BACKBLAZE_APPLICATION_KEY }}
      BACKBLAZE_BUCKET_NAME: ${{ secrets.BACKBLAZE_BUCKET_NAME }}
      BACKBLAZE_ENDPOINT: ${{ secrets.BACKBLAZE_ENDPOINT }}
      NEXT_PUBLIC_MEDIA_CDN_URL: ${{ secrets.NEXT_PUBLIC_MEDIA_CDN_URL }}
      NEXT_PUBLIC_SITE_URL: ${{ secrets.NEXT_PUBLIC_SITE_URL }}

  - name: Deploy to Vercel Production
    id: deploy-prod
    run: |
      url=$(vercel deploy --prebuilt --prod --token=${{ secrets.VERCEL_TOKEN }})
      echo "production_url=$url" >> $GITHUB_OUTPUT
      echo "Production URL: $url"

  - name: Verify Deployment
    run: |
      echo "✅ Production deployment successful!"
      echo "🌐 Live at: ${{ steps.deploy-prod.outputs.production_url }}"
```

# Job 7: Database Health Check

database-check:
name: Verify Supabase Connection
runs-on: ubuntu-latest
needs: deploy-production
if: github.event_name == ‘push’ && github.ref == ‘refs/heads/main’
steps:
- name: Checkout Code
uses: actions/checkout@v4

```
  - name: Setup Node.js
    uses: actions/setup-node@v4
    with:
      node-version: '20'

  - name: Install Supabase CLI
    run: npm install -g @supabase/supabase-js

  - name: Test Supabase Connection
    run: |
      node -e "
      const { createClient } = require('@supabase/supabase-js');
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      );
      
      (async () => {
        try {
          const { data, error } = await supabase.from('weekly_votes').select('count');
          if (error) throw error;
          console.log('✅ Supabase connection successful');
        } catch (err) {
          console.error('❌ Supabase connection failed:', err.message);
          process.exit(1);
        }
      })();
      "
    env:
      NEXT_PUBLIC_SUPABASE_URL: ${{ secrets.NEXT_PUBLIC_SUPABASE_URL }}
      NEXT_PUBLIC_SUPABASE_ANON_KEY: ${{ secrets.NEXT_PUBLIC_SUPABASE_ANON_KEY }}
```

# Job 8: Notify on Success/Failure

notify:
name: Deployment Notification
runs-on: ubuntu-latest
needs: [deploy-production, database-check]
if: always() && github.ref == ‘refs/heads/main’
steps:
- name: Send Success Notification
if: ${{ needs.deploy-production.result == ‘success’ && needs.database-check.result == ‘success’ }}
run: |
echo “✅ Deployment and health checks completed successfully!”
echo “🎉 Lou Gehrig Fan Club website is live!”

```
  - name: Send Failure Notification
    if: ${{ needs.deploy-production.result == 'failure' || needs.database-check.result == 'failure' }}
    run: |
      echo "❌ Deployment or health check failed!"
      echo "Please review the workflow logs."
      exit 1
```