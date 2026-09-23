-- ========================================================
-- SMARTCALL AI — DATABASE INDEXES & CONSTRAINTS
-- Migration 003: Performance Optimization
-- ========================================================

-- Organization & Period Indexes
CREATE INDEX IF NOT EXISTS idx_contacts_org_period ON public.contacts(organization_id, period_id);
CREATE INDEX IF NOT EXISTS idx_contacts_roll_number ON public.contacts(roll_number);
CREATE INDEX IF NOT EXISTS idx_contacts_is_selected ON public.contacts(is_selected);

-- Leave Records Indexes
CREATE INDEX IF NOT EXISTS idx_leave_records_contact_date ON public.leave_records(contact_id, start_date, end_date, status);
CREATE INDEX IF NOT EXISTS idx_leave_records_status ON public.leave_records(status);

-- Calling Sessions & Queue Indexes
CREATE INDEX IF NOT EXISTS idx_calling_queue_session_status ON public.calling_queue_items(session_id, status, queue_order);
CREATE INDEX IF NOT EXISTS idx_call_logs_contact ON public.call_logs(contact_id, call_time);
CREATE INDEX IF NOT EXISTS idx_call_reports_log ON public.call_reports(log_id);

-- Updated_at Auto-Trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_organizations_modtime
  BEFORE UPDATE ON public.organizations
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_contacts_modtime
  BEFORE UPDATE ON public.contacts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_leave_records_modtime
  BEFORE UPDATE ON public.leave_records
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
