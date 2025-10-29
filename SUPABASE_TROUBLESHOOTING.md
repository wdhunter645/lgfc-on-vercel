# Supabase Migration Troubleshooting Guide

This guide helps you run Supabase database migrations when network access is restricted or when the service role key is not available.

## Problem

The Supabase migration scripts (`npm run db:migrate`) require:
1. Network access to Supabase servers
2. The `SUPABASE_SERVICE_ROLE_KEY` environment variable

In restricted environments (like CI/CD pipelines with firewall rules), these requirements may not be met.

## Solutions

### Solution 1: Manual Migration via Supabase Dashboard (Recommended)

This is the most reliable method when network access is restricted.

#### Steps:

1. **Open your Supabase project dashboard**
   - Go to https://supabase.com
   - Log in and select your project: `hfnqhpnhjkoypvwyckap`

2. **Navigate to SQL Editor**
   - Click on "SQL Editor" in the left sidebar
   - Click "+ New query"

3. **Copy the migration SQL**
   - Open the file `supabase-migrations.sql` in this repository
   - Copy all the contents

4. **Run the migration**
   - Paste the SQL into the editor
   - Click "Run" to execute
   - Wait for completion (should take 5-10 seconds)

5. **Verify tables were created**
   - Go to "Table Editor" in the left sidebar
   - You should see 6 tables:
     - `weekly_votes`
     - `vote_records`
     - `friends_of_club`
     - `timeline_events`
     - `faq_items`
     - `calendar_events`

✅ **Done!** Your database schema is now set up.

### Solution 2: Add Service Role Key to Environment

If you have network access, you can use the automated migration script.

#### Steps:

1. **Get your service role key**
   - Go to your Supabase project dashboard
   - Navigate to Settings → API
   - Find the `service_role` key (keep this secret!)

2. **Add to your `.env` file**
   ```bash
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...your-key-here
   ```

3. **Run migrations**
   ```bash
   npm run db:migrate
   ```

### Solution 3: Use the Export Script

Generate a fresh copy of the migration SQL file:

```bash
npm run db:export
```

This creates/updates `supabase-migrations.sql` with all current migrations.

## Helper Scripts

### Check Environment Configuration
```bash
npm run check:env
```
Verifies all required environment variables are set.

### Export Migrations to SQL
```bash
npm run db:export
```
Generates `supabase-migrations.sql` for manual execution.

### Test Database Connection
```bash
npm run db:test
```
Tests connectivity and verifies tables exist (requires network access).

### Seed Sample Data
```bash
npm run db:seed
```
Populates the database with sample data (requires service role key).

## Network Restrictions

### Symptoms:
- `getaddrinfo ENOTFOUND hfnqhpnhjkoypvwyckap.supabase.co`
- `Connection failed: getaddrinfo ENOTFOUND db.hfnqhpnhjkoypvwyckap.supabase.co`
- Timeouts when running migration scripts

### Diagnosis:
Your environment has firewall rules blocking access to:
- `hfnqhpnhjkoypvwyckap.supabase.co` (Supabase REST API)
- `db.hfnqhpnhjkoypvwyckap.supabase.co` (PostgreSQL database)

### Resolution:
Use **Solution 1** (Manual Migration via Dashboard) - it works in all environments.

## Verifying the Setup

After running migrations, verify everything is working:

1. **Check tables exist** (via Supabase Dashboard)
   - Go to Table Editor
   - Confirm all 6 tables are present

2. **Test from your application** (when deployed)
   ```typescript
   import { createClientComponentClient } from '@/app/lib/supabase';
   
   const supabase = createClientComponentClient();
   const { data, error } = await supabase
     .from('timeline_events')
     .select('count');
   
   console.log('Tables accessible:', !error);
   ```

3. **Run verification script** (requires network access)
   ```bash
   npm run verify:supabase
   ```

## Common Issues

### "Missing Supabase credentials"
- Ensure `.env` file exists with required variables
- Run `npm run check:env` to verify

### "Table does not exist"
- Migrations haven't been run yet
- Use Solution 1 or 2 to run migrations

### "Permission denied" or RLS errors
- Row Level Security (RLS) policies are working correctly
- Use the service role key for admin operations
- Public operations use the anon key

## Production Deployment

### Vercel Environment Variables

Add these in Vercel project settings → Environment Variables:

```
NEXT_PUBLIC_SUPABASE_URL=https://hfnqhpnhjkoypvwyckap.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...  (optional, for admin operations)
```

Set for all environments:
- ✅ Production
- ✅ Preview
- ✅ Development

### Database Setup Workflow

1. **First time setup:**
   - Run migrations using Solution 1 (Dashboard)
   - Verify tables exist
   - Configure Vercel environment variables
   - Deploy application

2. **Adding new migrations:**
   - Add migration to `scripts/run-migrations.js`
   - Run `npm run db:export` to update `supabase-migrations.sql`
   - Execute new migration in Supabase Dashboard
   - Commit changes

## Need Help?

1. Check the main setup guide: `SUPABASE_SETUP.md`
2. Review verification results: `SUPABASE_VERIFICATION.md`
3. Contact: LouGehrigFanClub@gmail.com

## Quick Reference

| Command | Purpose |
|---------|---------|
| `npm run check:env` | Verify environment configuration |
| `npm run db:export` | Export migrations to SQL file |
| `npm run db:migrate` | Run migrations (needs network + service key) |
| `npm run db:seed` | Add sample data (needs network + service key) |
| `npm run db:test` | Test connection (needs network) |
| `npm run verify:supabase` | Comprehensive verification |

## Files Reference

- `supabase-migrations.sql` - Complete migration SQL for manual execution
- `scripts/run-migrations.js` - Automated migration script
- `scripts/export-migrations.js` - Export migrations to SQL
- `scripts/fetch-service-key.js` - Fetch service role key from API
- `app/lib/supabase.ts` - Supabase client utilities
