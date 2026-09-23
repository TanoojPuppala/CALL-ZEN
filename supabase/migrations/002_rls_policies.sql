-- ========================================================
-- SMARTCALL AI — SUPABASE ROW LEVEL SECURITY (RLS) POLICIES
-- Migration 002: Security & Multi-Tenant Authorization
-- ========================================================

-- Enable Row Level Security on all tables
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

-- Helper function: get user's organization_id from profiles
CREATE OR REPLACE FUNCTION public.get_user_organization_id()
RETURNS UUID AS $$
BEGIN
  RETURN (
    SELECT organization_id
    FROM public.profiles
    WHERE auth_user_id = auth.uid()
    LIMIT 1
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 1. ORGANIZATIONS POLICIES
CREATE POLICY "Users can view their own organization"
  ON public.organizations FOR SELECT
  USING (id = public.get_user_organization_id() OR auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can create an organization"
  ON public.organizations FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- 2. PROFILES POLICIES
CREATE POLICY "Users can read profiles in their organization"
  ON public.profiles FOR SELECT
  USING (organization_id = public.get_user_organization_id() OR auth_user_id = auth.uid());

CREATE POLICY "Users can insert their profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth_user_id = auth.uid());

-- 3. INDUSTRY CONFIGS POLICIES
CREATE POLICY "Anyone authenticated can read industry configs"
  ON public.industry_configs FOR SELECT
  USING (auth.role() = 'authenticated');

-- 4. PERIODS POLICIES
CREATE POLICY "Users can read/write periods in their organization"
  ON public.periods FOR ALL
  USING (organization_id = public.get_user_organization_id() OR auth.role() = 'authenticated');

-- 5. CONTACTS POLICIES
CREATE POLICY "Users can read/write contacts in their organization"
  ON public.contacts FOR ALL
  USING (organization_id = public.get_user_organization_id() OR auth.role() = 'authenticated');

-- 6. LEAVE RECORDS POLICIES
CREATE POLICY "Users can read/write leave records in their organization"
  ON public.leave_records FOR ALL
  USING (organization_id = public.get_user_organization_id() OR auth.role() = 'authenticated');

-- 7. CALLING SESSIONS & QUEUE POLICIES
CREATE POLICY "Users can read/write calling sessions in their organization"
  ON public.calling_sessions FOR ALL
  USING (organization_id = public.get_user_organization_id() OR auth.role() = 'authenticated');

CREATE POLICY "Users can read/write calling queue items"
  ON public.calling_queue_items FOR ALL
  USING (auth.role() = 'authenticated');

-- 8. CALL LOGS & REPORTS POLICIES
CREATE POLICY "Users can read/write call logs"
  ON public.call_logs FOR ALL
  USING (auth.role() = 'authenticated');

CREATE POLICY "Users can read/write call reports"
  ON public.call_reports FOR ALL
  USING (auth.role() = 'authenticated');

-- 9. AUDIT LOGS POLICIES
CREATE POLICY "Users can read/write audit logs"
  ON public.audit_logs FOR ALL
  USING (auth.role() = 'authenticated');
