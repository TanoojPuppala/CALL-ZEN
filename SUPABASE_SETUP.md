# SmartCall AI — Supabase Production Setup Guide

This guide details how to configure Supabase as the production backend for **SmartCall AI**.

---

## 1. Supabase Project Configuration
- **Supabase URL**: `https://eyoszuowvipdalrjxjvj.supabase.co`
- **Publishable / Anon Key**: `sb_publishable_vWrDcsBDYrbPukmoi5dYIQ_h0tNUw8a`

> **Note**: Never put the `service_role` secret key in the Android client. The anon publishable key is protected by Row Level Security (RLS) policies.

---

## 2. Execute SQL Migrations in Supabase SQL Editor

Go to your Supabase Dashboard -> **SQL Editor** and run the following migration scripts in order (located in `supabase/migrations/`):

1. **`001_initial_schema.sql`**: Creates tables (`organizations`, `profiles`, `industry_configs`, `periods`, `contacts`, `calling_sessions`, `calling_queue_items`, `call_logs`, `call_reports`, `leave_records`, `retry_attempts`, `audit_logs`).
2. **`002_rls_policies.sql`**: Enables Row Level Security (RLS) and sets organization-based data access policies.
3. **`003_indexes_and_constraints.sql`**: Creates performance indexes and `updated_at` triggers.
4. **`004_realtime.sql`**: Enables Supabase Realtime for `contacts`, `calling_sessions`, `calling_queue_items`, `call_logs`, and `leave_records`.

---

## 3. Architecture & Offline-First Design

```
Compose UI
   ↓
ViewModel
   ↓
Repository (SmartCallRepositoryImpl)
   ├── Room Local DB (SQLite Offline Cache)
   └── Supabase Remote REST API (PostgREST Service)
```

- **Offline-First**: All user actions (*Register Org, Add Contact, Sanction Leave, Call Outcome, Pause Session*) write to local Room DB immediately and launch background coroutines syncing to Supabase REST endpoints.
- **Fail-Safe**: If internet connection is unavailable, the application operates seamlessly on Room DB local cache and retries sync when connection is restored.
