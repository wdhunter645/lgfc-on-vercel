name: Lighthouse Performance Audit

on:
pull_request:
branches:
- main
push:
branches:
- main
schedule:
# Run weekly on Sundays at 2 AM UTC
- cron: ‘0 2 * * 0’
workflow_dispatch:

jobs:
lighthouse:
name: Run Lighthouse Audit
runs-on: ubuntu-latest
steps:
- name: Checkout Code
uses: actions/checkout@v4

```
  - name: Setup Node.js
    uses: actions/setup-node@v4
    with:
      node-version: '20'

  - name: Install Dependencies
    run: npm ci

  - name: Build Application
    run: npm run build
    env:
      NEXT_PUBLIC_SUPABASE_URL: ${{ secrets.NEXT_PUBLIC_SUPABASE_URL }}
      NEXT_PUBLIC_SUPABASE_ANON_KEY: ${{ secrets.NEXT_PUBLIC_SUPABASE_ANON_KEY }}
      NEXT_PUBLIC_SITE_URL: ${{ secrets.NEXT_PUBLIC_SITE_URL }}

  - name: Start Next.js Server
    run: |
      npm run start &
      npx wait-on http://localhost:3000

  - name: Run Lighthouse CI
    uses: treosh/lighthouse-ci-action@v10
    with:
      urls: |
        http://localhost:3000
        http://localhost:3000/prototype/index.html
      uploadArtifacts: true
      temporaryPublicStorage: true
      runs: 3

  - name: Check Performance Budgets
    uses: treosh/lighthouse-ci-action@v10
    with:
      urls: http://localhost:3000
      budgetPath: ./lighthouse-budget.json
      uploadArtifacts: true

  - name: Comment PR with Results
    if: github.event_name == 'pull_request'
    uses: actions/github-script@v7
    with:
      github-token: ${{ secrets.GITHUB_TOKEN }}
      script: |
        const fs = require('fs');
        const results = JSON.parse(fs.readFileSync('.lighthouseci/manifest.json'));
        const summary = `
        ## 🔍 Lighthouse Performance Report
        
        **Performance Score:** ${results[0].summary.performance * 100}
        **Accessibility Score:** ${results[0].summary.accessibility * 100}
        **Best Practices Score:** ${results[0].summary['best-practices'] * 100}
        **SEO Score:** ${results[0].summary.seo * 100}
        
        [View Full Report](${results[0].url})
        `;
        
        github.rest.issues.createComment({
          issue_number: context.issue.number,
          owner: context.repo.owner,
          repo: context.repo.repo,
          body: summary
        });

  - name: Upload Lighthouse Reports
    uses: actions/upload-artifact@v3
    with:
      name: lighthouse-reports
      path: .lighthouseci
      retention-days: 30

  - name: Fail if Performance Below Threshold
    run: |
      if [ $(jq '.[] | .summary.performance' .lighthouseci/manifest.json | bc) -lt 0.90 ]; then
        echo "❌ Performance score below 90%"
        exit 1
      fi
      echo "✅ Performance meets threshold"
```