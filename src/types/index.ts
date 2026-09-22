export type UserRole = 'super_admin' | 'org_admin' | 'manager' | 'caller' | 'viewer';
export type RoleMode = 'admin' | 'employee';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  roleTitle: string; // e.g. "Super Admin", "Org Admin", "Department Head", "Teacher / Caller"
  avatar?: string;
  organizationId: string;
  assignedPeriods?: string[]; // IDs of assigned classes/periods
}

export type IndustryType = 'education' | 'banking' | 'corporate' | 'recruitment' | 'service';

export interface IndustryTemplate {
  type: IndustryType;
  displayName: string;
  entityLabel: string; // "Student" | "Customer" | "Employee" | "Candidate" | "Client"
  entityPluralLabel: string; // "Students" | "Customers" | "Employees" | "Candidates" | "Clients"
  idColumnHeader: string; // "Roll No" | "Customer ID" | "Employee ID" | "Candidate ID" | "Reference ID"
  statusColumnHeader: string; // "Attendance" | "Case Status" | "Department" | "Stage" | "Service Status"
  primaryCampaignName: string;
  sampleGroups: string[]; // ["CSE-A", "CSE-B", "ECE-A"] or ["Loan Collections", "Credit Cards"] etc.
}

export interface Organization {
  id: string;
  name: string;
  type: IndustryType;
  code: string;
}

export interface Period {
  id: string;
  organizationId: string;
  year: string; // e.g. "2026", "2027", "FY26-27"
  semesterOrPeriod: string; // e.g. "Semester 1", "Semester 2", "Q1", "Batch A"
  departmentOrClass: string; // e.g. "CSE-A", "Retail Banking", "Talent Acquisition"
  assignedCallerId?: string; // Caller/Teacher assigned to this period/class
  assignedCallerName?: string;
  isArchived: boolean;
  totalContacts: number;
  uploadedBy?: string;
  createdAt?: string;
}

export interface Contact {
  id: string;
  organizationId: string;
  periodId: string;
  externalId: string; // Roll No or Customer ID or Employee ID or Candidate ID
  name: string;
  phone: string;
  email?: string;
  department?: string;
  category?: string;
  // Specific fields for education / general attendance:
  weeklyAttendance?: number; // e.g. 65 (%)
  monthlyAttendance?: number; // e.g. 70 (%)
  overallAttendance?: number; // e.g. 68 (%)
  // Generic / Non-education status:
  status?: string; // 'absent' | 'present' | 'Overdue EMI' | 'Interview Round 2' | 'Pending Verification'
  statusNote?: string;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  customFields?: Record<string, string | number>;
  notes?: string;
  createdAt: string;
}

export type CallOutcome =
  | 'answered'
  | 'no_answer'
  | 'busy'
  | 'switched_off'
  | 'callback_required'
  | 'wrong_number'
  | 'not_required'
  | 'completed'
  | 'failed';

export interface CallReport {
  id: string;
  sessionId?: string;
  contactId: string;
  contactName?: string;
  contactPhone?: string;
  externalId?: string;
  callerId: string;
  callerName: string;
  campaignName?: string;
  durationSeconds: number;
  outcome: CallOutcome;
  reason: string; // e.g. "Fever", "Family Function", "Will attend tomorrow", "Illness"
  followUpRequired: boolean;
  followUpDate?: string;
  followUpTime?: string;
  followUpNotes?: string;
  timestamp: string;
  voiceTranscribed?: string;
}

export interface RetryAttempt {
  attemptNumber: number;
  outcome: CallOutcome;
  timestamp: string;
  reason?: string;
}

export interface RetryItem {
  id: string;
  contactId: string;
  contactName: string;
  contactPhone: string;
  externalId: string;
  department?: string;
  campaignId?: string;
  reason: string;
  outcome: CallOutcome;
  retryCount: number;
  maxRetries: number;
  attempts: RetryAttempt[];
  status: 'not_answered' | 'retrying' | 'completed' | 'scheduled';
  scheduledTime?: string;
  timestamp: string;
}

export interface FollowUpItem {
  id: string;
  contactId: string;
  contactName: string;
  contactPhone: string;
  externalId?: string;
  dueDate: string;
  dueTime: string;
  reason: string;
  notes: string;
  assignedCallerId: string;
  assignedCallerName?: string;
  status: 'pending' | 'completed';
}

export interface Campaign {
  id: string;
  organizationId: string;
  periodId: string;
  name: string; // e.g. "Attendance Follow-up", "Fee Reminder", "Interview Confirmation"
  description: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'active' | 'paused' | 'completed';
  assignedCallerId?: string;
  targetCount: number;
  completedCount: number;
}

export type CallingWorkflowState =
  | 'idle'
  | 'contacts_selected'
  | 'ready_to_call'
  | 'calling'
  | 'call_ended'
  | 'report_review'
  | 'report_confirmed'
  | 'next_contact'
  | 'paused'
  | 'completed';

export interface CallingSession {
  id: string;
  organizationId: string;
  periodId: string;
  campaignId: string;
  campaignName: string;
  callerId: string;
  callerName: string;
  selectedContactIds: string[];
  currentIndex: number;
  state: CallingWorkflowState;
  completedCount: number;
  retryCount: number;
  startedAt: string;
  updatedAt: string;
}

export interface AuditLog {
  id: string;
  organizationId: string;
  actorName: string;
  action: string;
  details: string;
  timestamp: string;
}

export interface LeaveRecord {
  id: string;
  contactId: string;
  contactName?: string;
  periodId?: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: 'APPROVED' | 'PENDING' | 'REJECTED';
  requestedBy?: string;
  approvedBy?: string;
  createdAt: string;
}

export type ScreenType =
  | 'splash'
  | 'login'
  | 'signup'
  | 'dashboard'
  | 'data_management'
  | 'upload_data'
  | 'data_preview'
  | 'select_period'
  | 'student_list'
  | 'ready_to_call'
  | 'calling'
  | 'post_call_report'
  | 'next_call'
  | 'reports'
  | 'retry_queue';
