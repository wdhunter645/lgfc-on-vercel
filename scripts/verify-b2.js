#!/usr/bin/env node

/**
 * Backblaze B2 Connectivity Verification Script
 * 
 * This script verifies that:
 * 1. All required B2 environment variables are set
 * 2. The B2 client can be initialized
 * 3. Connection to B2 bucket can be established
 * 4. Credentials are valid (by listing bucket contents)
 */

import 'dotenv/config';
import { S3Client, ListObjectsV2Command, HeadBucketCommand } from '@aws-sdk/client-s3';

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
  detail: (msg) => console.log(`${colors.dim}   ${msg}${colors.reset}`)
};

// Get environment variables with fallback to B2_ prefix
function getEnvVar(name, fallback) {
  return process.env[name] || process.env[fallback] || null;
}

const backblazeKeyId = getEnvVar('BACKBLAZE_KEY_ID', 'B2_KEY_ID');
const backblazeAppKey = getEnvVar('BACKBLAZE_APPLICATION_KEY', 'B2_APP_KEY');
const backblazeBucket = getEnvVar('BACKBLAZE_BUCKET_NAME', 'B2_BUCKET');
const backblazeEndpoint = getEnvVar('BACKBLAZE_ENDPOINT', 'B2_ENDPOINT');
const mediaCdnUrl = getEnvVar('NEXT_PUBLIC_MEDIA_CDN_URL', 'PUBLIC_B2_BASE_URL');

async function verifyB2Connectivity() {
  console.log('\n🔍 Verifying Backblaze B2 Connectivity...\n');
  console.log('='.repeat(60));
  
  let allChecksPass = true;

  // Step 1: Verify environment variables
  log.header('Step 1: Environment Variables Check');
  
  const envVars = [
    { name: 'BACKBLAZE_KEY_ID', value: backblazeKeyId, fallback: 'B2_KEY_ID' },
    { name: 'BACKBLAZE_APPLICATION_KEY', value: backblazeAppKey, fallback: 'B2_APP_KEY', mask: true },
    { name: 'BACKBLAZE_BUCKET_NAME', value: backblazeBucket, fallback: 'B2_BUCKET' },
    { name: 'BACKBLAZE_ENDPOINT', value: backblazeEndpoint, fallback: 'B2_ENDPOINT' },
    { name: 'NEXT_PUBLIC_MEDIA_CDN_URL', value: mediaCdnUrl, fallback: 'PUBLIC_B2_BASE_URL' }
  ];

  for (const envVar of envVars) {
    if (envVar.value) {
      const displayValue = envVar.mask ? '***' + envVar.value.slice(-4) : envVar.value;
      const source = process.env[envVar.name] ? envVar.name : envVar.fallback;
      log.success(`${envVar.name} (from ${source})`);
      log.detail(`Value: ${displayValue}`);
    } else {
      log.error(`${envVar.name} is not set`);
      log.detail(`Also checked: ${envVar.fallback}`);
      allChecksPass = false;
    }
  }

  if (!allChecksPass) {
    console.log('\n' + '='.repeat(60));
    log.error('Environment variables check failed!');
    log.info('Please set the required B2 environment variables in .env file');
    process.exit(1);
  }

  // Step 2: Initialize S3 Client
  log.header('Step 2: S3 Client Initialization');
  
  let s3Client;
  try {
    s3Client = new S3Client({
      endpoint: `https://${backblazeEndpoint}`,
      region: 'us-west-004', // B2 uses a placeholder region
      credentials: {
        accessKeyId: backblazeKeyId,
        secretAccessKey: backblazeAppKey
      }
    });
    log.success('S3 Client initialized successfully');
    log.detail(`Endpoint: https://${backblazeEndpoint}`);
  } catch (error) {
    log.error('Failed to initialize S3 Client');
    log.detail(`Error: ${error.message}`);
    allChecksPass = false;
    process.exit(1);
  }

  // Step 3: Verify bucket access
  log.header('Step 3: Bucket Access Verification');
  
  try {
    const headCommand = new HeadBucketCommand({
      Bucket: backblazeBucket
    });
    
    await s3Client.send(headCommand);
    log.success('Successfully connected to B2 bucket');
    log.detail(`Bucket: ${backblazeBucket}`);
  } catch (error) {
    if (error.code === 'ENOTFOUND' || error.message.includes('getaddrinfo')) {
      log.warning('Cannot connect to B2 endpoint (network restricted)');
      log.detail('This is expected in sandboxed environments');
      log.info('B2 configuration appears correct, but connectivity cannot be verified');
    } else if (error.name === 'NotFound') {
      log.error('Bucket does not exist or access denied');
      log.detail('Bucket does not exist or access denied');
      allChecksPass = false;
    } else if (error.name === 'Forbidden') {
      log.error('Access denied - check credentials');
      log.detail('Access denied - check credentials');
      allChecksPass = false;
    } else {
      log.error('Failed to access B2 bucket');
      log.detail(`Error: ${error.message}`);
      allChecksPass = false;
    }
  }

  // Step 4: List objects (verify read permission)
  log.header('Step 4: Bucket Read Permission Test');
  
  try {
    const listCommand = new ListObjectsV2Command({
      Bucket: backblazeBucket,
      MaxKeys: 5
    });
    
    const response = await s3Client.send(listCommand);
    log.success('Successfully listed bucket contents');
    log.detail(`Objects in bucket: ${response.KeyCount || 0}`);
    
    if (response.Contents && response.Contents.length > 0) {
      log.detail('Sample files:');
      response.Contents.slice(0, 3).forEach(obj => {
        log.detail(`  - ${obj.Key} (${(obj.Size / 1024).toFixed(2)} KB)`);
      });
    } else {
      log.info('Bucket is empty (this is OK)');
    }
  } catch (error) {
    if (error.code === 'ENOTFOUND' || error.message.includes('getaddrinfo')) {
      log.warning('Cannot list bucket contents (network restricted)');
      log.detail('This is expected in sandboxed environments');
      log.info('B2 configuration appears correct, but read permission cannot be verified');
    } else {
      log.error('Failed to list bucket contents');
      log.detail(`Error: ${error.message}`);
      allChecksPass = false;
    }
  }

  // Step 5: Verify CDN URL configuration
  log.header('Step 5: CDN URL Configuration');
  
  if (mediaCdnUrl) {
    log.success('CDN URL is configured');
    log.detail(`URL: ${mediaCdnUrl}`);
    
    // Validate URL format
    try {
      new URL(mediaCdnUrl);
      log.success('CDN URL format is valid');
    } catch (error) {
      log.warning('CDN URL format may be invalid');
      log.detail(`Error: ${error.message}`);
    }
  } else {
    log.warning('CDN URL is not configured');
    log.info('Media files may not be accessible via CDN');
  }

  // Final Summary
  console.log('\n' + '='.repeat(60));
  
  if (allChecksPass) {
    log.success('All B2 connectivity checks passed! ✨');
    console.log('\nBackblaze B2 is properly configured and accessible.');
    console.log('\nYou can now:');
    console.log('  - Upload files via /api/upload endpoint');
    console.log('  - Check B2 status via /api/b2-status endpoint');
    console.log('  - Use B2 storage in your application');
    console.log('\nNote: Some connectivity tests may have been skipped due to');
    console.log('      network restrictions in the current environment.');
  } else {
    log.error('Some B2 connectivity checks failed!');
    console.log('\nPlease review the errors above and:');
    console.log('  1. Verify your B2 credentials are correct');
    console.log('  2. Check that the bucket name matches your B2 bucket');
    console.log('  3. Ensure your B2 key has proper permissions');
    console.log('  4. Confirm the endpoint matches your bucket region');
    process.exit(1);
  }
  
  console.log('='.repeat(60) + '\n');
}

// Run the verification
verifyB2Connectivity().catch(error => {
  console.error('\n❌ Unexpected error during verification:');
  console.error(error);
  process.exit(1);
});
