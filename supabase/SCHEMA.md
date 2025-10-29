# Database Schema Documentation

This document provides detailed information about the Lou Gehrig Fan Club database schema.

## Schema Overview

The database consists of 6 main tables supporting the core features of the website:

1. **weekly_votes** - Weekly photo voting matchups
2. **vote_records** - Individual vote tracking
3. **friends_of_club** - Partner organizations
4. **timeline_events** - Lou Gehrig's life events
5. **faq_items** - Frequently asked questions
6. **calendar_events** - Club events and activities

## Entity Relationship Diagram

```
┌─────────────────┐
│  weekly_votes   │
│  (voting data)  │
└────────┬────────┘
         │
         │ week_id
         │
         ↓
┌─────────────────┐
│  vote_records   │
│ (vote tracking) │
└─────────────────┘

┌─────────────────┐
│friends_of_club  │
│  (partners)     │
└─────────────────┘

┌─────────────────┐
│timeline_events  │
│   (history)     │
└─────────────────┘

┌─────────────────┐
│   faq_items     │
│     (Q&A)       │
└─────────────────┘

┌─────────────────┐
│calendar_events  │
│    (events)     │
└─────────────────┘
```

## Table Specifications

### weekly_votes

**Purpose:** Stores weekly photo matchups for the voting feature

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY, DEFAULT gen_random_uuid() | Unique identifier |
| week_id | VARCHAR(50) | NOT NULL, UNIQUE | Week identifier (e.g., "2025-W01") |
| image_a_url | TEXT | NOT NULL | URL for option A image |
| image_b_url | TEXT | NOT NULL | URL for option B image |
| votes_a | INTEGER | DEFAULT 0 | Vote count for option A |
| votes_b | INTEGER | DEFAULT 0 | Vote count for option B |
| start_date | TIMESTAMPTZ | NOT NULL | Week start date |
| end_date | TIMESTAMPTZ | NOT NULL | Week end date |
| created_at | TIMESTAMPTZ | DEFAULT NOW() | Record creation timestamp |

**Indexes:**
- `idx_weekly_votes_week_id` on (week_id)
- `idx_weekly_votes_dates` on (start_date, end_date)

**RLS Policy:**
- `Public read access` - Anyone can SELECT

**Usage Example:**
```sql
-- Get current week's voting
SELECT * FROM weekly_votes 
WHERE start_date <= NOW() AND end_date >= NOW()
ORDER BY start_date DESC 
LIMIT 1;
```

---

### vote_records

**Purpose:** Tracks individual votes to prevent duplicate voting

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY, DEFAULT gen_random_uuid() | Unique identifier |
| week_id | VARCHAR(50) | NOT NULL | Reference to weekly_votes.week_id |
| voter_ip | VARCHAR(45) | NULL | Voter's IP address |
| voter_fingerprint | TEXT | NULL | Browser fingerprint |
| selected_option | CHAR(1) | CHECK IN ('A', 'B') | Selected option |
| voted_at | TIMESTAMPTZ | DEFAULT NOW() | Vote timestamp |

**Indexes:**
- `idx_vote_records_tracking` on (week_id, voter_ip)
- `idx_vote_records_voted_at` on (voted_at)

**RLS Policy:**
- `Allow vote insertion` - Anyone can INSERT

**Usage Example:**
```sql
-- Check if IP has already voted this week
SELECT COUNT(*) FROM vote_records 
WHERE week_id = 'week-2025-01' 
  AND voter_ip = '192.168.1.1';
```

---

### friends_of_club

**Purpose:** Stores partner organizations and affiliates

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY, DEFAULT gen_random_uuid() | Unique identifier |
| name | VARCHAR(200) | NOT NULL | Organization name |
| description | TEXT | NULL | Organization description |
| logo_url | TEXT | NULL | Logo image URL |
| website_url | TEXT | NULL | Organization website |
| display_order | INTEGER | NULL | Sort order for display |
| is_active | BOOLEAN | DEFAULT true | Active status |
| created_at | TIMESTAMPTZ | DEFAULT NOW() | Record creation timestamp |

**Indexes:**
- `idx_friends_display_order` on (display_order)
- `idx_friends_active` on (is_active)

**RLS Policy:**
- `Public read access` - Anyone can SELECT WHERE is_active = true

**Usage Example:**
```sql
-- Get all active partners, sorted by display order
SELECT * FROM friends_of_club 
WHERE is_active = true 
ORDER BY display_order NULLS LAST;
```

---

### timeline_events

**Purpose:** Historical events from Lou Gehrig's life and career

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY, DEFAULT gen_random_uuid() | Unique identifier |
| date | DATE | NOT NULL | Event date |
| title | VARCHAR(200) | NOT NULL | Event title |
| description | TEXT | NULL | Event description |
| category | VARCHAR(50) | NULL | Event category |
| image_url | TEXT | NULL | Event image URL |
| created_at | TIMESTAMPTZ | DEFAULT NOW() | Record creation timestamp |

**Indexes:**
- `idx_timeline_date` on (date)
- `idx_timeline_category` on (category)

**RLS Policy:**
- `Public read access` - Anyone can SELECT

**Categories:**
- Early Life
- Career
- Achievement
- Health
- Legacy

**Usage Example:**
```sql
-- Get all events in chronological order
SELECT * FROM timeline_events 
ORDER BY date ASC;

-- Get events by category
SELECT * FROM timeline_events 
WHERE category = 'Achievement' 
ORDER BY date DESC;
```

---

### faq_items

**Purpose:** Frequently asked questions about Lou Gehrig

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY, DEFAULT gen_random_uuid() | Unique identifier |
| question | TEXT | NOT NULL | Question text |
| answer | TEXT | NOT NULL | Answer text |
| category | VARCHAR(50) | NULL | Question category |
| display_order | INTEGER | NULL | Sort order for display |
| is_published | BOOLEAN | DEFAULT true | Published status |
| created_at | TIMESTAMPTZ | DEFAULT NOW() | Record creation timestamp |
| updated_at | TIMESTAMPTZ | DEFAULT NOW() | Last update timestamp |

**Indexes:**
- `idx_faq_category` on (category)
- `idx_faq_published` on (is_published)
- `idx_faq_display_order` on (display_order)

**RLS Policy:**
- `Public read access` - Anyone can SELECT WHERE is_published = true

**Triggers:**
- `update_faq_items_updated_at` - Auto-updates updated_at on row update

**Categories:**
- Biography
- Career
- Health
- Legacy
- General

**Usage Example:**
```sql
-- Get all published FAQs, sorted by display order
SELECT * FROM faq_items 
WHERE is_published = true 
ORDER BY display_order NULLS LAST;
```

---

### calendar_events

**Purpose:** Club events and activities

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY, DEFAULT gen_random_uuid() | Unique identifier |
| title | VARCHAR(200) | NOT NULL | Event title |
| description | TEXT | NULL | Event description |
| event_date | TIMESTAMPTZ | NOT NULL | Event start date/time |
| end_date | TIMESTAMPTZ | NULL | Event end date/time |
| location | VARCHAR(200) | NULL | Event location |
| event_type | VARCHAR(50) | NULL | Type of event |
| registration_url | TEXT | NULL | Registration link |
| is_published | BOOLEAN | DEFAULT true | Published status |
| created_at | TIMESTAMPTZ | DEFAULT NOW() | Record creation timestamp |

**Indexes:**
- `idx_calendar_event_date` on (event_date)
- `idx_calendar_published` on (is_published)

**RLS Policy:**
- `Public read access` - Anyone can SELECT WHERE is_published = true

**Event Types:**
- Annual Event
- Fundraiser
- Social Event
- Memorial
- Educational

**Usage Example:**
```sql
-- Get upcoming published events
SELECT * FROM calendar_events 
WHERE is_published = true 
  AND event_date >= NOW() 
ORDER BY event_date ASC;
```

---

## Database Functions

### increment_vote(week VARCHAR, vote_column VARCHAR)

**Purpose:** Atomically increment vote counts

**Parameters:**
- `week` - The week_id to update
- `vote_column` - Either 'votes_a' or 'votes_b'

**Returns:** void

**Security:** SECURITY DEFINER (runs with creator's privileges)

**Usage Example:**
```sql
-- Increment vote count for option A
SELECT increment_vote('week-2025-01', 'votes_a');
```

---

### get_current_voting()

**Purpose:** Get the current active voting matchup

**Returns:** Table with current week's voting data

**Security:** SECURITY DEFINER

**Usage Example:**
```sql
-- Get current voting matchup
SELECT * FROM get_current_voting();
```

---

## Row Level Security (RLS)

All tables have Row Level Security enabled. Policies are designed to:

1. **Allow public read access** to published/active content
2. **Restrict write access** to service role only (via API routes)
3. **Allow public vote insertion** for the voting feature

### Security Best Practices

- **Client-side queries:** Use anon key for read-only operations
- **Admin operations:** Use service role key in API routes only
- **Vote recording:** Use anon key with RLS policy for public inserts
- **Updates/Deletes:** Always use service role key via secure API routes

---

## Data Validation

### Constraints

- **week_id:** Must be unique across weekly_votes
- **selected_option:** Must be 'A' or 'B'
- **NOT NULL constraints:** Ensure required fields are provided
- **Boolean defaults:** is_active, is_published default to true

### Indexes

All indexes are created with `IF NOT EXISTS` for idempotent migrations:
- Primary key indexes (automatic)
- Foreign key-like indexes (week_id, voter_ip)
- Filtering indexes (is_active, is_published)
- Sort indexes (display_order, date, event_date)

---

## Migration Strategy

Migrations are numbered sequentially:

1. `20250101000001_create_weekly_votes.sql`
2. `20250101000002_create_vote_records.sql`
3. `20250101000003_create_friends_of_club.sql`
4. `20250101000004_create_timeline_events.sql`
5. `20250101000005_create_faq_items.sql`
6. `20250101000006_create_calendar_events.sql`
7. `20250101000007_create_functions.sql`
8. `20250101000008_create_triggers.sql`

All migrations use:
- `CREATE TABLE IF NOT EXISTS`
- `CREATE INDEX IF NOT EXISTS`
- `DROP POLICY IF EXISTS` before `CREATE POLICY`
- Idempotent operations for safe re-running

---

## Performance Considerations

### Indexes

All tables have appropriate indexes for:
- Primary lookups (week_id, date)
- Filtering (is_active, is_published)
- Sorting (display_order, date fields)
- Joins (week_id in vote_records)

### Query Optimization

- Use indexes for WHERE clauses
- Order by indexed columns when possible
- Limit results for paginated queries
- Use RLS policies to filter at database level

---

## Backup and Maintenance

### Regular Tasks

- **Backups:** Supabase provides automatic daily backups
- **Cleanup:** Archive old vote_records periodically
- **Monitoring:** Check vote counts and event dates regularly
- **Updates:** Use updated_at trigger for change tracking

### Manual Backup

```bash
# Export database
npx supabase db dump -f backup.sql

# Restore database
psql $DATABASE_URL < backup.sql
```

---

## Development Workflow

1. **Create migration:** `npx supabase migration new migration_name`
2. **Test locally:** `npx supabase start` and test changes
3. **Generate types:** `npm run supabase:types`
4. **Deploy:** `npx supabase db push` to production

---

## Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Database Functions](https://supabase.com/docs/guides/database/functions)
