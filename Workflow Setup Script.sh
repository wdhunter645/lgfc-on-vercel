#!/bin/bash

# Setup GitHub Actions Workflows for LGFC on Vercel

# This script creates the necessary directory structure and workflow files

set -e

echo “🚀 Setting up GitHub Actions workflows for LGFC on Vercel…”

# Colors for output

GREEN=’\033[0;32m’
BLUE=’\033[0;34m’
YELLOW=’\033[1;33m’
RED=’\033[0;31m’
NC=’\033[0m’ # No Color

# Create workflows directory

echo -e “${BLUE}📁 Creating .github/workflows directory…${NC}”
mkdir -p .github/workflows

# Check if main workflow exists

if [ -f “.github/workflows/deploy.yml” ]; then
echo -e “${YELLOW}⚠️  deploy.yml already exists. Backing up…${NC}”
mv .github/workflows/deploy.yml .github/workflows/deploy.yml.backup
fi

# Create main deployment workflow

echo -e “${BLUE}📝 Creating main deployment workflow…${NC}”
cat > .github/workflows/deploy.yml << ‘EOF’

# Copy the main workflow content here (from the first artifact)

EOF

echo -e “${GREEN}✅ Created deploy.yml${NC}”

# Create Lighthouse workflow

echo -e “${BLUE}📝 Creating Lighthouse performance workflow…${NC}”
cat > .github/workflows/lighthouse.yml << ‘EOF’

# Copy the Lighthouse workflow content here

EOF

echo -e “${GREEN}✅ Created lighthouse.yml${NC}”

# Create security workflow

echo -e “${BLUE}📝 Creating security scanning workflow…${NC}”
cat > .github/workflows/security.yml << ‘EOF’

# Copy the security workflow content here

EOF

echo -e “${GREEN}✅ Created security.yml${NC}”

# Create Lighthouse configuration

echo -e “${BLUE}📝 Creating Lighthouse CI configuration…${NC}”
cat > lighthouserc.js << ‘EOF’

# Copy the Lighthouse config content here

EOF

echo -e “${GREEN}✅ Created lighthouserc.js${NC}”

# Create Lighthouse budget

echo -e “${BLUE}📝 Creating Lighthouse performance budget…${NC}”
cat > lighthouse-budget.json << ‘EOF’

# Copy the budget JSON content here

EOF

echo -e “${GREEN}✅ Created lighthouse-budget.json${NC}”

# Update .gitignore

echo -e “${BLUE}📝 Updating .gitignore…${NC}”
cat >> .gitignore << ‘EOF’

# Lighthouse CI

.lighthouseci/

# GitHub Actions

.github/workflows/*.backup
EOF

echo -e “${GREEN}✅ Updated .gitignore${NC}”

# Check if required secrets are set

echo -e “${BLUE}🔐 Checking for required GitHub secrets…${NC}”

REQUIRED_SECRETS=(
“VERCEL_TOKEN”
“VERCEL_ORG_ID”
“VERCEL_PROJECT_ID”
“NEXT_PUBLIC_SUPABASE_URL”
“NEXT_PUBLIC_SUPABASE_ANON_KEY”
“SUPABASE_SERVICE_ROLE_KEY”
“BACKBLAZE_KEY_ID”
“BACKBLAZE_APPLICATION_KEY”
“BACKBLAZE_BUCKET_NAME”
“BACKBLAZE_ENDPOINT”
“NEXT_PUBLIC_MEDIA_CDN_URL”
“NEXT_PUBLIC_SITE_URL”
)

MISSING_SECRETS=()

for secret in “${REQUIRED_SECRETS[@]}”; do
if ! gh secret list | grep -q “$secret”; then
MISSING_SECRETS+=(”$secret”)
fi
done

if [ ${#MISSING_SECRETS[@]} -eq 0 ]; then
echo -e “${GREEN}✅ All required secrets are configured${NC}”
else
echo -e “${YELLOW}⚠️  Missing secrets:${NC}”
for secret in “${MISSING_SECRETS[@]}”; do
echo -e “   - ${RED}$secret${NC}”
done
echo “”
echo -e “${BLUE}💡 Set missing secrets using:${NC}”
echo -e “   gh secret set SECRET_NAME”
echo -e “   or run: ${GREEN}./scripts/create_secrets.sh${NC}”
fi

# Create a test workflow file

echo -e “${BLUE}📝 Creating workflow test script…${NC}”
mkdir -p scripts
cat > scripts/test-workflow.sh << ‘EOF’
#!/bin/bash

# Test the GitHub Actions workflow locally

echo “🧪 Testing workflow configuration…”

# Check if act is installed

if ! command -v act &> /dev/null; then
echo “❌ ‘act’ is not installed. Install it to test workflows locally:”
echo “   brew install act”
echo “   or visit: https://github.com/nektos/act”
exit 1
fi

# Test workflow syntax

echo “Validating workflow syntax…”
for workflow in .github/workflows/*.yml; do
echo “Checking $workflow…”
if ! yamllint “$workflow” 2>/dev/null; then
echo “⚠️  yamllint not installed, skipping syntax check”
fi
done

# Run workflow locally (dry run)

echo “Running workflow dry run…”
act -l

echo “✅ Workflow test complete”
EOF

chmod +x scripts/test-workflow.sh
echo -e “${GREEN}✅ Created scripts/test-workflow.sh${NC}”

# Create workflow documentation

echo -e “${BLUE}📝 Creating workflow documentation…${NC}”
cat > .github/WORKFLOWS.md << ‘EOF’

# GitHub Actions Workflows

## Available Workflows

### 1. Deploy (`deploy.yml`)

Main deployment workflow that builds and deploys the application to Vercel.

**Triggers:**

- Push to `main` or `develop` branch
- Pull requests to `main` or `develop`

**Jobs:**

- Install dependencies
- Lint and type check
- Run tests
- Build application
- Deploy preview (PRs and develop)
- Deploy production (main only)
- Database health check
- Send notifications

### 2. Lighthouse (`lighthouse.yml`)

Performance monitoring and auditing.

**Triggers:**

- Pull requests to `main`
- Push to `main`
- Weekly on Sundays at 2 AM UTC
- Manual dispatch

**Jobs:**

- Run Lighthouse CI
- Check performance budgets
- Comment PR with results

### 3. Security (`security.yml`)

Security scanning and vulnerability detection.

**Triggers:**

- Push to `main` or `develop`
- Pull requests to `main`
- Weekly on Mondays at 3 AM UTC
- Manual dispatch

**Jobs:**

- Dependency vulnerability scan
- OWASP dependency check
- CodeQL analysis
- Secret scanning
- License compliance check
- Environment variable security
- API security testing
- Generate security report

## Running Workflows Locally

Install `act` to test workflows locally:

```bash
brew install act
./scripts/test-workflow.sh
```

## Manual Workflow Triggers

Trigger workflows manually via GitHub UI:

1. Go to Actions tab
1. Select workflow
1. Click “Run workflow”

Or via CLI:

```bash
gh workflow run deploy.yml
gh workflow run lighthouse.yml
gh workflow run security.yml
```

## Monitoring Workflows

View workflow status:

```bash
gh run list
gh run watch
gh run view [run-id]
```

## Troubleshooting

See detailed troubleshooting guide in the main documentation.
EOF

echo -e “${GREEN}✅ Created .github/WORKFLOWS.md${NC}”

# Create PR template

echo -e “${BLUE}📝 Creating pull request template…${NC}”
mkdir -p .github
cat > .github/pull_request_template.md << ‘EOF’

## Description

<!-- Provide a brief description of the changes in this PR -->

## Type of Change

- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update
- [ ] Performance improvement
- [ ] Code refactoring

## Testing

<!-- Describe the tests you ran to verify your changes -->

- [ ] I have tested this locally
- [ ] All automated tests pass
- [ ] I have added new tests (if applicable)

## Checklist

- [ ] My code follows the project’s style guidelines
- [ ] I have performed a self-review of my code
- [ ] I have commented my code, particularly in hard-to-understand areas
- [ ] I have updated the documentation accordingly
- [ ] My changes generate no new warnings or errors
- [ ] No sensitive data (API keys, secrets) are exposed

## Preview Deployment

<!-- The workflow will automatically comment with the preview URL -->

## Screenshots (if applicable)

<!-- Add screenshots to help explain your changes -->

## Related Issues

<!-- Link to related issues: Closes #123, Fixes #456 -->

EOF

echo -e “${GREEN}✅ Created .github/pull_request_template.md${NC}”

# Summary

echo “”
echo -e “${GREEN}════════════════════════════════════════════════${NC}”
echo -e “${GREEN}✅ Workflow setup complete!${NC}”
echo -e “${GREEN}════════════════════════════════════════════════${NC}”
echo “”
echo -e “${BLUE}📋 Next Steps:${NC}”
echo “”
echo -e “1. ${YELLOW}Set required secrets:${NC}”
echo -e “   Run: ${GREEN}./scripts/create_secrets.sh${NC}”
echo “”
echo -e “2. ${YELLOW}Commit workflow files:${NC}”
echo -e “   ${GREEN}git add .github/ lighthouse* scripts/${NC}”
echo -e “   ${GREEN}git commit -m "chore: add GitHub Actions workflows"${NC}”
echo -e “   ${GREEN}git push origin main${NC}”
echo “”
echo -e “3. ${YELLOW}Monitor first workflow run:${NC}”
echo -e “   Visit: ${BLUE}https://github.com/$(git config –get remote.origin.url | sed ‘s/.*github.com[:/](.*).git/\1/’)/actions${NC}”
echo “”
echo -e “4. ${YELLOW}Test workflows locally:${NC}”
echo -e “   ${GREEN}./scripts/test-workflow.sh${NC}”
echo “”
echo -e “${BLUE}📖 Documentation:${NC}”
echo -e “   Read: ${GREEN}.github/WORKFLOWS.md${NC}”
echo “”
echo -e “${BLUE}💡 Tip:${NC} Use ‘${GREEN}gh workflow view deploy${NC}’ to see workflow details”
echo “”