#!/usr/bin/env node

/**
 * Export Supabase Migrations to SQL File
 * This script exports all migrations to a single SQL file that can be run manually
 */

require('dotenv').config();
const fs = require('fs');
const path = require('path');

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  blue: '\x1b[34m',
  yellow: '\x1b[33m'
};

const log = {
  success: (msg) => console.log(`${colors.green}✅ ${msg}${colors.reset}`),
  info: (msg) => console.log(`${colors.blue}ℹ️  ${msg}${colors.reset}`),
  warning: (msg) => console.log(`${colors.yellow}⚠️  ${msg}${colors.reset}`)
};

// Import migrations from the original migration file
const { migrations } = require('./run-migrations.js');

function exportMigrations() {
  console.log('\n📝 Exporting Supabase Migrations to SQL File...\n');

  const header = `-- Supabase Database Schema Migrations
-- Lou Gehrig Fan Club (lgfc-on-vercel)
--
-- Instructions:
-- 1. Go to your Supabase project dashboard
-- 2. Navigate to SQL Editor (left sidebar)
-- 3. Create a new query
-- 4. Copy and paste this entire file
-- 5. Click "Run" to execute all migrations
--
-- This file is idempotent - safe to run multiple times

`;

  let sqlContent = header;

  // Add each migration with headers
  Object.entries(migrations).forEach(([name, sql], index) => {
    const migrationNumber = String(index + 1).padStart(3, '0');
    const title = name.replace(/^\d+_/, '').replace(/_/g, ' ');
    
    sqlContent += `-- =================================================================
-- Migration ${migrationNumber}: ${title}
-- =================================================================

${sql.trim()}

`;
  });

  sqlContent += `-- =================================================================
-- All migrations completed!
-- =================================================================
`;

  // Write to file
  const outputPath = path.join(__dirname, '..', 'supabase-migrations.sql');
  fs.writeFileSync(outputPath, sqlContent, 'utf8');

  log.success(`Migrations exported to: supabase-migrations.sql`);
  log.info('\nTo run these migrations:');
  console.log('  1. Open your Supabase project dashboard');
  console.log('  2. Go to SQL Editor');
  console.log('  3. Copy the contents of supabase-migrations.sql');
  console.log('  4. Paste and run in SQL Editor');
  console.log('');
  log.info('Alternatively, if you have network access:');
  console.log('  npm run db:migrate  (requires SUPABASE_SERVICE_ROLE_KEY)');
  console.log('');
}

if (require.main === module) {
  try {
    exportMigrations();
  } catch (error) {
    console.error('Error exporting migrations:', error.message);
    process.exit(1);
  }
}

module.exports = { exportMigrations };
