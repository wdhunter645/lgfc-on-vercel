# Supabase Table Verification Checklist

Use this checklist to verify that all database tables were created successfully.

## Quick Verification

Run the automated verification script (uses existing npm script from repository):

```bash
npm run db:test
```

**What this does:**
- Tests basic connection to Supabase
- Checks that all 6 tables exist and are accessible
- Verifies Row Level Security (RLS) policies are working
- Tests service role key if configured

This script is located at `scripts/test-db.js` and was already part of the repository.

---

## Manual Verification (via Supabase Dashboard)

### Step 1: Check Tables Exist

1. Go to your Supabase project dashboard
2. Click on **Table Editor** in the left sidebar
3. Verify you see all 6 tables:

   - [ ] `weekly_votes`
   - [ ] `vote_records`
   - [ ] `friends_of_club`
   - [ ] `timeline_events`
   - [ ] `faq_items`
   - [ ] `calendar_events`

### Step 2: Verify Table Structures

Click on each table and verify the columns:

#### `weekly_votes`
- [ ] `id` (uuid, primary key)
- [ ] `week_id` (varchar)
- [ ] `image_a_url` (text)
- [ ] `image_b_url` (text)
- [ ] `votes_a` (int4)
- [ ] `votes_b` (int4)
- [ ] `start_date` (timestamptz)
- [ ] `end_date` (timestamptz)
- [ ] `created_at` (timestamptz)

#### `vote_records`
- [ ] `id` (uuid, primary key)
- [ ] `week_id` (varchar)
- [ ] `voter_ip` (varchar)
- [ ] `voter_fingerprint` (text)
- [ ] `selected_option` (bpchar)
- [ ] `voted_at` (timestamptz)

#### `friends_of_club`
- [ ] `id` (uuid, primary key)
- [ ] `name` (varchar)
- [ ] `description` (text)
- [ ] `logo_url` (text)
- [ ] `website_url` (text)
- [ ] `display_order` (int4)
- [ ] `is_active` (bool)
- [ ] `created_at` (timestamptz)

#### `timeline_events`
- [ ] `id` (uuid, primary key)
- [ ] `date` (date)
- [ ] `title` (varchar)
- [ ] `description` (text)
- [ ] `category` (varchar)
- [ ] `image_url` (text)
- [ ] `created_at` (timestamptz)

#### `faq_items`
- [ ] `id` (uuid, primary key)
- [ ] `question` (text)
- [ ] `answer` (text)
- [ ] `category` (varchar)
- [ ] `display_order` (int4)
- [ ] `is_published` (bool)
- [ ] `created_at` (timestamptz)
- [ ] `updated_at` (timestamptz)

#### `calendar_events`
- [ ] `id` (uuid, primary key)
- [ ] `title` (varchar)
- [ ] `description` (text)
- [ ] `event_date` (timestamptz)
- [ ] `end_date` (timestamptz)
- [ ] `location` (varchar)
- [ ] `event_type` (varchar)
- [ ] `registration_url` (text)
- [ ] `is_published` (bool)
- [ ] `created_at` (timestamptz)

### Step 3: Verify Row Level Security (RLS)

1. Go to **Authentication → Policies** in the Supabase dashboard
2. Or click on a table in Table Editor and select the **Policies** tab
3. Verify RLS is enabled and policies exist for each table:

   - [ ] `weekly_votes` - "Public read access" policy
   - [ ] `vote_records` - "Allow vote insertion" policy
   - [ ] `friends_of_club` - "Public read access" policy
   - [ ] `timeline_events` - "Public read access" policy
   - [ ] `faq_items` - "Public read access" policy
   - [ ] `calendar_events` - "Public read access" policy

### Step 4: Verify Database Functions

1. Go to **Database → Functions** in the Supabase dashboard
2. Verify these functions exist:

   - [ ] `increment_vote(week varchar, vote_column varchar)`
   - [ ] `get_current_voting()`
   - [ ] `update_updated_at_column()` (trigger function)

### Step 5: Verify Triggers

1. Go to **Database → Triggers** in the Supabase dashboard
2. Verify this trigger exists:

   - [ ] `update_faq_items_updated_at` on `faq_items` table

### Step 6: Verify Indexes

Run this query in **SQL Editor**:

```sql
SELECT 
  schemaname,
  tablename,
  indexname
FROM pg_indexes
WHERE schemaname = 'public'
  AND tablename IN (
    'weekly_votes',
    'vote_records',
    'friends_of_club',
    'timeline_events',
    'faq_items',
    'calendar_events'
  )
ORDER BY tablename, indexname;
```

Expected indexes (at least):
- [ ] `idx_weekly_votes_week_id`
- [ ] `idx_weekly_votes_dates`
- [ ] `idx_vote_records_tracking`
- [ ] `idx_vote_records_voted_at`
- [ ] `idx_friends_display_order`
- [ ] `idx_friends_active`
- [ ] `idx_timeline_date`
- [ ] `idx_timeline_category`
- [ ] `idx_faq_category`
- [ ] `idx_faq_published`
- [ ] `idx_faq_display_order`
- [ ] `idx_calendar_event_date`
- [ ] `idx_calendar_published`

---

## Test Queries

Run these test queries in **SQL Editor** to verify everything works:

### 1. Count Records (should return 0 for new database)

```sql
SELECT 
  'weekly_votes' as table_name, COUNT(*) as count FROM weekly_votes
UNION ALL
SELECT 'vote_records', COUNT(*) FROM vote_records
UNION ALL
SELECT 'friends_of_club', COUNT(*) FROM friends_of_club
UNION ALL
SELECT 'timeline_events', COUNT(*) FROM timeline_events
UNION ALL
SELECT 'faq_items', COUNT(*) FROM faq_items
UNION ALL
SELECT 'calendar_events', COUNT(*) FROM calendar_events;
```

Expected: All counts should be 0 (unless you've seeded data)

### 2. Test RLS Policies

```sql
-- This should work (public read access)
SELECT * FROM weekly_votes LIMIT 1;

-- This should work (public read access)
SELECT * FROM timeline_events LIMIT 1;

-- Test RLS filtering - should only show active items
SELECT * FROM friends_of_club;
-- Expected: Only returns records where is_active = true

-- Try to access inactive items (should be filtered by RLS)
SELECT * FROM friends_of_club WHERE is_active = false;
-- Expected: Empty result or error (RLS blocks inactive items from public access)
```

### 3. Test Database Functions

```sql
-- Test get_current_voting function
SELECT * FROM get_current_voting();
-- Expected: Empty result (no voting data yet)
```

---

## Application-Level Testing

After tables are created, test from your application:

### 1. Start Development Server

```bash
npm run dev
```

### 2. Check Browser Console

Open [http://localhost:3000](http://localhost:3000) and check the browser console for:
- [ ] No Supabase connection errors
- [ ] No 404 errors for database tables
- [ ] No RLS policy violations

### 3. Test Features

If your app has UI for these features, test:
- [ ] Weekly voting display (even if empty)
- [ ] Timeline events display
- [ ] FAQ display
- [ ] Calendar events display
- [ ] Friends of Club display

---

## Troubleshooting Failed Checks

### Table doesn't exist
**Solution**: Re-run the migration for that specific table
```bash
# Copy the SQL from supabase/migrations/XXXXX_create_[table_name].sql
# Paste in SQL Editor and run
```

### RLS policy missing
**Solution**: Re-run the migration that creates the policy
- The policy is defined in the same file as the table creation

### Function doesn't exist
**Solution**: Re-run `20250101000007_create_functions.sql`

### Trigger doesn't exist
**Solution**: Re-run `20250101000008_create_triggers.sql`

### Index missing
**Solution**: Indexes are created with tables, re-run the table creation

---

## Verification Complete ✅

Once all checks pass:

1. **Seed sample data** (optional):
   ```bash
   npm run db:seed
   ```

2. **Generate TypeScript types**:
   ```bash
   npm run supabase:types
   ```

3. **Start building features**:
   - Your database is ready!
   - All tables, RLS policies, functions, and triggers are in place
   - You can now safely develop and deploy your application

---

## Support

If verification fails:
- Review [CREATE_TABLES.md](./CREATE_TABLES.md) for setup instructions
- Check [SUPABASE_TROUBLESHOOTING.md](./SUPABASE_TROUBLESHOOTING.md)
- Review Supabase project logs in the dashboard
- Contact: LouGehrigFanClub@gmail.com
