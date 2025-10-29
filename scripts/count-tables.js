#!/usr/bin/env node

/**
 * Count Tables in Supabase Database
 * This script queries the Supabase database to count and list all tables
 */

import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

// Color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  bold: '\x1b[1m',
  cyan: '\x1b[36m'
};

const log = {
  success: (msg) => console.log(`${colors.green}✅ ${msg}${colors.reset}`),
  error: (msg) => console.log(`${colors.red}❌ ${msg}${colors.reset}`),
  warning: (msg) => console.log(`${colors.yellow}⚠️  ${msg}${colors.reset}`),
  info: (msg) => console.log(`${colors.blue}ℹ️  ${msg}${colors.reset}`),
  header: (msg) => console.log(`\n${colors.bold}${colors.cyan}${msg}${colors.reset}`),
};

async function countTables() {
  console.log('\n' + '='.repeat(70));
  log.header('📊 Counting Tables in Supabase Database');
  console.log('='.repeat(70) + '\n');

  // Check environment variables
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 
                      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 
                      process.env.NEXT_PUBLIC_SUPABASE_API_KEY;

  if (!supabaseUrl || !supabaseKey) {
    log.error('Missing Supabase credentials');
    log.info('Required environment variables:');
    console.log('  - NEXT_PUBLIC_SUPABASE_URL');
    console.log('  - SUPABASE_SERVICE_ROLE_KEY (preferred) or');
    console.log('  - NEXT_PUBLIC_SUPABASE_ANON_KEY');
    process.exit(1);
  }

  log.info(`Connecting to: ${supabaseUrl}`);

  // Create Supabase client
  const supabase = createClient(supabaseUrl, supabaseKey);

  // List of expected tables based on documentation
  const expectedTables = [
    'weekly_votes',
    'vote_records',
    'friends_of_club',
    'timeline_events',
    'faq_items',
    'calendar_events'
  ];

  console.log('\n' + colors.bold + 'Checking Tables:' + colors.reset + '\n');

  const foundTables = [];
  const missingTables = [];

  // Check each expected table
  for (const tableName of expectedTables) {
    try {
      const { error } = await supabase
        .from(tableName)
        .select('count')
        .limit(0);

      if (error) {
        if (error.code === '42P01') {
          log.error(`Table "${tableName}" does not exist`);
          missingTables.push(tableName);
        } else {
          log.warning(`Table "${tableName}" - ${error.message}`);
          foundTables.push(tableName);
        }
      } else {
        log.success(`Table "${tableName}" exists`);
        foundTables.push(tableName);
      }
    } catch (error) {
      log.error(`Error checking "${tableName}": ${error.message}`);
      missingTables.push(tableName);
    }
  }

  // Try to query the information schema directly for a comprehensive count
  console.log('\n' + colors.bold + 'Querying Database Schema:' + colors.reset + '\n');
  
  try {
    // Query to get all user tables from information schema
    const { data, error } = await supabase
      .rpc('exec_sql', {
        query: `
          SELECT table_name 
          FROM information_schema.tables 
          WHERE table_schema = 'public' 
          AND table_type = 'BASE TABLE'
          ORDER BY table_name;
        `
      });

    if (error) {
      log.warning('Unable to query information schema directly');
      log.info('Using manual table check results instead');
    } else if (data) {
      log.success('Successfully queried database schema');
      console.log('\n' + colors.bold + 'All Tables in Public Schema:' + colors.reset);
      data.forEach((row, index) => {
        console.log(`  ${index + 1}. ${row.table_name}`);
      });
      console.log(`\n${colors.bold}Total tables in database: ${data.length}${colors.reset}`);
    }
  } catch (error) {
    log.warning('Direct schema query not available');
    log.info('This requires a custom RPC function or service role key');
  }

  // Summary
  console.log('\n' + '='.repeat(70));
  log.header('📋 Summary');
  console.log('='.repeat(70) + '\n');

  console.log(`${colors.bold}Expected Tables:${colors.reset} ${expectedTables.length}`);
  console.log(`${colors.green}Found Tables:${colors.reset} ${foundTables.length}`);
  console.log(`${colors.red}Missing Tables:${colors.reset} ${missingTables.length}`);

  if (foundTables.length > 0) {
    console.log(`\n${colors.bold}Tables Found:${colors.reset}`);
    foundTables.forEach((table, index) => {
      console.log(`  ${index + 1}. ${table}`);
    });
  }

  if (missingTables.length > 0) {
    console.log(`\n${colors.bold}Tables Missing:${colors.reset}`);
    missingTables.forEach((table, index) => {
      console.log(`  ${index + 1}. ${table}`);
    });
    console.log(`\n${colors.yellow}Run 'npm run db:migrate' to create missing tables${colors.reset}`);
  }

  console.log('\n' + '='.repeat(70));
  
  if (missingTables.length === 0) {
    log.success(`✨ All ${foundTables.length} expected tables are present!`);
  } else {
    log.warning(`⚠️  ${missingTables.length} table(s) are missing`);
  }
  
  console.log('='.repeat(70) + '\n');

  // Return the count
  return foundTables.length;
}

// Run the count
countTables()
  .then((count) => {
    console.log(`${colors.bold}${colors.green}ANSWER: ${count} tables are currently in use on Supabase${colors.reset}\n`);
    process.exit(0);
  })
  .catch((error) => {
    log.error(`Unexpected error: ${error.message}`);
    console.error(error);
    process.exit(1);
  });
