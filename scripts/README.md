# Database Scripts

This directory contains scripts for managing the Supabase database.

## Available Scripts

### `check-env.js`
Validates environment variable configuration.

```bash
npm run check:env
```

Checks for:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` (or `NEXT_PUBLIC_SUPABASE_API_KEY`)
- `SUPABASE_SERVICE_ROLE_KEY` (optional)

### `run-migrations.js`
Runs database migrations to create schema.

```bash
npm run db:migrate
```

**Requirements:**
- Network access to Supabase
- `SUPABASE_SERVICE_ROLE_KEY` environment variable

**Alternative:** Use `supabase-migrations.sql` in Supabase SQL Editor

### `export-migrations.js`
Exports all migrations to a single SQL file.

```bash
npm run db:export
```

**Output:** `supabase-migrations.sql` in project root

### `seed-db.js`
Populates database with sample data.

```bash
npm run db:seed
```

**Requirements:**
- Network access to Supabase
- `SUPABASE_SERVICE_ROLE_KEY` environment variable
- Database tables must exist (run migrations first)

### `test-db.js`
Tests database connection and table accessibility.

```bash
npm run db:test
```

**Requirements:**
- Network access to Supabase
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` environment variable

### `verify-supabase-setup.js`
Comprehensive verification of Supabase setup.

```bash
npm run verify:supabase
```

Checks:
- Environment variables
- Package installation
- File existence
- NPM script configuration
- Documentation

### `fetch-service-key.js`
Fetches service role key from Supabase Management API.

```bash
node scripts/fetch-service-key.js
```

**Requirements:**
- Network access to Supabase API
- `SUPABASE_ACCESS_TOKEN` environment variable
- `SUPABASE_PROJECT_ID` environment variable

### `run-migrations-direct.js`
Alternative migration script using direct PostgreSQL connection.

```bash
node scripts/run-migrations-direct.js
```

**Requirements:**
- Network access to Supabase database
- `SUPABASE_DB_PASSWORD` environment variable
- `SUPABASE_PROJECT_ID` environment variable

**Note:** This is a fallback method when REST API is unavailable.

## Quick Reference

| Script | Purpose | Network Required | Service Key Required |
|--------|---------|------------------|---------------------|
| `check-env.js` | Validate config | No | No |
| `export-migrations.js` | Export SQL | No | No |
| `verify-supabase-setup.js` | Verify setup | Optional | No |
| `run-migrations.js` | Create schema | Yes | Yes |
| `seed-db.js` | Add sample data | Yes | Yes |
| `test-db.js` | Test connection | Yes | No |
| `fetch-service-key.js` | Get service key | Yes | No |
| `run-migrations-direct.js` | Direct migration | Yes | No |

## Network Restrictions

If you're in a network-restricted environment (like CI/CD), use the manual migration method:

1. Run `npm run db:export` to generate `supabase-migrations.sql`
2. Copy the SQL file contents
3. Open Supabase Dashboard → SQL Editor
4. Paste and run the SQL

See `SUPABASE_TROUBLESHOOTING.md` for detailed troubleshooting.

## Helper Scripts

### `gh-login-guard.sh`
Checks if GitHub CLI is authenticated before running scripts.

### `create_secrets.sh`
Helper for creating GitHub repository secrets.

## Development Workflow

1. **Initial Setup:**
   ```bash
   npm install
   npm run check:env
   npm run db:migrate  # Or use manual method
   npm run db:seed     # Optional
   ```

2. **Verification:**
   ```bash
   npm run verify:supabase
   npm run db:test
   ```

3. **Adding New Migrations:**
   - Edit `run-migrations.js`
   - Run `npm run db:export`
   - Execute in Supabase SQL Editor or via `npm run db:migrate`

## Support

For help:
- See `../PR17_RESOLUTION.md` for setup guide
- See `../SUPABASE_TROUBLESHOOTING.md` for troubleshooting
- See `../SUPABASE_SETUP.md` for comprehensive documentation
