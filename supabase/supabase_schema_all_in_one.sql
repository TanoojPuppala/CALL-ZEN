-- ============================================================================
-- SMARTCALL AI — ALL-IN-ONE SUPABASE PRODUCTION DATABASE SCHEMA
-- Copy and paste this ENTIRE script into the Supabase SQL Editor and click RUN.
-- ============================================================================

-- 1. ENABLE EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. CREATE TABLES
CREATE TABLE IF NOT EXISTS public.organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    industry TEXT NOT NULL CHECK (industry IN ('EDUCATION', 'BANKING', 'POST_OFFICE', 'CORPORATE', 'RECRUITMENT', 'HEALTHCARE', 'GOVERNMENT', 'CUSTOMER_SERVICE', 'OTHER')),
    code TEXT UNIQUE NOT NULL,
    email TEXT,
    phone TEXT,
    address TEXT,
    timezone TEXT DEFAULT 'UTC',
    working_hours TEXT DEFAULT '09:00 - 18:00',
    created_by UUID,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    auth_user_id UUID UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
    organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    role TEXT NOT NULL DEFAULT 'CALLER' CHECK (role IN ('SUPER_ADMIN', 'ORG_ADMIN', 'IN_CHARGE', 'MANAGER', 'HR', 'CALLER', 'VIEWER')),
    status TEXT NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'INACTIVE', 'SUSPENDED')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.industry_configs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    industry_type TEXT UNIQUE NOT NULL,
    contact_label TEXT NOT NULL,
    group_label TEXT NOT NULL,
    custom_fields_json JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.periods (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    period_id TEXT UNIQUE NOT NULL,
    organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    is_current BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.contacts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    contact_id TEXT UNIQUE NOT NULL,
    organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
    period_id UUID REFERENCES public.periods(id) ON DELETE CASCADE,
    roll_number TEXT NOT NULL,
    name TEXT NOT NULL,
    primary_phone TEXT NOT NULL,
    alternate_phone TEXT,
    weekly_attendance NUMERIC(5,2) DEFAULT 100.00,
    monthly_attendance NUMERIC(5,2) DEFAULT 100.00,
    overall_attendance NUMERIC(5,2) DEFAULT 100.00,
    current_status TEXT NOT NULL DEFAULT 'Active',
    is_selected BOOLEAN DEFAULT FALSE,
    group_name TEXT NOT NULL DEFAULT 'General',
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.contact_custom_fields (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    contact_id UUID REFERENCES public.contacts(id) ON DELETE CASCADE,
    field_key TEXT NOT NULL,
    field_value TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
    period_id UUID REFERENCES public.periods(id) ON DELETE CASCADE,
    contact_id UUID REFERENCES public.contacts(id) ON DELETE CASCADE,
    assigned_user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    assigned_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    status TEXT NOT NULL DEFAULT 'ASSIGNED',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.campaigns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
    period_id UUID REFERENCES public.periods(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    status TEXT NOT NULL DEFAULT 'PLANNED',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.calling_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id TEXT UNIQUE NOT NULL,
    organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
    period_id UUID REFERENCES public.periods(id) ON DELETE CASCADE,
    created_by_user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    total_selected INT NOT NULL DEFAULT 0,
    total_eligible_calls INT NOT NULL DEFAULT 0,
    completed_count INT NOT NULL DEFAULT 0,
    pending_count INT NOT NULL DEFAULT 0,
    retry_count INT NOT NULL DEFAULT 0,
    is_paused BOOLEAN DEFAULT FALSE,
    current_queue_index INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.calling_queue_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    queue_item_id TEXT UNIQUE NOT NULL,
    session_id UUID REFERENCES public.calling_sessions(id) ON DELETE CASCADE,
    contact_id UUID REFERENCES public.contacts(id) ON DELETE CASCADE,
    queue_order INT NOT NULL,
    status TEXT NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'IN_PROGRESS', 'COMPLETED', 'SKIPPED', 'RETRY_REQUIRED')),
    preferred_phone_type TEXT DEFAULT 'PRIMARY' CHECK (preferred_phone_type IN ('PRIMARY', 'ALTERNATE')),
    last_call_log_id UUID,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.call_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    log_id TEXT UNIQUE NOT NULL,
    session_id UUID REFERENCES public.calling_sessions(id) ON DELETE CASCADE,
    contact_id UUID REFERENCES public.contacts(id) ON DELETE CASCADE,
    number_used TEXT NOT NULL,
    number_used_type TEXT NOT NULL CHECK (number_used_type IN ('PRIMARY', 'ALTERNATE')),
    call_time TIMESTAMPTZ DEFAULT NOW(),
    duration_seconds INT DEFAULT 0,
    outcome_status TEXT NOT NULL CHECK (outcome_status IN ('ANSWERED', 'NO_ANSWER', 'BUSY', 'SWITCHED_OFF', 'CALLBACK_REQUIRED', 'WRONG_NUMBER', 'NOT_REQUIRED', 'COMPLETED', 'FAILED')),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.call_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    report_id TEXT UNIQUE NOT NULL,
    log_id UUID REFERENCES public.call_logs(id) ON DELETE CASCADE,
    contact_id UUID REFERENCES public.contacts(id) ON DELETE CASCADE,
    ai_status TEXT NOT NULL,
    ai_reason TEXT,
    follow_up_action TEXT,
    follow_up_date DATE,
    voice_note_url TEXT,
    is_confirmed BOOLEAN DEFAULT TRUE,
    confirmed_at TIMESTAMPTZ DEFAULT NOW(),
    edited_by_user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.follow_ups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    follow_up_id TEXT UNIQUE NOT NULL,
    contact_id UUID REFERENCES public.contacts(id) ON DELETE CASCADE,
    scheduled_date DATE NOT NULL,
    reason TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'DONE', 'CANCELLED')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.retry_attempts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    retry_id TEXT UNIQUE NOT NULL,
    contact_id UUID REFERENCES public.contacts(id) ON DELETE CASCADE,
    session_id UUID REFERENCES public.calling_sessions(id) ON DELETE CASCADE,
    attempt_number INT NOT NULL DEFAULT 1,
    previous_outcome TEXT NOT NULL,
    scheduled_time TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'COMPLETED', 'CANCELLED')),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.leave_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    leave_id TEXT UNIQUE NOT NULL,
    contact_id UUID REFERENCES public.contacts(id) ON DELETE CASCADE,
    organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
    period_id UUID REFERENCES public.periods(id) ON DELETE CASCADE,
    leave_type TEXT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    duration_days INT NOT NULL DEFAULT 1,
    reason TEXT NOT NULL,
    notes TEXT,
    status TEXT NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED', 'CANCELLED')),
    requested_by TEXT NOT NULL,
    approved_by TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    approved_at TIMESTAMPTZ,
    cancelled_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    audit_id TEXT UNIQUE NOT NULL,
    user_id TEXT NOT NULL,
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id TEXT NOT NULL,
    details TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. ENABLE ROW LEVEL SECURITY (RLS)
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.industry_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.periods ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_custom_fields ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.calling_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.calling_queue_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.call_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.call_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.follow_ups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.retry_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leave_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- 4. RLS POLICIES FOR ANON & AUTHENTICATED ACCESS
CREATE POLICY "Public read/write organizations" ON public.organizations FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public read/write profiles" ON public.profiles FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public read/write industry_configs" ON public.industry_configs FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public read/write periods" ON public.periods FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public read/write contacts" ON public.contacts FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public read/write custom_fields" ON public.contact_custom_fields FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public read/write assignments" ON public.assignments FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public read/write campaigns" ON public.campaigns FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public read/write calling_sessions" ON public.calling_sessions FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public read/write calling_queue_items" ON public.calling_queue_items FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public read/write call_logs" ON public.call_logs FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public read/write call_reports" ON public.call_reports FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public read/write follow_ups" ON public.follow_ups FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public read/write retry_attempts" ON public.retry_attempts FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public read/write leave_records" ON public.leave_records FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public read/write audit_logs" ON public.audit_logs FOR ALL USING (true) WITH CHECK (true);

-- 5. PERFORMANCE INDEXES
CREATE INDEX IF NOT EXISTS idx_contacts_org_period ON public.contacts(organization_id, period_id);
CREATE INDEX IF NOT EXISTS idx_contacts_roll_number ON public.contacts(roll_number);
CREATE INDEX IF NOT EXISTS idx_contacts_is_selected ON public.contacts(is_selected);
CREATE INDEX IF NOT EXISTS idx_leave_records_contact_date ON public.leave_records(contact_id, start_date, end_date, status);
CREATE INDEX IF NOT EXISTS idx_calling_queue_session_status ON public.calling_queue_items(session_id, status, queue_order);
CREATE INDEX IF NOT EXISTS idx_call_logs_contact ON public.call_logs(contact_id, call_time);

-- 6. ENABLE REALTIME
ALTER PUBLICATION supabase_realtime ADD TABLE public.contacts;
ALTER PUBLICATION supabase_realtime ADD TABLE public.calling_sessions;
ALTER PUBLICATION supabase_realtime ADD TABLE public.calling_queue_items;
ALTER PUBLICATION supabase_realtime ADD TABLE public.call_logs;
ALTER PUBLICATION supabase_realtime ADD TABLE public.leave_records;
