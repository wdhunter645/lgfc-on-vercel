# Supabase Database Schema

This directory contains the Supabase database schema, migrations, and seed data for the Lou Gehrig Fan Club website.

## Directory Structure

```
supabase/
├── config.toml           # Supabase CLI configuration
├── migrations/           # Database migration files (versioned)
│   ├── 20250101000001_create_weekly_votes.sql
│   ├── 20250101000002_create_vote_records.sql
│   ├── 20250101000003_create_friends_of_club.sql
│   ├── 20250101000004_create_timeline_events.sql
│   ├── 20250101000005_create_faq_items.sql
│   ├── 20250101000006_create_calendar_events.sql
│   ├── 20250101000007_create_functions.sql
│   └── 20250101000008_create_triggers.sql
└── seed/                 # Sample data for development
    └── seed.sql
```

## Database Schema

### Tables

#### 1. `weekly_votes`
Stores weekly photo matchups for the voting feature.

**Columns:**
- `id` (UUID) - Primary key
- `week_id` (VARCHAR) - Unique identifier for the week
- `image_a_url` (TEXT) - URL for option A image
- `image_b_url` (TEXT) - URL for option B image
- `votes_a` (INTEGER) - Vote count for option A
- `votes_b` (INTEGER) - Vote count for option B
- `start_date` (TIMESTAMPTZ) - Week start date
- `end_date` (TIMESTAMPTZ) - Week end date
- `created_at` (TIMESTAMPTZ) - Record creation timestamp

**RLS Policy:** Public read access

#### 2. `vote_records`
Tracks individual votes to prevent duplicate voting.

**Columns:**
- `id` (UUID) - Primary key
- `week_id` (VARCHAR) - Reference to weekly_votes.week_id
- `voter_ip` (VARCHAR) - Voter's IP address (optional)
- `voter_fingerprint` (TEXT) - Browser fingerprint (optional)
- `selected_option` (CHAR) - 'A' or 'B'
- `voted_at` (TIMESTAMPTZ) - Vote timestamp

**RLS Policy:** Public insert access (for voting)

#### 3. `friends_of_club`
Partner organizations and affiliates.

**Columns:**
- `id` (UUID) - Primary key
- `name` (VARCHAR) - Organization name
- `description` (TEXT) - Organization description
- `logo_url` (TEXT) - Logo image URL
- `website_url` (TEXT) - Organization website
- `display_order` (INTEGER) - Sort order
- `is_active` (BOOLEAN) - Active status
- `created_at` (TIMESTAMPTZ) - Record creation timestamp

**RLS Policy:** Public read access (active records only)

#### 4. `timeline_events`
Historical events from Lou Gehrig's life.

**Columns:**
- `id` (UUID) - Primary key
- `date` (DATE) - Event date
- `title` (VARCHAR) - Event title
- `description` (TEXT) - Event description
- `category` (VARCHAR) - Event category
- `image_url` (TEXT) - Event image URL (optional)
- `created_at` (TIMESTAMPTZ) - Record creation timestamp

**RLS Policy:** Public read access

#### 5. `faq_items`
Frequently asked questions about Lou Gehrig.

**Columns:**
- `id` (UUID) - Primary key
- `question` (TEXT) - Question text
- `answer` (TEXT) - Answer text
- `category` (VARCHAR) - Question category
- `display_order` (INTEGER) - Sort order
- `is_published` (BOOLEAN) - Published status
- `created_at` (TIMESTAMPTZ) - Record creation timestamp
- `updated_at` (TIMESTAMPTZ) - Last update timestamp

**RLS Policy:** Public read access (published items only)

#### 6. `calendar_events`
Club events and activities.

**Columns:**
- `id` (UUID) - Primary key
- `title` (VARCHAR) - Event title
- `description` (TEXT) - Event description
- `event_date` (TIMESTAMPTZ) - Event start date/time
- `end_date` (TIMESTAMPTZ) - Event end date/time (optional)
- `location` (VARCHAR) - Event location
- `event_type` (VARCHAR) - Type of event
- `registration_url` (TEXT) - Registration link (optional)
- `is_published` (BOOLEAN) - Published status
- `created_at` (TIMESTAMPTZ) - Record creation timestamp

**RLS Policy:** Public read access (published events only)

### Database Functions

#### `increment_vote(week VARCHAR, vote_column VARCHAR)`
Atomically increments vote counts for a specific week and option.

**Parameters:**
- `week` - The week_id to update
- `vote_column` - Either 'votes_a' or 'votes_b'

**Returns:** void

#### `get_current_voting()`
Retrieves the current active voting matchup.

**Returns:** Table with current week's voting data

### Triggers

#### `update_faq_items_updated_at`
Automatically updates the `updated_at` timestamp when faq_items are modified.

## Local Development

### Prerequisites

- [Supabase CLI](https://supabase.com/docs/guides/cli) installed
- Docker Desktop running (for local Supabase instance)

### Start Local Development Database

```bash
# Start local Supabase instance
npx supabase start

# This will:
# - Start PostgreSQL database
# - Start Supabase Studio (UI)
# - Apply all migrations
# - Display local credentials
```

### Access Local Supabase Studio

After starting, Supabase Studio will be available at:
- **Studio URL:** http://localhost:54323
- **API URL:** http://localhost:54321
- **Database URL:** postgresql://postgres:postgres@localhost:54322/postgres

### Stop Local Development Database

```bash
npx supabase stop
```

## Database Migrations

### Apply Migrations to Production

**Option 1: Using Supabase CLI (Recommended)**

```bash
# Link to your Supabase project
npx supabase link --project-ref <your-project-ref>

# Push migrations to production
npx supabase db push
```

**Option 2: Using Supabase Dashboard**

1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Copy and paste each migration file in order
4. Execute them sequentially

**Option 3: Using npm scripts (existing method)**

```bash
# Run migrations using the existing scripts
npm run db:migrate
```

### Create New Migration

```bash
# Create a new migration file
npx supabase migration new <migration_name>

# Example:
npx supabase migration new add_user_profiles
```

This creates a new file in `supabase/migrations/` with a timestamp prefix.

## Seeding Data

### Seed Local Database

```bash
# Apply seed data to local database
npx supabase db reset --seed
```

### Seed Production Database

**Option 1: Using Supabase Dashboard**

1. Go to SQL Editor
2. Copy contents of `supabase/seed/seed.sql`
3. Execute the SQL

**Option 2: Using npm script**

```bash
npm run db:seed
```

## TypeScript Type Generation

Generate TypeScript types from your database schema:

```bash
# Generate types
npx supabase gen types typescript --local > app/lib/database.types.ts

# For production database
npx supabase gen types typescript --project-ref <your-project-ref> > app/lib/database.types.ts
```

This creates type-safe interfaces for all your database tables.

## Row Level Security (RLS)

All tables have Row Level Security enabled:

- **Public Tables:** Read access for everyone (weekly_votes, timeline_events)
- **Filtered Public:** Read access for published/active items only (faq_items, calendar_events, friends_of_club)
- **Vote Recording:** Public insert access for vote_records
- **Admin Operations:** Require service role key (handled via API routes)

## Testing

### Test Database Connection

```bash
# Test connection to Supabase
npm run db:test

# Verify complete setup
npm run verify:supabase
```

### Run Migrations Locally

```bash
# Reset local database (drops and recreates)
npx supabase db reset

# This will:
# - Drop all tables
# - Reapply all migrations
# - Run seed data
```

## Deployment Checklist

- [ ] Create Supabase project
- [ ] Configure environment variables in Vercel
- [ ] Apply migrations to production
- [ ] Verify RLS policies are enabled
- [ ] Seed initial data (optional)
- [ ] Test database connection
- [ ] Generate and commit TypeScript types

## Environment Variables

Required environment variables:

```env
# Public (safe to expose to client)
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...

# Private (server-side only)
SUPABASE_SERVICE_ROLE_KEY=eyJxxx...
```

## Common Issues

### Migration Conflicts

If you get migration conflicts:

```bash
# Pull latest migrations from production
npx supabase db pull

# Or reset local to match production
npx supabase db reset
```

### Connection Issues

- Ensure Supabase project is not paused (free tier auto-pauses)
- Verify environment variables are correct
- Check if IP is allowed (Supabase allows all IPs by default)

### RLS Policy Errors

If getting RLS errors:
- Use service role key for admin operations
- Ensure RLS policies are correctly defined
- Test policies in Supabase Dashboard

## Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase CLI Reference](https://supabase.com/docs/guides/cli)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)

## Support

For questions or issues:
- Check [SUPABASE_SETUP.md](../SUPABASE_SETUP.md) in the root directory
- Review [SUPABASE_TROUBLESHOOTING.md](../SUPABASE_TROUBLESHOOTING.md)
- Contact: LouGehrigFanClub@gmail.com
