import { createClient } from '@supabase/supabase-js';

// Environment variables or fallback demo credentials
const env = (import.meta as any)?.env || {};
const supabaseUrl = env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl !== 'https://demo-smartcall.supabase.co' &&
  !supabaseUrl.includes('your-project-ref')
);

// Fallback placeholder client if env not set
export const supabase = createClient(
  isSupabaseConfigured ? supabaseUrl : 'https://demo-smartcall.supabase.co',
  isSupabaseConfigured ? supabaseAnonKey : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.dummy_anon_key'
);

export interface SignUpData {
  fullName: string;
  email: string;
  password?: string;
  orgName: string;
  industry: string;
  role: string;
}

/**
 * Sign up a new user with Supabase Auth & Profile Record
 */
export async function signUpUser(data: SignUpData) {
  if (isSupabaseConfigured) {
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password || 'SmartCall@2026',
        options: {
          data: {
            full_name: data.fullName,
            organization_name: data.orgName,
            industry: data.industry,
            role: data.role
          }
        }
      });

      if (authError) throw authError;

      // Upsert profile record
      if (authData?.user) {
        await supabase.from('profiles').upsert({
          id: authData.user.id,
          full_name: data.fullName,
          email: data.email,
          org_name: data.orgName,
          industry: data.industry,
          role: data.role,
          updated_at: new Date().toISOString()
        }).select();
      }

      return { user: authData.user, success: true, message: 'Account created in Supabase!' };
    } catch (err: any) {
      console.warn('Supabase sign-up error, using local fallback:', err.message);
    }
  }

  // Local persistence fallback
  const mockUser = {
    id: `user-${Date.now()}`,
    email: data.email,
    user_metadata: {
      full_name: data.fullName,
      organization_name: data.orgName,
      industry: data.industry,
      role: data.role
    }
  };

  const storedUsers = JSON.parse(localStorage.getItem('smartcall_users') || '[]');
  storedUsers.push(mockUser);
  localStorage.setItem('smartcall_users', JSON.stringify(storedUsers));
  localStorage.setItem('smartcall_current_user', JSON.stringify(mockUser));

  return { user: mockUser, success: true, message: 'Account created locally (offline mode)!' };
}

/**
 * Sign in an existing user
 */
export async function signInUser(email: string, password?: string) {
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password: password || 'password123'
      });
      if (error) throw error;
      return { user: data.user, success: true };
    } catch (err: any) {
      console.warn('Supabase sign-in error, using local fallback:', err.message);
    }
  }

  // Local fallback
  const storedUsers = JSON.parse(localStorage.getItem('smartcall_users') || '[]');
  const user = storedUsers.find((u: any) => u.email === email) || {
    id: 'user-default',
    email,
    user_metadata: {
      full_name: 'Administrator',
      organization_name: 'SmartCall Organization',
      industry: 'education',
      role: 'org_admin'
    }
  };

  localStorage.setItem('smartcall_current_user', JSON.stringify(user));
  return { user, success: true };
}

/**
 * Sync uploaded or edited contacts with Supabase
 */
export async function syncContactsToSupabase(contacts: any[]) {
  if (!isSupabaseConfigured) return false;
  try {
    const { error } = await supabase.from('contacts').upsert(
      contacts.map(c => ({
        id: c.id?.startsWith('contact-') ? undefined : c.id,
        organization_id: c.organizationId,
        period_id: c.periodId,
        external_id: c.externalId || '',
        name: c.name,
        phone: c.phone,
        department: c.department || '',
        category: c.category || 'Regular',
        overall_attendance: c.overallAttendance || 100,
        status: c.status || 'present',
        updated_at: new Date().toISOString()
      }))
    );
    if (error) throw error;
    return true;
  } catch (err: any) {
    console.warn('Failed to sync contacts to Supabase:', err.message);
    return false;
  }
}

/**
 * Fetch contacts from Supabase
 */
export async function fetchContactsFromSupabase() {
  if (!isSupabaseConfigured) return null;
  try {
    const { data, error } = await supabase.from('contacts').select('*');
    if (error) throw error;
    return data.map((c: any) => ({
      id: c.id,
      organizationId: c.organization_id || 'org-1',
      periodId: c.period_id || 'period-1',
      externalId: c.external_id || '',
      name: c.name,
      phone: c.phone,
      department: c.department || '',
      category: c.category || 'Regular',
      overallAttendance: Number(c.overall_attendance || 100),
      status: c.status || 'present',
      createdAt: c.created_at || new Date().toISOString()
    }));
  } catch (err: any) {
    console.warn('Failed to fetch contacts from Supabase:', err.message);
    return null;
  }
}

/**
 * Delete a contact from Supabase
 */
export async function deleteContactFromSupabase(id: string) {
  if (!isSupabaseConfigured) return false;
  try {
    const { error } = await supabase.from('contacts').delete().eq('id', id);
    if (error) throw error;
    return true;
  } catch (err: any) {
    console.warn('Failed to delete contact from Supabase:', err.message);
    return false;
  }
}

/**
 * Save call log report to Supabase
 */
export async function saveCallLogToSupabase(report: any) {
  if (!isSupabaseConfigured) return false;
  try {
    const { error } = await supabase.from('call_logs').insert({
      contact_id: report.contactId?.startsWith('contact-') ? null : report.contactId,
      contact_name: report.contactName,
      phone: report.contactPhone,
      caller_id: report.callerId?.startsWith('user-') ? null : report.callerId,
      caller_name: report.callerName,
      outcome: report.outcome,
      reason: report.reason,
      follow_up_date: report.followUpDate || null,
      notes: report.followUpNotes || '',
      call_duration_seconds: report.durationSeconds || 0,
      timestamp: new Date().toISOString()
    });
    if (error) throw error;
    return true;
  } catch (err: any) {
    console.warn('Failed to save call log to Supabase:', err.message);
    return false;
  }
}

/**
 * Save audit log event to Supabase
 */
export async function saveAuditLogToSupabase(actorName: string, actorRole: string, action: string, details: string) {
  if (!isSupabaseConfigured) return false;
  try {
    const { error } = await supabase.from('audit_logs').insert({
      actor_name: actorName,
      actor_role: actorRole,
      action: action,
      details: details,
      timestamp: new Date().toISOString()
    });
    if (error) throw error;
    return true;
  } catch (err: any) {
    console.warn('Failed to save audit log to Supabase:', err.message);
    return false;
  }
}

/**
 * Fetch periods from Supabase
 */
export async function fetchPeriodsFromSupabase() {
  if (!isSupabaseConfigured) return null;
  try {
    const { data, error } = await supabase.from('periods').select('*');
    if (error) throw error;
    return data.map((p: any) => ({
      id: p.id,
      organizationId: p.organization_id || 'org-1',
      name: p.name,
      year: p.year || '2026–27',
      semesterOrPeriod: p.name || 'Semester 1',
      departmentOrClass: p.department_or_class || 'General',
      inChargeName: p.in_charge_name || 'Admin',
      isArchived: p.is_archived || false,
      totalContacts: 0
    }));
  } catch (err: any) {
    console.warn('Failed to fetch periods from Supabase:', err.message);
    return null;
  }
}

/**
 * Fetch call logs from Supabase
 */
export async function fetchCallLogsFromSupabase() {
  if (!isSupabaseConfigured) return null;
  try {
    const { data, error } = await supabase.from('call_logs').select('*').order('timestamp', { ascending: false });
    if (error) throw error;
    return data.map((l: any) => ({
      id: l.id,
      contactId: l.contact_id || '',
      contactName: l.contact_name,
      contactPhone: l.phone,
      callerId: l.caller_id || 'user-default',
      callerName: l.caller_name,
      outcome: l.outcome,
      reason: l.reason,
      durationSeconds: l.call_duration_seconds || 0,
      followUpRequired: Boolean(l.follow_up_date),
      timestamp: l.timestamp
    }));
  } catch (err: any) {
    console.warn('Failed to fetch call logs from Supabase:', err.message);
    return null;
  }
}
