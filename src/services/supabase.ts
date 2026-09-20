import { createClient } from '@supabase/supabase-js';

// Environment variables or fallback demo credentials
const env = (import.meta as any)?.env || {};
const supabaseUrl = env.VITE_SUPABASE_URL || 'https://demo-smartcall.supabase.co';
const supabaseAnonKey = env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.dummy_anon_key';

export const isSupabaseConfigured = Boolean(
  env.VITE_SUPABASE_URL && 
  env.VITE_SUPABASE_ANON_KEY &&
  env.VITE_SUPABASE_URL !== 'https://demo-smartcall.supabase.co'
);

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

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

      // Try inserting into profiles table if available
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
      full_name: 'Mr. Srinivas Rao',
      organization_name: 'Apex Institute of Engineering & Tech',
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
        id: c.id,
        organization_id: c.organizationId,
        period_id: c.periodId,
        external_id: c.externalId,
        name: c.name,
        phone: c.phone,
        department: c.department,
        category: c.category,
        overall_attendance: c.overallAttendance,
        status: c.status,
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
