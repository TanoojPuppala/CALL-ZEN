-- ========================================================
-- SMARTCALL AI — REALTIME SUBSCRIPTIONS
-- Migration 004: Enable Realtime for Active Tables
-- ========================================================

-- Enable Realtime publication on active tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.contacts;
ALTER PUBLICATION supabase_realtime ADD TABLE public.calling_sessions;
ALTER PUBLICATION supabase_realtime ADD TABLE public.calling_queue_items;
ALTER PUBLICATION supabase_realtime ADD TABLE public.call_logs;
ALTER PUBLICATION supabase_realtime ADD TABLE public.leave_records;
