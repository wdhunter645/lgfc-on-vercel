# Supabase Setup Guide

This guide walks you through setting up Supabase for the Lou Gehrig Fan Club website.

## Prerequisites

- Supabase account (free tier available at [supabase.com](https://supabase.com))
- Node.js 18+ installed
- Repository cloned and dependencies installed (`npm install`)

## Quick Start

If you already have a Supabase project and environment variables configured:

```bash
# Run all setup steps
npm run db:setup

# Or run individually:
npm run db:migrate  # Create tables and schema
npm run db:seed     # Add sample data
npm run db:test     # Verify connection
```

## Step-by-Step Setup

### 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up/log in
2. Click "New Project"
3. Fill in the details:
   - **Project Name**: `lgfc-production` (or your preferred name)
   - **Database Password**: Generate and save a strong password
   - **Region**: Choose closest to your target audience
4. Wait 2-3 minutes for the project to provision

### 2. Get Your API Credentials

1. In your Supabase project, go to **Settings → API**
2. Copy the following values:
   - **Project URL**: `https://xxxxxxxxxxxxx.supabase.co`
   - **anon/public key**: This is your `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role key**: This is your `SUPABASE_SERVICE_ROLE_KEY` (keep this secret!)

### 3. Configure Environment Variables

Create a `.env.local` file in the project root (or update your existing `.env` file):

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

**Important**: 
- Never commit `.env.local` to version control
- The `SUPABASE_SERVICE_ROLE_KEY` has admin access - keep it secure
- For production, set these as environment variables in Vercel

### 4. Run Database Migrations

Create all required tables and schemas:

```bash
npm run db:migrate
```

This will create the following tables:
- `weekly_votes` - For the weekly photo voting feature
- `vote_records` - Tracks individual votes
- `friends_of_club` - Partner organizations
- `timeline_events` - Lou Gehrig's career milestones
- `faq_items` - Frequently asked questions
- `calendar_events` - Club events and activities

### 5. Seed Initial Data (Optional)

Populate the database with sample data:

```bash
npm run db:seed
```

This adds:
- Sample FAQ items about Lou Gehrig
- Key timeline events from his life
- Sample partner organizations
- A weekly voting entry for the current week

### 6. Test the Connection

Verify everything is working:

```bash
npm run db:test
```

This will:
- Test the basic connection to Supabase
- Verify all tables are accessible
- Check Row Level Security (RLS) policies
- Test the service role key (if configured)

## Database Schema

### Tables Overview

#### `weekly_votes`
Stores weekly photo matchups for voting.
- `id` (UUID, PK)
- `week_id` (VARCHAR, unique)
- `image_a_url`, `image_b_url` (TEXT)
- `votes_a`, `votes_b` (INTEGER)
- `start_date`, `end_date` (TIMESTAMPTZ)

#### `vote_records`
Tracks individual votes to prevent duplicates.
- `id` (UUID, PK)
- `week_id` (VARCHAR)
- `voter_ip` (VARCHAR)
- `selected_option` ('A' or 'B')
- `voted_at` (TIMESTAMPTZ)

#### `friends_of_club`
Partner organizations and affiliates.
- `id` (UUID, PK)
- `name`, `description` (TEXT)
- `logo_url`, `website_url` (TEXT)
- `display_order` (INTEGER)
- `is_active` (BOOLEAN)

#### `timeline_events`
Historical events from Lou Gehrig's life.
- `id` (UUID, PK)
- `date` (DATE)
- `title`, `description` (TEXT)
- `category` (VARCHAR)
- `image_url` (TEXT)

#### `faq_items`
Frequently asked questions about Lou Gehrig.
- `id` (UUID, PK)
- `question`, `answer` (TEXT)
- `category` (VARCHAR)
- `display_order` (INTEGER)
- `is_published` (BOOLEAN)

#### `calendar_events`
Club events and activities.
- `id` (UUID, PK)
- `title`, `description` (TEXT)
- `event_date`, `end_date` (TIMESTAMPTZ)
- `location`, `event_type` (VARCHAR)
- `registration_url` (TEXT)
- `is_published` (BOOLEAN)

## Row Level Security (RLS)

All tables have RLS enabled with the following policies:

- **Public read access**: Allows anyone to read published/active content
- **Restricted write access**: Only service role can modify data (via API routes)
- **Vote insertion**: Special policy allows public to insert vote records

## Using Supabase in Your Code

### Client-Side (Browser)

```typescript
import { createClientComponentClient } from '@/app/lib/supabase';

const supabase = createClientComponentClient();

if (supabase) {
  const { data, error } = await supabase
    .from('timeline_events')
    .select('*')
    .order('date', { ascending: false });
}
```

### Server-Side (API Routes)

```typescript
import { createServerComponentClient } from '@/app/lib/supabase';

const supabase = createServerComponentClient();

if (supabase) {
  const { data, error } = await supabase
    .from('weekly_votes')
    .insert({ /* data */ });
}
```

## Troubleshooting

### "Missing Supabase credentials" error

Make sure you've created the `.env.local` file with the correct environment variables.

### "Table does not exist" error

Run the migrations:
```bash
npm run db:migrate
```

### "42501: new row violates row-level security policy" error

This usually means you're trying to insert/update data from the client. Use API routes with the service role key instead.

### Connection timeout

- Check that your Supabase project is not paused (free tier projects pause after inactivity)
- Verify your network allows connections to Supabase
- Confirm your credentials are correct

## Manual Setup (Alternative)

If the migration scripts don't work, you can manually create tables:

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Copy the SQL from `scripts/run-migrations.js`
4. Execute each migration individually

## Production Deployment

### Vercel Environment Variables

Add these in your Vercel project settings (Settings → Environment Variables):

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

Set these for:
- ✅ Production
- ✅ Preview (optional)
- ✅ Development (optional)

### GitHub Secrets (for CI/CD)

If using GitHub Actions, add these secrets to your repository:

1. Go to repository **Settings → Secrets and variables → Actions**
2. Add:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`

## Maintenance

### Updating Content

Use the Supabase dashboard to manage content:
- **Table Editor**: Add/edit records directly
- **SQL Editor**: Run custom queries
- **Database**: Monitor performance

### Backups

Supabase automatically backs up your database. To manually export:

1. Go to **Settings → Database**
2. Click **Database backups**
3. Download a backup

## Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Next.js + Supabase Guide](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)

## Support

If you encounter issues:
1. Check the troubleshooting section above
2. Review Supabase project logs
3. Open an issue in the repository
4. Contact: LouGehrigFanClub@gmail.com
