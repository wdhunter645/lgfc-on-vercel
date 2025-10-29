# Supabase Table Count - Answer

## Question
**How many tables are in use on Supabase?**

## Answer
**6 tables** are currently in use on Supabase for the Lou Gehrig Fan Club (lgfc-on-vercel) project.

## Table List

The following 6 tables are configured and in use:

### 1. **weekly_votes**
- **Purpose**: Stores weekly photo matchups for the voting feature
- **Key Fields**: week_id, image_a_url, image_b_url, votes_a, votes_b, start_date, end_date

### 2. **vote_records**
- **Purpose**: Tracks individual votes to prevent duplicate voting
- **Key Fields**: week_id, voter_ip, voter_fingerprint, selected_option, voted_at

### 3. **friends_of_club**
- **Purpose**: Stores partner organizations and affiliates
- **Key Fields**: name, description, logo_url, website_url, display_order, is_active

### 4. **timeline_events**
- **Purpose**: Historical events from Lou Gehrig's life and career
- **Key Fields**: date, title, description, category, image_url

### 5. **faq_items**
- **Purpose**: Frequently asked questions about Lou Gehrig
- **Key Fields**: question, answer, category, display_order, is_published

### 6. **calendar_events**
- **Purpose**: Club events and activities
- **Key Fields**: title, description, event_date, end_date, location, event_type, is_published

## Verification Method

This count was verified using multiple methods:

1. **Documentation Review**:
   - `DATABASE_SUMMARY.md` - Lists 6 tables in the schema
   - `supabase/SCHEMA.md` - Provides detailed specifications for all 6 tables
   - `SUPABASE_VERIFICATION.md` - Confirms setup of 6 tables

2. **Migration Files**:
   - 6 migration files exist in `supabase/migrations/` (files 20250101000001 through 20250101000006)
   - Each creates one of the tables listed above

3. **Automated Script**:
   - Created `scripts/count-tables.js` to programmatically count tables
   - Script verifies each table's existence via Supabase client
   - Available via `npm run db:count-tables`

## Database Statistics

According to the documentation:

| Metric | Count |
|--------|-------|
| **Tables** | **6** |
| Indexes | 14 |
| Functions | 2 |
| Triggers | 1 |
| RLS Policies | 6 |

## Table Categories

The 6 tables can be grouped into functional categories:

### 📊 Voting System (2 tables)
- weekly_votes
- vote_records

### 📰 Content Management (3 tables)
- timeline_events
- faq_items
- calendar_events

### 🤝 Partnerships (1 table)
- friends_of_club

## Related Commands

```bash
# Count tables programmatically
npm run db:count-tables

# Test database connection
npm run db:test

# Verify full Supabase setup
npm run verify:supabase

# Create tables (if not yet created)
npm run db:migrate
```

## References

For more detailed information, see:
- [DATABASE_SUMMARY.md](./DATABASE_SUMMARY.md) - Quick reference guide
- [supabase/SCHEMA.md](./supabase/SCHEMA.md) - Detailed schema documentation
- [SUPABASE_VERIFICATION.md](./SUPABASE_VERIFICATION.md) - Verification results
- [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) - Setup instructions

---

**Last Updated**: October 29, 2025  
**Verified By**: Table counting script (`scripts/count-tables.js`)
