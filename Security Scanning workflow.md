name: Security Scanning

on:
push:
branches:
- main
- develop
pull_request:
branches:
- main
schedule:
# Run weekly security scan on Mondays at 3 AM UTC
- cron: ‘0 3 * * 1’
workflow_dispatch:

jobs:

# Job 1: Dependency Vulnerability Scan

dependency-scan:
name: Scan Dependencies for Vulnerabilities
runs-on: ubuntu-latest
steps:
- name: Checkout Code
uses: actions/checkout@v4

```
  - name: Setup Node.js
    uses: actions/setup-node@v4
    with:
      node-version: '20'

  - name: Run npm audit
    run: |
      npm audit --audit-level=moderate --production
    continue-on-error: true

  - name: Generate Audit Report
    run: |
      npm audit --json > audit-report.json
      echo "### 🔒 NPM Audit Summary" >> $GITHUB_STEP_SUMMARY
      npm audit >> $GITHUB_STEP_SUMMARY || true

  - name: Upload Audit Report
    uses: actions/upload-artifact@v3
    with:
      name: npm-audit-report
      path: audit-report.json
```

# Job 2: OWASP Dependency Check

owasp-check:
name: OWASP Dependency Check
runs-on: ubuntu-latest
steps:
- name: Checkout Code
uses: actions/checkout@v4

```
  - name: Run OWASP Dependency Check
    uses: dependency-check/Dependency-Check_Action@main
    with:
      project: 'lgfc-on-vercel'
      path: '.'
      format: 'HTML'
      args: >
        --failOnCVSS 7
        --enableRetired

  - name: Upload OWASP Report
    uses: actions/upload-artifact@v3
    with:
      name: owasp-dependency-check-report
      path: reports
```

# Job 3: CodeQL Analysis

codeql-analysis:
name: CodeQL Security Analysis
runs-on: ubuntu-latest
permissions:
actions: read
contents: read
security-events: write
steps:
- name: Checkout Code
uses: actions/checkout@v4

```
  - name: Initialize CodeQL
    uses: github/codeql-action/init@v2
    with:
      languages: javascript, typescript
      queries: security-and-quality

  - name: Perform CodeQL Analysis
    uses: github/codeql-action/analyze@v2
```

# Job 4: Secret Scanning

secret-scan:
name: Scan for Exposed Secrets
runs-on: ubuntu-latest
steps:
- name: Checkout Code
uses: actions/checkout@v4
with:
fetch-depth: 0

```
  - name: TruffleHog Secret Scan
    uses: trufflesecurity/trufflehog@main
    with:
      path: ./
      base: ${{ github.event.repository.default_branch }}
      head: HEAD
      extra_args: --debug --only-verified
```

# Job 5: Container Security Scan (if using Docker)

container-scan:
name: Scan Container Images
runs-on: ubuntu-latest
if: false  # Enable if using Docker
steps:
- name: Checkout Code
uses: actions/checkout@v4

```
  - name: Build Docker Image
    run: docker build -t lgfc-app:latest .

  - name: Run Trivy Vulnerability Scanner
    uses: aquasecurity/trivy-action@master
    with:
      image-ref: 'lgfc-app:latest'
      format: 'sarif'
      output: 'trivy-results.sarif'

  - name: Upload Trivy Results to GitHub Security
    uses: github/codeql-action/upload-sarif@v2
    with:
      sarif_file: 'trivy-results.sarif'
```

# Job 6: License Compliance Check

license-check:
name: Check License Compliance
runs-on: ubuntu-latest
steps:
- name: Checkout Code
uses: actions/checkout@v4

```
  - name: Setup Node.js
    uses: actions/setup-node@v4
    with:
      node-version: '20'

  - name: Install License Checker
    run: npm install -g license-checker

  - name: Check Licenses
    run: |
      license-checker --production --json > licenses.json
      license-checker --production --summary

  - name: Verify Approved Licenses
    run: |
      # Fail if GPL or AGPL licenses found
      if license-checker --production --failOn "GPL;AGPL" ; then
        echo "❌ Incompatible licenses detected"
        exit 1
      fi
      echo "✅ All licenses are compliant"

  - name: Upload License Report
    uses: actions/upload-artifact@v3
    with:
      name: license-report
      path: licenses.json
```

# Job 7: Environment Variable Security Check

env-security:
name: Check Environment Variables Security
runs-on: ubuntu-latest
steps:
- name: Checkout Code
uses: actions/checkout@v4

```
  - name: Check for Exposed Secrets in Code
    run: |
      echo "Checking for hardcoded secrets..."
      
      # Check for common secret patterns
      if grep -r -E "(NEXT_PUBLIC_|API_KEY|SECRET|PASSWORD|TOKEN)" --include="*.ts" --include="*.tsx" --include="*.js" --include="*.jsx" .; then
        echo "⚠️  Warning: Found potential secrets in code"
        echo "Please ensure these are not hardcoded values"
      fi
      
      # Check .env files are not committed
      if git ls-files | grep -E "\.env$|\.env\.local$|\.env\.production$"; then
        echo "❌ .env files should not be committed"
        exit 1
      fi
      
      echo "✅ No .env files committed"

  - name: Verify .gitignore Configuration
    run: |
      if ! grep -q "\.env" .gitignore; then
        echo "❌ .env not in .gitignore"
        exit 1
      fi
      echo "✅ .gitignore properly configured"
```

# Job 8: API Security Testing

api-security:
name: API Endpoint Security Testing
runs-on: ubuntu-latest
needs: []
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

  - name: Check API Route Security
    run: |
      echo "Checking API routes for security best practices..."
      
      # Check for rate limiting
      if ! grep -r "ratelimit" app/api/; then
        echo "⚠️  Warning: No rate limiting detected in API routes"
      fi
      
      # Check for CORS configuration
      if ! grep -r "cors" app/api/; then
        echo "⚠️  Warning: No CORS configuration detected"
      fi
      
      # Check for input validation
      if ! grep -r "zod\|yup\|joi" app/api/; then
        echo "⚠️  Warning: No input validation library detected"
      fi
      
      echo "✅ API security checks completed"
```

# Job 9: Generate Security Report

security-report:
name: Generate Security Summary
runs-on: ubuntu-latest
needs: [dependency-scan, codeql-analysis, secret-scan, license-check, env-security]
if: always()
steps:
- name: Download All Artifacts
uses: actions/download-artifact@v3

```
  - name: Generate Security Summary
    run: |
      echo "# 🔒 Security Scan Summary" >> $GITHUB_STEP_SUMMARY
      echo "" >> $GITHUB_STEP_SUMMARY
      echo "## Scan Results" >> $GITHUB_STEP_SUMMARY
      echo "" >> $GITHUB_STEP_SUMMARY
      
      if [ "${{ needs.dependency-scan.result }}" == "success" ]; then
        echo "✅ Dependency Scan: Passed" >> $GITHUB_STEP_SUMMARY
      else
        echo "❌ Dependency Scan: Failed" >> $GITHUB_STEP_SUMMARY
      fi
      
      if [ "${{ needs.codeql-analysis.result }}" == "success" ]; then
        echo "✅ CodeQL Analysis: Passed" >> $GITHUB_STEP_SUMMARY
      else
        echo "❌ CodeQL Analysis: Failed" >> $GITHUB_STEP_SUMMARY
      fi
      
      if [ "${{ needs.secret-scan.result }}" == "success" ]; then
        echo "✅ Secret Scanning: Passed" >> $GITHUB_STEP_SUMMARY
      else
        echo "❌ Secret Scanning: Failed" >> $GITHUB_STEP_SUMMARY
      fi
      
      if [ "${{ needs.license-check.result }}" == "success" ]; then
        echo "✅ License Check: Passed" >> $GITHUB_STEP_SUMMARY
      else
        echo "❌ License Check: Failed" >> $GITHUB_STEP_SUMMARY
      fi
      
      if [ "${{ needs.env-security.result }}" == "success" ]; then
        echo "✅ Environment Security: Passed" >> $GITHUB_STEP_SUMMARY
      else
        echo "❌ Environment Security: Failed" >> $GITHUB_STEP_SUMMARY
      fi
      
      echo "" >> $GITHUB_STEP_SUMMARY
      echo "**Report Generated:** $(date)" >> $GITHUB_STEP_SUMMARY

  - name: Comment PR with Security Summary
    if: github.event_name == 'pull_request'
    uses: actions/github-script@v7
    with:
      github-token: ${{ secrets.GITHUB_TOKEN }}
      script: |
        const summary = `
        ## 🔒 Security Scan Results
        
        | Check | Status |
        |-------|--------|
        | Dependency Scan | ${{ needs.dependency-scan.result == 'success' && '✅ Passed' || '❌ Failed' }} |
        | CodeQL Analysis | ${{ needs.codeql-analysis.result == 'success' && '✅ Passed' || '❌ Failed' }} |
        | Secret Scanning | ${{ needs.secret-scan.result == 'success' && '✅ Passed' || '❌ Failed' }} |
        | License Check | ${{ needs.license-check.result == 'success' && '✅ Passed' || '❌ Failed' }} |
        | Environment Security | ${{ needs.env-security.result == 'success' && '✅ Passed' || '❌ Failed' }} |
        
        View detailed reports in the [workflow artifacts](${context.payload.repository.html_url}/actions/runs/${context.runId}).
        `;
        
        github.rest.issues.createComment({
          issue_number: context.issue.number,
          owner: context.repo.owner,
          repo: context.repo.repo,
          body: summary
        });
```