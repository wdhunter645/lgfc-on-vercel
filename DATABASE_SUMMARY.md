# Database Schema Summary

## Tables Overview

This document provides a quick reference for the Lou Gehrig Fan Club database schema.

```
┌─────────────────────────────────────────────────────────────────┐
│                  LGFC Database Architecture                     │
└─────────────────────────────────────────────────────────────────┘

┌──────────────────┐      ┌──────────────────┐
│  weekly_votes    │      │  vote_records    │
│  ═══════════     │      │  ═══════════     │
│  • id            │─┐  ┌─│  • id            │
│  • week_id       │ └──┘ │  • week_id       │
│  • image_a_url   │      │  • voter_ip      │
│  • image_b_url   │      │  • selected      │
│  • votes_a       │      │  • voted_at      │
│  • votes_b       │      └──────────────────┘
│  • dates         │      
└──────────────────┘      ┌──────────────────┐
                          │ friends_of_club  │
┌──────────────────┐      │  ═══════════     │
│ timeline_events  │      │  • id            │
│  ═══════════     │      │  • name          │
│  • id            │      │  • description   │
│  • date          │      │  • logo_url      │
│  • title         │      │  • website_url   │
│  • description   │      │  • is_active     │
│  • category      │      └──────────────────┘
│  • image_url     │      
└──────────────────┘      ┌──────────────────┐
                          │  faq_items       │
┌──────────────────┐      │  ═══════════     │
│ calendar_events  │      │  • id            │
│  ═══════════     │      │  • question      │
│  • id            │      │  • answer        │
│  • title         │      │  • category      │
│  • description   │      │  • is_published  │
│  • event_date    │      └──────────────────┘
│  • location      │      
│  • is_published  │      
└──────────────────┘      
```

## Quick Stats

| Metric | Count |
|--------|-------|
| **Tables** | 6 |
| **Indexes** | 14 |
| **Functions** | 2 |
| **Triggers** | 1 |
| **RLS Policies** | 6 |

## Table Purposes

### 📊 Voting System
- **weekly_votes**: Stores weekly photo matchups
- **vote_records**: Tracks individual votes (prevents duplicates)

### 📰 Content Management
- **timeline_events**: Lou Gehrig's life milestones
- **faq_items**: Frequently asked questions
- **calendar_events**: Upcoming club events

### 🤝 Partnerships
- **friends_of_club**: Partner organizations and affiliates

## Security Model

All tables use **Row Level Security (RLS)**:

| Table | Public Read | Public Write | Admin Write |
|-------|-------------|--------------|-------------|
| weekly_votes | ✅ Yes | ❌ No | ✅ Yes |
| vote_records | ❌ No | ✅ Insert Only | ✅ Yes |
| friends_of_club | ✅ Active Only | ❌ No | ✅ Yes |
| timeline_events | ✅ Yes | ❌ No | ✅ Yes |
| faq_items | ✅ Published Only | ❌ No | ✅ Yes |
| calendar_events | ✅ Published Only | ❌ No | ✅ Yes |

## Database Functions

### `increment_vote(week, vote_column)`
- **Purpose**: Atomically increment vote counts
- **Parameters**: 
  - `week` (varchar) - Week identifier
  - `vote_column` (varchar) - 'votes_a' or 'votes_b'
- **Usage**: Called by voting API to prevent race conditions

### `get_current_voting()`
- **Purpose**: Retrieve current active voting matchup
- **Returns**: Current week's voting data
- **Usage**: Called by frontend to display voting UI

## Indexes

### Performance Optimized For:
- ✅ Looking up votes by week_id
- ✅ Finding current/upcoming voting periods
- ✅ Preventing duplicate votes (IP + week)
- ✅ Sorting timeline by date
- ✅ Filtering published/active content
- ✅ Ordering items by display_order

## Data Relationships

```
weekly_votes.week_id ←→ vote_records.week_id (logical relationship)
```

Note: The schema uses logical relationships without foreign key constraints
to allow flexibility in data management.

## Migration Files

Located in `supabase/migrations/`:

1. `20250101000001_create_weekly_votes.sql`
2. `20250101000002_create_vote_records.sql`
3. `20250101000003_create_friends_of_club.sql`
4. `20250101000004_create_timeline_events.sql`
5. `20250101000005_create_faq_items.sql`
6. `20250101000006_create_calendar_events.sql`
7. `20250101000007_create_functions.sql`
8. `20250101000008_create_triggers.sql`

## Size Estimates

For planning purposes:

| Table | Estimated Size (1 year) |
|-------|------------------------|
| weekly_votes | ~50 records |
| vote_records | ~50,000 records |
| friends_of_club | ~20 records |
| timeline_events | ~100 records |
| faq_items | ~50 records |
| calendar_events | ~100 records |

## Connection URLs

### Development (Local Supabase)
```
Database URL: postgresql://postgres:postgres@localhost:54322/postgres
API URL: http://localhost:54321
Studio URL: http://localhost:54323
```

### Production
```
API URL: https://[project-ref].supabase.co
Database URL: Available in Supabase Dashboard → Settings → Database
```

## Environment Variables Required

```bash
# Public (client-side safe)
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...

# Private (server-side only)
SUPABASE_SERVICE_ROLE_KEY=eyJxxx...
```

## TypeScript Types

Generate type-safe interfaces:

```bash
npm run supabase:types
```

This creates `app/lib/database.types.ts` with TypeScript definitions for all tables.

## Further Documentation

- **Setup**: [CREATE_TABLES.md](./CREATE_TABLES.md)
- **Verification**: [VERIFY_TABLES.md](./VERIFY_TABLES.md)
- **Detailed Schema**: [supabase/SCHEMA.md](./supabase/SCHEMA.md)
- **Configuration**: [SUPABASE_SETUP.md](./SUPABASE_SETUP.md)
- **Troubleshooting**: [SUPABASE_TROUBLESHOOTING.md](./SUPABASE_TROUBLESHOOTING.md)

## Quick Commands

```bash
# Create tables
npm run db:migrate

# Verify tables
npm run db:test

# Seed sample data
npm run db:seed

# Generate TypeScript types
npm run supabase:types

# Start local Supabase
npm run supabase:start
```
