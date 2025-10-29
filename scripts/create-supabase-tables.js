#!/usr/bin/env node

/**
 * Create Supabase Tables Script
 * This script applies all database migrations to create the required tables in Supabase.
 * 
 * Usage:
 *   node scripts/create-supabase-tables.js
 * 
 * Prerequisites:
 *   - Environment variables set in .env file:
 *     - NEXT_PUBLIC_SUPABASE_URL
 *     - NEXT_PUBLIC_SUPABASE_ANON_KEY (or NEXT_PUBLIC_SUPABASE_API_KEY)
 *     - SUPABASE_SERVICE_ROLE_KEY (required for creating tables)
 */

import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  bold: '\x1b[1m'
};

const log = {
  success: (msg) => console.log(`${colors.green}✅ ${msg}${colors.reset}`),
  error: (msg) => console.log(`${colors.red}❌ ${msg}${colors.reset}`),
  warning: (msg) => console.log(`${colors.yellow}⚠️  ${msg}${colors.reset}`),
  info: (msg) => console.log(`${colors.blue}ℹ️  ${msg}${colors.reset}`),
  step: (msg) => console.log(`${colors.cyan}${colors.bold}▶  ${msg}${colors.reset}`)
};

async function createTables() {
  console.log('\n' + '='.repeat(70));
  console.log(`${colors.bold}${colors.cyan}  🏗️  Create Supabase Tables  ${colors.reset}`);
  console.log('='.repeat(70) + '\n');

  // Check environment variables
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl) {
    log.error('Missing NEXT_PUBLIC_SUPABASE_URL');
    log.info('Please set this environment variable in your .env file');
    process.exit(1);
  }

  if (!serviceRoleKey) {
    log.error('Missing SUPABASE_SERVICE_ROLE_KEY');
    log.info('This key is required to create tables');
    log.info('You can find it in your Supabase project settings:');
    log.info('  Dashboard → Settings → API → service_role key');
    log.info('\nAlternatively, you can create tables manually:');
    log.info('  1. Go to your Supabase project dashboard');
    log.info('  2. Navigate to SQL Editor');
    log.info('  3. Copy and paste the contents of supabase-migrations.sql');
    log.info('  4. Click "Run" to execute');
    process.exit(1);
  }

  log.info(`Connecting to: ${supabaseUrl}`);
  
  // Read migration files
  const migrationsDir = path.join(__dirname, '..', 'supabase', 'migrations');
  const migrationFiles = fs.readdirSync(migrationsDir)
    .filter(file => file.endsWith('.sql'))
    .sort();

  if (migrationFiles.length === 0) {
    log.error('No migration files found in supabase/migrations/');
    process.exit(1);
  }

  log.info(`Found ${migrationFiles.length} migration files\n`);

  // Create Supabase client with service role key
  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });

  let successCount = 0;
  let errorCount = 0;

  // Process each migration file
  for (const file of migrationFiles) {
    const filePath = path.join(migrationsDir, file);
    const sql = fs.readFileSync(filePath, 'utf8');
    
    log.step(`Applying migration: ${file}`);

    try {
      // Split SQL into individual statements
      const statements = sql
        .split(';')
        .map(s => s.trim())
        .filter(s => s.length > 0 && !s.startsWith('--'));

      for (const statement of statements) {
        // Skip comments and empty statements
        if (!statement || statement.startsWith('--')) continue;

        // Execute each statement using Supabase REST API
        const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': serviceRoleKey,
            'Authorization': `Bearer ${serviceRoleKey}`
          },
          body: JSON.stringify({ query: statement + ';' })
        });

        if (!response.ok) {
          const error = await response.text();
          // Check if it's an "already exists" error, which is fine
          if (error.includes('already exists') || error.includes('42P07')) {
            log.warning(`  ↳ Already exists, skipping`);
          } else {
            throw new Error(`HTTP ${response.status}: ${error}`);
          }
        }
      }

      log.success(`  ✓ ${file} completed`);
      successCount++;
    } catch (error) {
      log.error(`  ✗ ${file} failed: ${error.message}`);
      errorCount++;
    }

    console.log(); // Empty line for spacing
  }

  // Summary
  console.log('='.repeat(70));
  console.log(`${colors.bold}Summary:${colors.reset}`);
  log.success(`${successCount} migrations applied successfully`);
  if (errorCount > 0) {
    log.error(`${errorCount} migrations failed`);
  }
  console.log('='.repeat(70) + '\n');

  if (errorCount > 0) {
    log.warning('Some migrations failed. Please try the manual approach:');
    log.info('  1. Go to your Supabase project dashboard');
    log.info('  2. Navigate to: SQL Editor');
    log.info('  3. Copy contents of: supabase-migrations.sql');
    log.info('  4. Paste and click "Run"');
    log.info(`\nOr visit: ${supabaseUrl.replace('https://', 'https://supabase.com/dashboard/project/')}/sql/new`);
    process.exit(1);
  }

  log.success('All tables created successfully! 🎉\n');
  log.info('Next steps:');
  console.log('  1. Verify tables in Supabase Dashboard: Table Editor');
  console.log('  2. Test connection: npm run db:test');
  console.log('  3. Seed sample data: npm run db:seed\n');
}

// Run the script
createTables().catch((error) => {
  log.error(`Unexpected error: ${error.message}`);
  console.error(error);
  process.exit(1);
});
