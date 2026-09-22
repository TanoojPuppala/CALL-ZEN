import {
  Organization,
  Period,
  User,
  Contact,
  Campaign,
  RetryItem,
  CallReport,
  AuditLog,
  IndustryTemplate,
  IndustryType
} from '../types';

export const INDUSTRY_TEMPLATES: Record<IndustryType, IndustryTemplate> = {
  education: {
    type: 'education',
    displayName: 'Education (Colleges & Schools)',
    entityLabel: 'Student',
    entityPluralLabel: 'Students',
    idColumnHeader: 'Roll No',
    statusColumnHeader: 'Attendance %',
    primaryCampaignName: 'Attendance Follow-up',
    sampleGroups: ['General Class']
  },
  banking: {
    type: 'banking',
    displayName: 'Banking & Financial Services',
    entityLabel: 'Customer',
    entityPluralLabel: 'Customers',
    idColumnHeader: 'Customer ID',
    statusColumnHeader: 'EMI / Case Status',
    primaryCampaignName: 'EMI & Overdue Collection',
    sampleGroups: ['Accounts']
  },
  recruitment: {
    type: 'recruitment',
    displayName: 'HR & Recruitment Teams',
    entityLabel: 'Candidate',
    entityPluralLabel: 'Applicants',
    idColumnHeader: 'Candidate ID',
    statusColumnHeader: 'Interview Stage',
    primaryCampaignName: 'Interview Confirmation',
    sampleGroups: ['Applicants']
  },
  corporate: {
    type: 'corporate',
    displayName: 'Corporate & Company Teams',
    entityLabel: 'Employee',
    entityPluralLabel: 'Employees',
    idColumnHeader: 'Employee ID',
    statusColumnHeader: 'Department / Status',
    primaryCampaignName: 'Townhall & Policy Check-in',
    sampleGroups: ['Staff']
  },
  service: {
    type: 'service',
    displayName: 'Post Office & Customer Service',
    entityLabel: 'Client',
    entityPluralLabel: 'Clients',
    idColumnHeader: 'Reference ID',
    statusColumnHeader: 'Service Ticket Status',
    primaryCampaignName: 'Delivery & Resolution Confirmation',
    sampleGroups: ['Tickets']
  }
};

// All production seed arrays start completely EMPTY.
// No fake organizations, no fake users, no fake contacts, no fake periods, no fake reports.
export const SEED_ORGANIZATIONS: Organization[] = [];
export const SEED_USERS: User[] = [];
export const SEED_PERIODS: Period[] = [];
export const SEED_CAMPAIGNS: Campaign[] = [];
export const SEED_CONTACTS: Contact[] = [];
export const BANKING_SEED_CONTACTS: Contact[] = [];
export const SEED_RETRY_ITEMS: RetryItem[] = [];
export const SEED_CALL_REPORTS: CallReport[] = [];
export const SEED_AUDIT_LOGS: AuditLog[] = [];
