#!/usr/bin/env node

/**
 * Environment Setup Verification
 * Checks if all required environment variables are properly configured
 */

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  bold: '\x1b[1m'
};

const log = {
  success: (msg) => console.log(`${colors.green}✅ ${msg}${colors.reset}`),
  error: (msg) => console.log(`${colors.red}❌ ${msg}${colors.reset}`),
  warning: (msg) => console.log(`${colors.yellow}⚠️  ${msg}${colors.reset}`),
  info: (msg) => console.log(`${colors.blue}ℹ️  ${msg}${colors.reset}`),
  header: (msg) => console.log(`\n${colors.bold}${msg}${colors.reset}`)
};

function checkEnvVar(name, required = true, alternatives = []) {
  const value = process.env[name];
  const alternativeValues = alternatives.map(alt => process.env[alt]).filter(Boolean);
  
  if (value) {
    log.success(`${name} is set`);
    return true;
  } else if (alternativeValues.length > 0) {
    const altName = alternatives.find(alt => process.env[alt]);
    log.success(`${name} is set (using ${altName})`);
    return true;
  } else if (required) {
    log.error(`${name} is not set`);
    if (alternatives.length > 0) {
      log.info(`  Alternative names: ${alternatives.join(', ')}`);
    }
    return false;
  } else {
    log.warning(`${name} is not set (optional)`);
    return true;
  }
}

function main() {
  console.log('\n🔍 Checking Environment Configuration…\n');
  
  let allRequired = true;
  
  // Supabase Configuration
  log.header('Supabase Configuration:');
  allRequired = checkEnvVar('NEXT_PUBLIC_SUPABASE_URL') && allRequired;
  allRequired = checkEnvVar('NEXT_PUBLIC_SUPABASE_ANON_KEY', true, ['NEXT_PUBLIC_SUPABASE_API_KEY']) && allRequired;
  
  const hasServiceKey = checkEnvVar('SUPABASE_SERVICE_ROLE_KEY', false);
  if (!hasServiceKey) {
    log.info('  Service role key is optional but required for:');
    console.log('    - Running database migrations (npm run db:migrate)');
    console.log('    - Seeding the database (npm run db:seed)');
    console.log('    - Admin operations');
  }
  
  // Backblaze B2 Configuration (Optional)
  log.header('Backblaze B2 Configuration (Optional):');
  const hasB2 = checkEnvVar('BACKBLAZE_KEY_ID', false) &&
                checkEnvVar('BACKBLAZE_APPLICATION_KEY', false) &&
                checkEnvVar('BACKBLAZE_BUCKET_NAME', false);
  
  if (!hasB2) {
    log.info('  Backblaze B2 is optional and used for media storage');
  }
  
  // Application Configuration
  log.header('Application Configuration:');
  checkEnvVar('NEXT_PUBLIC_SITE_URL', false);
  
  // Summary
  console.log('\n' + '='.repeat(50));
  if (allRequired) {
    log.success('All required environment variables are configured!');
    console.log('\nNext steps:');
    console.log('  1. Test database connection: npm run db:test');
    console.log('  2. Run migrations: npm run db:migrate');
    console.log('  3. Seed data: npm run db:seed');
    console.log('  4. Start development: npm run dev');
  } else {
    log.error('Some required environment variables are missing!');
    console.log('\nPlease check the .env.example file for reference');
    console.log('See SUPABASE_SETUP.md for detailed setup instructions');
    process.exit(1);
  }
  console.log('='.repeat(50) + '\n');
}

main();
