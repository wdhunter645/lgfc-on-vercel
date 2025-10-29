#!/usr/bin/env node

/**
 * Test Supabase Database Connection
 * This script verifies the connection to Supabase and checks table accessibility
 */

import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

// Color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m'
};

const log = {
  success: (msg) => console.log(`${colors.green}✅ ${msg}${colors.reset}`),
  error: (msg) => console.log(`${colors.red}❌ ${msg}${colors.reset}`),
  warning: (msg) => console.log(`${colors.yellow}⚠️  ${msg}${colors.reset}`),
  info: (msg) => console.log(`${colors.blue}ℹ️  ${msg}${colors.reset}`)
};

async function testSupabaseConnection() {
  console.log('\n🔍 Testing Supabase Connection…\n');

  // Check environment variables
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_API_KEY;

  if (!supabaseUrl || !supabaseKey) {
    log.error('Missing Supabase credentials');
    log.info('Required environment variables:');
    console.log('  - NEXT_PUBLIC_SUPABASE_URL');
    console.log('  - NEXT_PUBLIC_SUPABASE_ANON_KEY (or NEXT_PUBLIC_SUPABASE_API_KEY)');
    process.exit(1);
  }

  log.info(`Connecting to: ${supabaseUrl}`);

  // Create Supabase client
  const supabase = createClient(supabaseUrl, supabaseKey);

  // Test 1: Basic connection
  try {
    log.info('Test 1: Basic connection');
    const { data, error } = await supabase.from('weekly_votes').select('count');

    if (error) {
      if (error.code === '42P01') {
        log.warning('Table "weekly_votes" does not exist yet');
        log.info('Run database migrations to create tables');
      } else {
        throw error;
      }
    } else {
      log.success('Basic connection successful');
    }
  } catch (error) {
    log.error(`Connection failed: ${error.message}`);
    process.exit(1);
  }

  // Test 2: Check all required tables
  const tables = [
    'weekly_votes',
    'vote_records',
    'friends_of_club',
    'timeline_events',
    'faq_items',
    'calendar_events'
  ];

  log.info('\nTest 2: Checking required tables');

  for (const table of tables) {
    try {
      const { error } = await supabase.from(table).select('count').limit(1);

      if (error) {
        if (error.code === '42P01') {
          log.warning(`Table "${table}" not found`);
        } else {
          log.error(`Error accessing "${table}": ${error.message}`);
        }
      } else {
        log.success(`Table "${table}" accessible`);
      }
    } catch (error) {
      log.error(`Error checking "${table}": ${error.message}`);
    }
  }

  // Test 3: Check row-level security
  log.info('\nTest 3: Testing Row-Level Security (RLS)');

  try {
    const { data, error } = await supabase
      .from('weekly_votes')
      .select('*')
      .limit(1);

    if (error) {
      if (error.code === '42501') {
        log.warning('RLS is enabled but policy may be too restrictive');
      } else if (error.code !== '42P01') {
        throw error;
      }
    } else {
      log.success('RLS policies configured correctly');
    }
  } catch (error) {
    log.error(`RLS test failed: ${error.message}`);
  }

  // Test 4: Test service role key (if available)
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (serviceRoleKey) {
    log.info('\nTest 4: Testing service role key');
    const adminSupabase = createClient(supabaseUrl, serviceRoleKey);

    try {
      const { data, error } = await adminSupabase
        .from('weekly_votes')
        .select('count');
      
      if (error && error.code !== '42P01') {
        throw error;
      }
      
      log.success('Service role key working correctly');
    } catch (error) {
      log.error(`Service role test failed: ${error.message}`);
    }
  } else {
    log.info('\nTest 4: Service role key not configured (skipping)');
  }

  // Summary
  console.log('\n' + '='.repeat(50));
  log.success('Supabase connection tests completed!');
  console.log('='.repeat(50) + '\n');
}

// Run tests
testSupabaseConnection().catch((error) => {
  log.error(`Unexpected error: ${error.message}`);
  process.exit(1);
});
