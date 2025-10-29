# Supabase Quick Reference

Quick reference guide for common Supabase operations.

## Setup Commands

```bash
# Install Supabase CLI (already in package.json)
npm install

# Initialize Supabase (already done)
npx supabase init

# Link to production project
npx supabase link --project-ref YOUR_PROJECT_REF

# Start local development database
npm run supabase:start

# Stop local database
npm run supabase:stop

# Check status
npm run supabase:status
```

## Migration Commands

```bash
# Create new migration
npx supabase migration new migration_name

# Apply migrations to production
npm run supabase:push

# Pull migrations from production
npm run supabase:pull

# Reset local database (reapply all migrations)
npm run supabase:reset
```

## Type Generation

```bash
# Generate TypeScript types from local database
npm run supabase:types

# Generate types from production
npx supabase gen types typescript --project-ref YOUR_PROJECT_REF > app/lib/database.types.ts
```

## Legacy Scripts (Still Supported)

```bash
# Check environment variables
npm run check:env

# Run migrations using custom script
npm run db:migrate

# Seed database
npm run db:seed

# Setup (migrate + seed)
npm run db:setup

# Test connection
npm run db:test

# Verify setup
npm run verify:supabase
```

## Local Development Workflow

1. **Start local Supabase:**
   ```bash
   npm run supabase:start
   ```
   
2. **Access Supabase Studio:**
   - Open: http://localhost:54323
   - View tables, run queries, manage data

3. **Use local database in development:**
   ```env
   # .env.local
   NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
   NEXT_PUBLIC_SUPABASE_ANON_KEY=<from supabase start output>
   ```

4. **Run your app:**
   ```bash
   npm run dev
   ```

5. **Make database changes:**
   ```bash
   # Create migration
   npx supabase migration new add_new_column
   
   # Edit the migration file in supabase/migrations/
   
   # Apply to local database
   npm run supabase:reset
   ```

6. **Generate updated types:**
   ```bash
   npm run supabase:types
   ```

## Production Deployment

1. **Create Supabase project** at [supabase.com](https://supabase.com)

2. **Link to project:**
   ```bash
   npx supabase link --project-ref YOUR_PROJECT_REF
   ```

3. **Push migrations:**
   ```bash
   npm run supabase:push
   ```

4. **Get credentials:**
   - Go to Project Settings → API
   - Copy URL and anon key

5. **Set environment variables in Vercel:**
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...
   SUPABASE_SERVICE_ROLE_KEY=eyJxxx...
   ```

6. **Optional - Seed data:**
   ```bash
   npm run db:seed
   ```

## Common Tasks

### View all tables
```sql
-- In Supabase Studio or SQL Editor
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public';
```

### Check migration status
```bash
npx supabase migration list
```

### Backup database
```bash
npx supabase db dump -f backup.sql
```

### Restore database
```bash
psql $DATABASE_URL < backup.sql
```

### Reset local database
```bash
npm run supabase:reset
# This will drop all tables and reapply migrations + seed data
```

## Troubleshooting

### "Docker not running"
```bash
# Start Docker Desktop, then:
npm run supabase:start
```

### "Migration failed"
```bash
# Check migration syntax
# View errors in output
# Fix migration file
# Try again with:
npm run supabase:reset
```

### "Types out of sync"
```bash
# Regenerate types
npm run supabase:types
```

### "Connection refused"
```bash
# Check if local Supabase is running
npm run supabase:status

# Restart if needed
npm run supabase:stop
npm run supabase:start
```

## Database Tables

| Table | Purpose |
|-------|---------|
| `weekly_votes` | Weekly photo voting matchups |
| `vote_records` | Individual vote tracking |
| `friends_of_club` | Partner organizations |
| `timeline_events` | Lou Gehrig's life events |
| `faq_items` | Frequently asked questions |
| `calendar_events` | Club events and activities |

## Environment Variables

### Development (.env.local)
```env
NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=<from supabase start>
SUPABASE_SERVICE_ROLE_KEY=<from supabase start>
```

### Production (Vercel)
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<from supabase dashboard>
SUPABASE_SERVICE_ROLE_KEY=<from supabase dashboard>
```

## Useful Links

- [Supabase Dashboard](https://app.supabase.com)
- [Supabase CLI Docs](https://supabase.com/docs/guides/cli)
- [Local Development Guide](https://supabase.com/docs/guides/local-development)
- [Migration Guide](https://supabase.com/docs/guides/cli/migrations)

## Getting Help

1. Check [supabase/README.md](./supabase/README.md) for detailed setup
2. Review [supabase/SCHEMA.md](./supabase/SCHEMA.md) for database schema
3. See [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) for comprehensive guide
4. Check [SUPABASE_TROUBLESHOOTING.md](./SUPABASE_TROUBLESHOOTING.md) for issues
