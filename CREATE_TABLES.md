# How to Create Supabase Tables

This guide provides step-by-step instructions to create all required database tables for the Lou Gehrig Fan Club website in your Supabase project.

## Quick Start (Recommended)

If you have environment variables configured, run:

```bash
npm run db:migrate
```

This will automatically create all 6 tables, indexes, RLS policies, functions, and triggers.

---

## Method 1: Using the Automated Script (Easiest)

### Prerequisites
- Node.js 18+ installed
- Environment variables configured in `.env` file

### Steps

1. **Ensure environment variables are set** (in `.env` file):
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
   ```

2. **Install dependencies** (if not already done):
   ```bash
   npm install
   ```

3. **Run the migration script**:
   ```bash
   npm run db:migrate
   ```

4. **Verify the setup**:
   ```bash
   npm run db:test
   ```

---

## Method 2: Using Supabase Dashboard (Manual)

If the automated script doesn't work or you prefer manual setup:

### Steps

1. **Open your Supabase project**
   - Go to [https://supabase.com/dashboard](https://supabase.com/dashboard)
   - Select your project

2. **Navigate to SQL Editor**
   - Click on "SQL Editor" in the left sidebar
   - Click "New query"

3. **Copy the migration SQL**
   - Open the file: `supabase-migrations.sql` in this repository
   - Copy the entire contents

4. **Paste and execute**
   - Paste the SQL into the SQL Editor
   - Click the "Run" button (or press Ctrl+Enter / Cmd+Enter)
   - Wait for execution to complete (should take a few seconds)

5. **Verify tables were created**
   - Click on "Table Editor" in the left sidebar
   - You should see 6 tables:
     - ✅ `weekly_votes`
     - ✅ `vote_records`
     - ✅ `friends_of_club`
     - ✅ `timeline_events`
     - ✅ `faq_items`
     - ✅ `calendar_events`

---

## Method 3: Using Supabase CLI

If you have the Supabase CLI installed and configured:

### Steps

1. **Link your project** (one-time setup):
   ```bash
   npx supabase link --project-ref <your-project-ref>
   ```
   - Find your project ref in the Supabase dashboard URL or Settings → General

2. **Push migrations to your database**:
   ```bash
   npx supabase db push
   ```

3. **Verify the setup**:
   ```bash
   npx supabase db pull
   ```

---

## What Gets Created

### Tables (6)
1. **weekly_votes** - Stores weekly photo matchups for voting
2. **vote_records** - Tracks individual votes to prevent duplicates
3. **friends_of_club** - Partner organizations and affiliates
4. **timeline_events** - Historical events from Lou Gehrig's life
5. **faq_items** - Frequently asked questions
6. **calendar_events** - Club events and activities

### Security
- **Row Level Security (RLS)** enabled on all tables
- **Public read access** for published/active content
- **Restricted write access** (admin only via API routes)
- **Special insert policy** for vote recording

### Database Functions (2)
- `increment_vote()` - Atomically increments vote counts
- `get_current_voting()` - Retrieves current active voting matchup

### Triggers (1)
- `update_faq_items_updated_at` - Auto-updates timestamp on FAQ changes

### Indexes (14)
- Optimized indexes for all frequently queried columns

---

## Verification

After creating tables, verify everything is working:

### 1. Check Table Existence
```bash
npm run db:test
```

### 2. View Tables in Dashboard
- Go to: Table Editor in Supabase Dashboard
- Confirm all 6 tables are listed

### 3. Test a Query
In SQL Editor, run:
```sql
SELECT COUNT(*) FROM weekly_votes;
```
Should return 0 (empty table)

---

## Next Steps

After tables are created:

1. **Seed sample data** (optional):
   ```bash
   npm run db:seed
   ```

2. **Start development**:
   ```bash
   npm run dev
   ```

3. **Deploy to production**:
   - Set environment variables in Vercel
   - Deploy application
   - Tables will be accessible to your app

---

## Troubleshooting

### Error: "Missing SUPABASE_SERVICE_ROLE_KEY"
- **Solution**: Add the service role key to your `.env` file
- **Find it**: Supabase Dashboard → Settings → API → service_role key
- **Note**: Keep this key secret! Don't commit it to git.

### Error: "table already exists"
- **Solution**: This is normal if tables were created previously
- **Action**: Tables are already set up, no action needed

### Error: "Connection failed"
- **Solution**: Use Method 2 (Manual via Dashboard) instead
- **Reason**: Network connectivity or credentials issue

### Error: "42501: new row violates row-level security policy"
- **Solution**: Ensure you're using the service role key for admin operations
- **Check**: Verify `SUPABASE_SERVICE_ROLE_KEY` is set correctly

### Tables not showing in Table Editor
- **Solution**: Refresh the page or clear browser cache
- **Check**: Run a query in SQL Editor to confirm tables exist:
  ```sql
  SELECT table_name FROM information_schema.tables 
  WHERE table_schema = 'public';
  ```

---

## Additional Resources

- **Setup Guide**: See [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) for detailed configuration
- **Schema Documentation**: See [supabase/SCHEMA.md](./supabase/SCHEMA.md) for database structure
- **Troubleshooting**: See [SUPABASE_TROUBLESHOOTING.md](./SUPABASE_TROUBLESHOOTING.md)
- **Supabase Docs**: [https://supabase.com/docs](https://supabase.com/docs)

---

## Support

If you encounter issues:
1. Check the troubleshooting section above
2. Review Supabase project logs in Dashboard
3. Open an issue in the repository
4. Contact: LouGehrigFanClub@gmail.com
