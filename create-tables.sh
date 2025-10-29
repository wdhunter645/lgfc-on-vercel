#!/bin/bash

##############################################################################
# Quick Table Creation Script for Supabase
# 
# This script provides the fastest way to create all required tables
# in your Supabase database.
##############################################################################

set -e  # Exit on error

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color
BOLD='\033[1m'

echo ""
echo "=========================================================================="
echo -e "${BOLD}${BLUE}  🏗️  Quick Supabase Table Creation${NC}"
echo "=========================================================================="
echo ""

# Check if .env file exists
if [ ! -f .env ]; then
    echo -e "${RED}❌ Error: .env file not found${NC}"
    echo ""
    echo "Please create a .env file with your Supabase credentials:"
    echo "  NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co"
    echo "  NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key"
    echo "  SUPABASE_SERVICE_ROLE_KEY=your-service-role-key"
    echo ""
    exit 1
fi

# Check if node_modules exists
if [ ! -d node_modules ]; then
    echo -e "${YELLOW}⚠️  Dependencies not installed. Running npm install...${NC}"
    npm install
    echo ""
fi

# Run the migration script
echo -e "${BLUE}ℹ️  Creating tables in Supabase...${NC}"
echo ""

npm run db:migrate

# Check exit code
if [ $? -eq 0 ]; then
    echo ""
    echo "=========================================================================="
    echo -e "${GREEN}${BOLD}✅ Success! All tables created in Supabase${NC}"
    echo "=========================================================================="
    echo ""
    echo "Next steps:"
    echo "  1. Verify tables: npm run db:test"
    echo "  2. Seed sample data: npm run db:seed"
    echo "  3. Start development: npm run dev"
    echo ""
else
    echo ""
    echo "=========================================================================="
    echo -e "${RED}❌ Table creation failed${NC}"
    echo "=========================================================================="
    echo ""
    echo "Try the manual method instead:"
    echo "  1. Go to your Supabase project dashboard"
    echo "  2. Navigate to: SQL Editor"
    echo "  3. Copy contents of: supabase-migrations.sql"
    echo "  4. Paste and click 'Run'"
    echo ""
    echo "For detailed instructions, see: CREATE_TABLES.md"
    echo ""
    exit 1
fi
