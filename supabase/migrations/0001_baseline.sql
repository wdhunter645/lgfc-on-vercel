--
-- Baseline migration to verify CI→Supabase path
-- Safe, idempotent (no-op if re-run)
-- Enables uuid-ossp and creates a tiny control table
--
create extension if not exists "uuid-ossp";

create table if not exists public._baseline_applied (
  id uuid primary key default uuid_generate_v4(),
  applied_at timestamptz not null default now(),
  note text
);
