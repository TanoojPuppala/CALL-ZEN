import {
  Organization,
  User,
  Contact,
  Period,
  Campaign,
  CallingSession,
  CallReport,
  RetryItem,
  FollowUpItem,
  AuditLog,
  LeaveRecord
} from '../types';

const DB_PREFIX = 'smartcall_prod_';

/**
 * Storage helpers for persistent database state.
 * Empty by default on first install.
 */
export const SmartCallDB = {
  // Organizations
  getOrganizations: (): Organization[] => {
    return JSON.parse(localStorage.getItem(`${DB_PREFIX}organizations`) || '[]');
  },
  saveOrganization: (org: Organization) => {
    const orgs = SmartCallDB.getOrganizations();
    const existingIdx = orgs.findIndex(o => o.id === org.id);
    if (existingIdx >= 0) {
      orgs[existingIdx] = org;
    } else {
      orgs.push(org);
    }
    localStorage.setItem(`${DB_PREFIX}organizations`, JSON.stringify(orgs));
  },

  // Users / Auth
  getCurrentUser: (): User | null => {
    const raw = localStorage.getItem(`${DB_PREFIX}current_user`);
    return raw ? JSON.parse(raw) : null;
  },
  saveCurrentUser: (user: User | null) => {
    if (user) {
      localStorage.setItem(`${DB_PREFIX}current_user`, JSON.stringify(user));
    } else {
      localStorage.removeItem(`${DB_PREFIX}current_user`);
    }
  },

  // Contacts
  getContacts: (): Contact[] => {
    return JSON.parse(localStorage.getItem(`${DB_PREFIX}contacts`) || '[]');
  },
  saveContacts: (contacts: Contact[]) => {
    localStorage.setItem(`${DB_PREFIX}contacts`, JSON.stringify(contacts));
  },
  addContacts: (newContacts: Contact[]) => {
    const existing = SmartCallDB.getContacts();
    const updated = [...newContacts, ...existing];
    localStorage.setItem(`${DB_PREFIX}contacts`, JSON.stringify(updated));
  },

  // Periods / Semesters
  getPeriods: (): Period[] => {
    return JSON.parse(localStorage.getItem(`${DB_PREFIX}periods`) || '[]');
  },
  savePeriods: (periods: Period[]) => {
    localStorage.setItem(`${DB_PREFIX}periods`, JSON.stringify(periods));
  },

  // Leave Records
  getLeaveRecords: (): LeaveRecord[] => {
    return JSON.parse(localStorage.getItem(`${DB_PREFIX}leave_records`) || '[]');
  },
  saveLeaveRecord: (record: LeaveRecord) => {
    const existing = SmartCallDB.getLeaveRecords();
    const updated = [record, ...existing.filter(r => r.id !== record.id)];
    localStorage.setItem(`${DB_PREFIX}leave_records`, JSON.stringify(updated));
  },

  // Calling Sessions
  getActiveCallingSession: (): CallingSession | null => {
    const raw = localStorage.getItem(`${DB_PREFIX}calling_session`);
    return raw ? JSON.parse(raw) : null;
  },
  saveCallingSession: (session: CallingSession | null) => {
    if (session) {
      localStorage.setItem(`${DB_PREFIX}calling_session`, JSON.stringify(session));
    } else {
      localStorage.removeItem(`${DB_PREFIX}calling_session`);
    }
  },

  // Call Reports / Logs
  getCallReports: (): CallReport[] => {
    return JSON.parse(localStorage.getItem(`${DB_PREFIX}call_reports`) || '[]');
  },
  saveCallReport: (report: CallReport) => {
    const existing = SmartCallDB.getCallReports();
    const updated = [report, ...existing];
    localStorage.setItem(`${DB_PREFIX}call_reports`, JSON.stringify(updated));
  },

  // Retry Queue
  getRetryQueue: (): RetryItem[] => {
    return JSON.parse(localStorage.getItem(`${DB_PREFIX}retry_queue`) || '[]');
  },
  saveRetryQueue: (items: RetryItem[]) => {
    localStorage.setItem(`${DB_PREFIX}retry_queue`, JSON.stringify(items));
  },

  // Follow-ups
  getFollowUps: (): FollowUpItem[] => {
    return JSON.parse(localStorage.getItem(`${DB_PREFIX}follow_ups`) || '[]');
  },
  saveFollowUps: (items: FollowUpItem[]) => {
    localStorage.setItem(`${DB_PREFIX}follow_ups`, JSON.stringify(items));
  },

  // Audit Logs
  getAuditLogs: (): AuditLog[] => {
    return JSON.parse(localStorage.getItem(`${DB_PREFIX}audit_logs`) || '[]');
  },
  addAuditLog: (log: AuditLog) => {
    const existing = SmartCallDB.getAuditLogs();
    const updated = [log, ...existing];
    localStorage.setItem(`${DB_PREFIX}audit_logs`, JSON.stringify(updated));
  }
};
