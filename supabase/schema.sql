-- ==============================================================================
-- SMARTCALL AI — SUPABASE DATABASE SCHEMA
-- "Select. Speak. Call. Track. Complete."
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. ORGANIZATIONS TABLE
CREATE TABLE IF NOT EXISTS public.organizations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    industry TEXT NOT NULL DEFAULT 'education',
    code TEXT UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. USER PROFILES TABLE (Linked with Supabase Auth)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    org_name TEXT,
    industry TEXT DEFAULT 'education',
    role TEXT DEFAULT 'org_admin',
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. PERIODS / SEMESTERS / DATASETS TABLE
CREATE TABLE IF NOT EXISTS public.periods (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    year TEXT NOT NULL,
    department_or_class TEXT NOT NULL,
    in_charge_name TEXT NOT NULL,
    is_archived BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. CONTACTS TABLE (Students, Customers, Patients, Applicants, etc.)
CREATE TABLE IF NOT EXISTS public.contacts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
    period_id UUID REFERENCES public.periods(id) ON DELETE SET NULL,
    external_id TEXT NOT NULL, -- Roll No, Customer ID, Candidate ID
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    department TEXT,
    category TEXT DEFAULT 'Regular',
    overall_attendance NUMERIC DEFAULT 100,
    status TEXT DEFAULT 'present',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. CAMPAIGNS TABLE
CREATE TABLE IF NOT EXISTS public.campaigns (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
    period_id UUID REFERENCES public.periods(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    type TEXT DEFAULT 'attendance',
    assigned_caller_id UUID,
    assigned_caller_name TEXT,
    total_contacts INTEGER DEFAULT 0,
    completed_count INTEGER DEFAULT 0,
    status TEXT DEFAULT 'in_progress',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. CALL LOGS TABLE (Structured AI Call Reports)
CREATE TABLE IF NOT EXISTS public.call_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    contact_id UUID REFERENCES public.contacts(id) ON DELETE SET NULL,
    contact_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    caller_id UUID,
    caller_name TEXT NOT NULL,
    outcome TEXT NOT NULL,
    reason TEXT,
    follow_up_date DATE,
    notes TEXT,
    call_duration_seconds INTEGER DEFAULT 0,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. AUDIT LOGS TABLE (PRD Section 81)
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    actor_name TEXT NOT NULL,
    actor_role TEXT NOT NULL,
    action TEXT NOT NULL,
    details TEXT NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.periods ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.call_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Development policies (allow authenticated access)
CREATE POLICY "Allow authenticated read organizations" ON public.organizations FOR SELECT USING (true);
CREATE POLICY "Allow authenticated insert organizations" ON public.organizations FOR ALL USING (true);

CREATE POLICY "Allow authenticated read profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Allow authenticated update profiles" ON public.profiles FOR ALL USING (true);

CREATE POLICY "Allow authenticated all contacts" ON public.contacts FOR ALL USING (true);
CREATE POLICY "Allow authenticated all call_logs" ON public.call_logs FOR ALL USING (true);
CREATE POLICY "Allow authenticated all audit_logs" ON public.audit_logs FOR ALL USING (true);
