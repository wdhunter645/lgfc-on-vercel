#!/usr/bin/env node

/**
 * Fetch Supabase Service Role Key
 * Uses Supabase Management API to retrieve the service role key
 */

require('dotenv').config();
const https = require('https');

const projectRef = process.env.SUPABASE_PROJECT_ID;
const accessToken = process.env.SUPABASE_ACCESS_TOKEN;

console.log('🔑 Fetching Supabase Service Role Key...\n');
console.log('Project ID:', projectRef);
console.log('Access Token:', accessToken ? `${accessToken.substring(0, 10)}...` : 'NOT SET');

if (!projectRef || !accessToken) {
  console.error('❌ Missing SUPABASE_PROJECT_ID or SUPABASE_ACCESS_TOKEN');
  process.exit(1);
}

const options = {
  hostname: 'api.supabase.com',
  path: `/v1/projects/${projectRef}/api-keys`,
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${accessToken}`,
    'Content-Type': 'application/json'
  }
};

const req = https.request(options, (res) => {
  let data = '';
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    if (res.statusCode === 200) {
      const keys = JSON.parse(data);
      const serviceKey = keys.find(k => k.name === 'service_role');
      if (serviceKey) {
        console.log('\n✅ Found service role key!');
        console.log('\nAdd this to your .env file:');
        console.log('SUPABASE_SERVICE_ROLE_KEY=' + serviceKey.api_key);
      } else {
        console.error('❌ Service role key not found');
        console.log('Available keys:', JSON.stringify(keys, null, 2));
      }
    } else {
      console.error(`❌ Error: ${res.statusCode} ${res.statusMessage}`);
      console.error(data);
    }
  });
});

req.on('error', (error) => {
  console.error('❌ Request error:', error.message);
});

req.end();
