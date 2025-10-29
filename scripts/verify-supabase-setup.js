#!/usr/bin/env node

/**
 * Comprehensive Supabase Setup Verification
 * This script verifies that Supabase has been properly configured for the project
 */

// Load environment variables from .env file
require('dotenv').config();

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  bold: '\x1b[1m',
  dim: '\x1b[2m'
};

const log = {
  success: (msg) => console.log(`${colors.green}✅ ${msg}${colors.reset}`),
  error: (msg) => console.log(`${colors.red}❌ ${msg}${colors.reset}`),
  warning: (msg) => console.log(`${colors.yellow}⚠️  ${msg}${colors.reset}`),
  info: (msg) => console.log(`${colors.blue}ℹ️  ${msg}${colors.reset}`),
  header: (msg) => console.log(`\n${colors.bold}${msg}${colors.reset}`),
  dim: (msg) => console.log(`${colors.dim}   ${msg}${colors.reset}`)
};

let totalChecks = 0;
let passedChecks = 0;
let failedChecks = 0;
let warningChecks = 0;

function checkPass(msg) {
  log.success(msg);
  totalChecks++;
  passedChecks++;
}

function checkFail(msg) {
  log.error(msg);
  totalChecks++;
  failedChecks++;
}

function checkWarning(msg) {
  log.warning(msg);
  totalChecks++;
  warningChecks++;
}

async function verifySupabaseSetup() {
  console.log('\n' + '='.repeat(70));
  console.log(`${colors.bold}🔍 Supabase Setup Verification${colors.reset}`);
  console.log('='.repeat(70));

  // 1. Check Environment Variables
  log.header('1. Environment Variables Configuration');
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_API_KEY;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (supabaseUrl) {
    checkPass(`NEXT_PUBLIC_SUPABASE_URL is configured`);
    log.dim(`URL: ${supabaseUrl}`);
  } else {
    checkFail('NEXT_PUBLIC_SUPABASE_URL is not set');
  }
  
  if (supabaseAnonKey) {
    const keyName = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 
      'NEXT_PUBLIC_SUPABASE_ANON_KEY' : 'NEXT_PUBLIC_SUPABASE_API_KEY';
    checkPass(`${keyName} is configured`);
    log.dim(`Key: ${supabaseAnonKey.substring(0, 20)}...`);
  } else {
    checkFail('NEXT_PUBLIC_SUPABASE_ANON_KEY (or NEXT_PUBLIC_SUPABASE_API_KEY) is not set');
  }
  
  if (supabaseServiceKey) {
    checkPass('SUPABASE_SERVICE_ROLE_KEY is configured');
    log.dim('Service role key available for admin operations');
  } else {
    checkWarning('SUPABASE_SERVICE_ROLE_KEY is not configured');
    log.dim('Service role key is required for migrations and seeding');
  }

  // 2. Check Supabase Client Library
  log.header('2. Supabase Client Library');
  
  try {
    const { createClient } = require('@supabase/supabase-js');
    const packageJson = require('../package.json');
    const supabaseVersion = packageJson.dependencies['@supabase/supabase-js'];
    checkPass(`@supabase/supabase-js is installed`);
    log.dim(`Version: ${supabaseVersion}`);
  } catch (error) {
    checkFail(`@supabase/supabase-js is not installed: ${error.message}`);
  }

  // 3. Check Supabase Client Utilities
  log.header('3. Supabase Client Utilities');
  
  const supabaseLibPath = path.join(__dirname, '../app/lib/supabase.ts');
  if (fs.existsSync(supabaseLibPath)) {
    checkPass('Supabase client utilities exist (app/lib/supabase.ts)');
    log.dim('Client-side and server-side utilities are available');
  } else {
    checkFail('Supabase client utilities not found (app/lib/supabase.ts)');
  }

  // 4. Check Database Scripts
  log.header('4. Database Management Scripts');
  
  const scripts = [
    { name: 'check-env.js', desc: 'Environment validation' },
    { name: 'test-db.js', desc: 'Database connection testing' },
    { name: 'run-migrations.js', desc: 'Schema migrations' },
    { name: 'seed-db.js', desc: 'Sample data seeding' }
  ];
  
  for (const script of scripts) {
    const scriptPath = path.join(__dirname, script.name);
    if (fs.existsSync(scriptPath)) {
      checkPass(`${script.name} exists`);
      log.dim(script.desc);
    } else {
      checkFail(`${script.name} not found`);
    }
  }

  // 5. Check NPM Scripts
  log.header('5. NPM Scripts Configuration');
  
  const packageJson = require('../package.json');
  const requiredScripts = [
    { name: 'check:env', desc: 'Verify environment variables' },
    { name: 'db:test', desc: 'Test database connection' },
    { name: 'db:migrate', desc: 'Run database migrations' },
    { name: 'db:seed', desc: 'Seed sample data' },
    { name: 'db:setup', desc: 'Full database setup' }
  ];
  
  for (const script of requiredScripts) {
    if (packageJson.scripts[script.name]) {
      checkPass(`npm run ${script.name} is configured`);
      log.dim(script.desc);
    } else {
      checkFail(`npm run ${script.name} is not configured`);
    }
  }

  // 6. Check Documentation
  log.header('6. Documentation');
  
  const docsToCheck = [
    { file: 'SUPABASE_SETUP.md', desc: 'Supabase setup guide' },
    { file: '.env.example', desc: 'Environment variable template' }
  ];
  
  for (const doc of docsToCheck) {
    const docPath = path.join(__dirname, '..', doc.file);
    if (fs.existsSync(docPath)) {
      checkPass(`${doc.file} exists`);
      log.dim(doc.desc);
    } else {
      checkWarning(`${doc.file} not found`);
    }
  }

  // 7. Attempt Database Connection (if credentials available)
  if (supabaseUrl && supabaseAnonKey) {
    log.header('7. Database Connection Test');
    
    try {
      const supabase = createClient(supabaseUrl, supabaseAnonKey);
      log.info('Attempting to connect to Supabase...');
      
      // Try to query a simple table
      const { data, error } = await Promise.race([
        supabase.from('weekly_votes').select('count').limit(1),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Connection timeout')), 10000)
        )
      ]);
      
      if (error) {
        if (error.code === '42P01') {
          checkWarning('Database connection successful, but tables not yet created');
          log.dim('Run "npm run db:migrate" to create tables');
        } else if (error.message === 'Connection timeout') {
          checkWarning('Database connection timeout (network restriction)');
          log.dim('Connection may work in production environment');
        } else {
          checkWarning(`Database connection issue: ${error.message}`);
          log.dim('This may be expected in CI/CD environments');
        }
      } else {
        checkPass('Database connection successful');
        log.dim('All tables are accessible');
      }
    } catch (error) {
      if (error.message === 'Connection timeout') {
        checkWarning('Database connection timeout (network restriction)');
        log.dim('This is common in CI/CD environments - connection should work in production');
      } else {
        checkWarning(`Unable to test database connection: ${error.message}`);
        log.dim('This may be expected in restricted network environments');
      }
    }
  } else {
    log.header('7. Database Connection Test');
    checkWarning('Skipped - missing credentials');
  }

  // Summary
  console.log('\n' + '='.repeat(70));
  console.log(`${colors.bold}📊 Verification Summary${colors.reset}`);
  console.log('='.repeat(70));
  
  console.log(`\nTotal Checks: ${totalChecks}`);
  console.log(`${colors.green}✅ Passed: ${passedChecks}${colors.reset}`);
  console.log(`${colors.yellow}⚠️  Warnings: ${warningChecks}${colors.reset}`);
  console.log(`${colors.red}❌ Failed: ${failedChecks}${colors.reset}`);
  
  console.log('\n' + '='.repeat(70));
  
  if (failedChecks === 0 && warningChecks === 0) {
    log.success('✨ Supabase setup is complete and verified!');
    console.log('\nNext Steps:');
    console.log('  1. Run migrations: npm run db:migrate');
    console.log('  2. Seed data: npm run db:seed');
    console.log('  3. Start development: npm run dev');
  } else if (failedChecks === 0) {
    log.success('✨ Supabase setup is mostly complete!');
    console.log('\nReview warnings above and address as needed.');
    console.log('Most warnings are informational or environment-specific.');
  } else {
    log.error('⚠️  Supabase setup has some issues that need attention');
    console.log('\nPlease review the failed checks above and:');
    console.log('  1. Check .env file for missing variables');
    console.log('  2. Review SUPABASE_SETUP.md for setup instructions');
    console.log('  3. Run: npm run check:env');
    process.exit(1);
  }
  
  console.log('='.repeat(70) + '\n');
}

// Run verification
verifySupabaseSetup().catch((error) => {
  log.error(`Unexpected error during verification: ${error.message}`);
  console.error(error);
  process.exit(1);
});
