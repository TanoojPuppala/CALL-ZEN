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
    sampleGroups: ['CSE-A', 'CSE-B', 'ECE-A', 'MECH-C']
  },
  banking: {
    type: 'banking',
    displayName: 'Banking & Financial Services',
    entityLabel: 'Customer',
    entityPluralLabel: 'Customers',
    idColumnHeader: 'Customer ID',
    statusColumnHeader: 'EMI / Case Status',
    primaryCampaignName: 'EMI & Overdue Collection',
    sampleGroups: ['Personal Loans', 'Auto Loans', 'Credit Cards', 'Priority Banking']
  },
  recruitment: {
    type: 'recruitment',
    displayName: 'HR & Recruitment Teams',
    entityLabel: 'Candidate',
    entityPluralLabel: 'Applicants',
    idColumnHeader: 'Candidate ID',
    statusColumnHeader: 'Interview Stage',
    primaryCampaignName: 'Interview Confirmation',
    sampleGroups: ['Engineering Roles', 'Sales Hiring', 'Executive Search', 'Internships']
  },
  corporate: {
    type: 'corporate',
    displayName: 'Corporate & Company Teams',
    entityLabel: 'Employee',
    entityPluralLabel: 'Employees',
    idColumnHeader: 'Employee ID',
    statusColumnHeader: 'Department / Status',
    primaryCampaignName: 'Townhall & Policy Check-in',
    sampleGroups: ['Operations', 'Engineering', 'Customer Support', 'Supply Chain']
  },
  service: {
    type: 'service',
    displayName: 'Post Office & Customer Service',
    entityLabel: 'Client',
    entityPluralLabel: 'Clients',
    idColumnHeader: 'Reference ID',
    statusColumnHeader: 'Service Ticket Status',
    primaryCampaignName: 'Delivery & Resolution Confirmation',
    sampleGroups: ['Speed Post', 'Parcel Delivery', 'Appt Reminders', 'Field Service']
  }
};

export const SEED_ORGANIZATIONS: Organization[] = [
  {
    id: 'org-1',
    name: 'Apex Institute of Engineering & Tech',
    type: 'education',
    code: 'AIET-EDU'
  },
  {
    id: 'org-2',
    name: 'Metro Financial Services & Collections',
    type: 'banking',
    code: 'MFS-CORP'
  },
  {
    id: 'org-3',
    name: 'TalentPeak HR & Staffing Global',
    type: 'recruitment',
    code: 'TP-HR'
  }
];

export const SEED_USERS: User[] = [
  {
    id: 'user-1',
    name: 'Mr. Srinivas Rao',
    email: 'srinivas@apex.edu',
    role: 'org_admin',
    roleTitle: 'Organization Admin',
    avatar: 'SR',
    organizationId: 'org-1',
    assignedPeriods: ['period-1', 'period-3']
  },
  {
    id: 'user-2',
    name: 'Mr. Kumar',
    email: 'kumar@apex.edu',
    role: 'caller',
    roleTitle: 'Class In-Charge & Teacher',
    avatar: 'MK',
    organizationId: 'org-1',
    assignedPeriods: ['period-1']
  },
  {
    id: 'user-3',
    name: 'Dr. Ananya Sharma',
    email: 'ananya@apex.edu',
    role: 'caller',
    roleTitle: 'Assistant Professor / Caller',
    avatar: 'AS',
    organizationId: 'org-1',
    assignedPeriods: ['period-2']
  },
  {
    id: 'user-4',
    name: 'Sarah Jenkins',
    email: 'sarah.j@talentpeak.com',
    role: 'caller',
    roleTitle: 'Senior Recruitment Specialist',
    avatar: 'SJ',
    organizationId: 'org-3',
    assignedPeriods: ['period-hr-1']
  }
];

export const SEED_PERIODS: Period[] = [
  {
    id: 'period-1',
    organizationId: 'org-1',
    year: '2026–27',
    semesterOrPeriod: 'Semester 1',
    departmentOrClass: 'CSE-A',
    assignedCallerId: 'user-2',
    assignedCallerName: 'Mr. Kumar',
    isArchived: false,
    totalContacts: 70,
    uploadedBy: 'Mr. Srinivas Rao',
    createdAt: '2026-08-01'
  },
  {
    id: 'period-2',
    organizationId: 'org-1',
    year: '2026–27',
    semesterOrPeriod: 'Semester 2',
    departmentOrClass: 'CSE-A',
    assignedCallerId: 'user-3',
    assignedCallerName: 'Dr. Ananya Sharma',
    isArchived: false,
    totalContacts: 70,
    uploadedBy: 'Mr. Srinivas Rao',
    createdAt: '2026-09-01'
  },
  {
    id: 'period-3',
    organizationId: 'org-1',
    year: '2025–26',
    semesterOrPeriod: 'Semester 2',
    departmentOrClass: 'CSE-A',
    assignedCallerId: 'user-1',
    assignedCallerName: 'Mr. Srinivas Rao',
    isArchived: true,
    totalContacts: 68,
    uploadedBy: 'Mr. Srinivas Rao',
    createdAt: '2025-09-10'
  },
  {
    id: 'period-bank-1',
    organizationId: 'org-2',
    year: 'FY 2026–27',
    semesterOrPeriod: 'Q3 Batch',
    departmentOrClass: 'Retail Loan Recovery',
    assignedCallerId: 'user-1',
    assignedCallerName: 'Mr. Srinivas Rao',
    isArchived: false,
    totalContacts: 25,
    uploadedBy: 'System Admin',
    createdAt: '2026-09-15'
  }
];

export const SEED_CAMPAIGNS: Campaign[] = [
  {
    id: 'camp-1',
    organizationId: 'org-1',
    periodId: 'period-1',
    name: 'Attendance Follow-up',
    description: 'Call parents of students with <75% attendance',
    priority: 'high',
    status: 'active',
    assignedCallerId: 'user-2',
    targetCount: 20,
    completedCount: 15
  },
  {
    id: 'camp-2',
    organizationId: 'org-1',
    periodId: 'period-1',
    name: 'Fee Reminder Campaign',
    description: 'Term 1 tuition payment deadline reminders',
    priority: 'medium',
    status: 'active',
    assignedCallerId: 'user-2',
    targetCount: 30,
    completedCount: 22
  },
  {
    id: 'camp-3',
    organizationId: 'org-3',
    periodId: 'period-hr-1',
    name: 'Interview Confirmation',
    description: 'Confirm interview schedules for Monday technical rounds',
    priority: 'urgent',
    status: 'active',
    assignedCallerId: 'user-4',
    targetCount: 100,
    completedCount: 91
  }
];

// 70 Education Students with 3 Rahuls (Section 35 Disambiguation demonstration)
const studentRoster = [
  { name: 'Rahul Kumar', isAbsent: true, note: 'Frequently absent on Mondays' },
  { name: 'Priya Sharma', isAbsent: true, note: 'Late by bus often' },
  { name: 'Ahmed Khan', isAbsent: true, note: 'Attending hackathon' },
  { name: 'Sneha Reddy', isAbsent: true, note: 'Sick leave requested' },
  { name: 'Karthik Raja', isAbsent: true, note: 'Medical certificate pending' },
  { name: 'Divya Varma', isAbsent: true, note: 'Family function' },
  { name: 'Mohan Das', isAbsent: true, note: 'Hostel warden reported unwell' },
  { name: 'Anjali Gupta', isAbsent: true, note: 'Out of station' },
  { name: 'Rohan Verma', isAbsent: true, note: 'Sports practice conflict' },
  { name: 'Neha Joshi', isAbsent: true, note: 'Under observation' },
  { name: 'Suresh Babu', isAbsent: true, note: 'Travel delay' },
  { name: 'Latha Sri', isAbsent: true, note: 'Fever' },
  { name: 'Vivek Menon', isAbsent: true, note: 'Personal emergency' },
  { name: 'Pooja Hegde', isAbsent: true, note: 'Missed morning attendance' },
  { name: 'Rahul Sharma', isAbsent: true, note: 'Second Rahul in CSE-A' },
  { name: 'Swathi Krishna', isAbsent: true, note: 'Parent notified' },
  { name: 'Sai Charan', isAbsent: true, note: 'Exam registration issue' },
  { name: 'Harish Nair', isAbsent: true, note: 'Doctor appointment' },
  { name: 'Kavya Pillai', isAbsent: true, note: 'Viral fever' },
  { name: 'Rajesh Iyer', isAbsent: true, note: 'Out of town' },
  { name: 'Akash Deep', isAbsent: false },
  { name: 'Bhavana Patel', isAbsent: false },
  { name: 'Chaitanya Rao', isAbsent: false },
  { name: 'Deepak V', isAbsent: false },
  { name: 'Esha Deol', isAbsent: false },
  { name: 'Feroz Shah', isAbsent: false },
  { name: 'Gautam Gambhir', isAbsent: false },
  { name: 'Rahul Reddy', isAbsent: false, note: 'Third Rahul in CSE-A' },
  { name: 'Ishaan Khatter', isAbsent: false },
  { name: 'Janaki Devi', isAbsent: false },
  { name: 'Kiran Kumar', isAbsent: false },
  { name: 'Lakshmi Narayana', isAbsent: false },
  { name: 'Madhavan R', isAbsent: false },
  { name: 'Naveen Polishetty', isAbsent: false },
  { name: 'Omkar Nath', isAbsent: false },
  { name: 'Pranavi S', isAbsent: false },
  { name: 'Qasim Ali', isAbsent: false },
  { name: 'Rashmika M', isAbsent: false },
  { name: 'Siddharth Roy', isAbsent: false },
  { name: 'Tanvi Shah', isAbsent: false },
  { name: 'Uday Kiran', isAbsent: false },
  { name: 'Varun Dhawan', isAbsent: false },
  { name: 'Wasim Akram', isAbsent: false },
  { name: 'Xavier Paul', isAbsent: false },
  { name: 'Yamini Reddy', isAbsent: false },
  { name: 'Zoya Akhtar', isAbsent: false },
  { name: 'Aditi Rao', isAbsent: false },
  { name: 'Bharat Ratna', isAbsent: false },
  { name: 'Chandana S', isAbsent: false },
  { name: 'Dhanush K', isAbsent: false },
  { name: 'Ekta Kapoor', isAbsent: false },
  { name: 'Farhan Akhtar', isAbsent: false },
  { name: 'Gauri Khan', isAbsent: false },
  { name: 'Hardik Pandya', isAbsent: false },
  { name: 'Indira V', isAbsent: false },
  { name: 'Jitendra K', isAbsent: false },
  { name: 'Kunal Khemu', isAbsent: false },
  { name: 'Lavanya T', isAbsent: false },
  { name: 'Meera Jasmine', isAbsent: false },
  { name: 'Nikhil Chinapa', isAbsent: false },
  { name: 'Oviya Helen', isAbsent: false },
  { name: 'Prithviraj S', isAbsent: false },
  { name: 'Radhika Apte', isAbsent: false },
  { name: 'Sharwanand M', isAbsent: false },
  { name: 'Trisha Krishnan', isAbsent: false },
  { name: 'Upendra Rao', isAbsent: false },
  { name: 'Vignesh Shivan', isAbsent: false },
  { name: 'Wamiqa Gabbi', isAbsent: false },
  { name: 'Yash Gowda', isAbsent: false },
  { name: 'Zubeen Garg', isAbsent: false }
];

export const SEED_CONTACTS: Contact[] = studentRoster.map((item, index) => {
  const rollNo = (index + 1).toString().padStart(2, '0');
  const isAbsent = item.isAbsent;
  const weekly = isAbsent ? Math.floor(40 + (index % 5) * 6) : Math.floor(82 + (index % 4) * 4);
  const monthly = isAbsent ? Math.floor(45 + (index % 6) * 5) : Math.floor(84 + (index % 3) * 5);
  const overall = isAbsent ? Math.floor(52 + (index % 5) * 4) : Math.floor(86 + (index % 4) * 3);

  return {
    id: `contact-${index + 1}`,
    organizationId: 'org-1',
    periodId: 'period-1',
    externalId: rollNo,
    name: item.name,
    phone: `+91 9876543${(210 + index).toString().padStart(3, '0')}`,
    department: 'CSE-A',
    category: isAbsent ? 'Defaulter (<75%)' : 'Regular',
    weeklyAttendance: weekly,
    monthlyAttendance: monthly,
    overallAttendance: overall,
    status: isAbsent ? 'absent' : 'present',
    statusNote: item.note || (isAbsent ? 'Needs calling' : 'Present'),
    priority: isAbsent ? 'high' : 'low',
    notes: item.note || '',
    createdAt: '2026-08-01'
  };
});

// Banking seed contacts for industry demonstrations
export const BANKING_SEED_CONTACTS: Contact[] = [
  {
    id: 'bank-c-1',
    organizationId: 'org-2',
    periodId: 'period-bank-1',
    externalId: 'CUST-8801',
    name: 'Rahul Kumar',
    phone: '+91 9876543210',
    department: 'Auto Loan',
    category: 'EMI Overdue',
    status: 'Overdue 15 Days',
    statusNote: 'EMI Amount: ₹14,500 due',
    priority: 'urgent',
    customFields: { amountDue: 14500, daysPastDue: 15 },
    createdAt: '2026-09-01'
  },
  {
    id: 'bank-c-2',
    organizationId: 'org-2',
    periodId: 'period-bank-1',
    externalId: 'CUST-8802',
    name: 'Priya Sharma',
    phone: '+91 9876543211',
    department: 'Personal Loan',
    category: 'EMI Overdue',
    status: 'Overdue 30 Days',
    statusNote: 'EMI Amount: ₹8,200 due',
    priority: 'high',
    customFields: { amountDue: 8200, daysPastDue: 30 },
    createdAt: '2026-09-01'
  },
  {
    id: 'bank-c-3',
    organizationId: 'org-2',
    periodId: 'period-bank-1',
    externalId: 'CUST-8803',
    name: 'Ahmed Khan',
    phone: '+91 9876543212',
    department: 'Credit Card',
    category: 'Minimum Due',
    status: 'Payment Pending',
    statusNote: 'Min Due: ₹4,800',
    priority: 'medium',
    customFields: { amountDue: 4800, daysPastDue: 5 },
    createdAt: '2026-09-01'
  }
];

// 5 Contacts for Re-Attend Queue with attempt tracking (Sections 28 & 29)
export const SEED_RETRY_ITEMS: RetryItem[] = [
  {
    id: 'retry-1',
    contactId: 'contact-5',
    contactName: 'Karthik Raja',
    contactPhone: '+91 9876543214',
    externalId: '05',
    department: 'CSE-A',
    campaignId: 'camp-1',
    reason: 'Not Picked',
    outcome: 'no_answer',
    retryCount: 1,
    maxRetries: 3,
    attempts: [
      { attemptNumber: 1, outcome: 'no_answer', timestamp: '2026-09-19T09:15:00Z', reason: 'Ringing not answered' }
    ],
    status: 'not_answered',
    timestamp: '2026-09-19T09:15:00Z'
  },
  {
    id: 'retry-2',
    contactId: 'contact-9',
    contactName: 'Rohan Verma',
    contactPhone: '+91 9876543218',
    externalId: '09',
    department: 'CSE-A',
    campaignId: 'camp-1',
    reason: 'Line Busy',
    outcome: 'busy',
    retryCount: 1,
    maxRetries: 3,
    attempts: [
      { attemptNumber: 1, outcome: 'busy', timestamp: '2026-09-19T09:20:00Z', reason: 'Line engaged' }
    ],
    status: 'not_answered',
    timestamp: '2026-09-19T09:20:00Z'
  },
  {
    id: 'retry-3',
    contactId: 'contact-11',
    contactName: 'Suresh Babu',
    contactPhone: '+91 9876543220',
    externalId: '11',
    department: 'CSE-A',
    campaignId: 'camp-1',
    reason: 'Switched Off',
    outcome: 'switched_off',
    retryCount: 2,
    maxRetries: 3,
    attempts: [
      { attemptNumber: 1, outcome: 'switched_off', timestamp: '2026-09-19T08:30:00Z', reason: 'Unreachable' },
      { attemptNumber: 2, outcome: 'switched_off', timestamp: '2026-09-19T10:00:00Z', reason: 'Device powered off' }
    ],
    status: 'not_answered',
    timestamp: '2026-09-19T10:00:00Z'
  },
  {
    id: 'retry-4',
    contactId: 'contact-12',
    contactName: 'Latha Sri',
    contactPhone: '+91 9876543221',
    externalId: '12',
    department: 'CSE-A',
    campaignId: 'camp-1',
    reason: 'No Answer',
    outcome: 'no_answer',
    retryCount: 1,
    maxRetries: 3,
    attempts: [
      { attemptNumber: 1, outcome: 'no_answer', timestamp: '2026-09-19T09:35:00Z', reason: 'Not picked up' }
    ],
    status: 'not_answered',
    timestamp: '2026-09-19T09:35:00Z'
  },
  {
    id: 'retry-5',
    contactId: 'contact-13',
    contactName: 'Vivek Menon',
    contactPhone: '+91 9876543222',
    externalId: '13',
    department: 'CSE-A',
    campaignId: 'camp-1',
    reason: 'Line Busy',
    outcome: 'busy',
    retryCount: 1,
    maxRetries: 3,
    attempts: [
      { attemptNumber: 1, outcome: 'busy', timestamp: '2026-09-19T09:42:00Z', reason: 'Engaged tone' }
    ],
    status: 'not_answered',
    timestamp: '2026-09-19T09:42:00Z'
  }
];

export const SEED_CALL_REPORTS: CallReport[] = [
  {
    id: 'report-1',
    contactId: 'contact-1',
    contactName: 'Rahul Kumar',
    contactPhone: '+91 9876543210',
    externalId: '01',
    callerId: 'user-2',
    callerName: 'Mr. Kumar',
    campaignName: 'Attendance Follow-up',
    durationSeconds: 135,
    outcome: 'answered',
    reason: 'Fever',
    followUpRequired: false,
    timestamp: '2026-09-19T09:05:00Z',
    voiceTranscribed: 'Rahul said he has fever.'
  },
  {
    id: 'report-2',
    contactId: 'contact-2',
    contactName: 'Priya Sharma',
    contactPhone: '+91 9876543211',
    externalId: '02',
    callerId: 'user-2',
    callerName: 'Mr. Kumar',
    campaignName: 'Attendance Follow-up',
    durationSeconds: 85,
    outcome: 'answered',
    reason: 'Family Function',
    followUpRequired: true,
    followUpDate: '2026-09-20',
    followUpTime: '10:00 AM',
    followUpNotes: 'Returning tomorrow morning.',
    timestamp: '2026-09-19T09:12:00Z',
    voiceTranscribed: 'She is attending tomorrow because of cousin wedding today.'
  },
  {
    id: 'report-3',
    contactId: 'contact-3',
    contactName: 'Ahmed Khan',
    contactPhone: '+91 9876543212',
    externalId: '03',
    callerId: 'user-2',
    callerName: 'Mr. Kumar',
    campaignName: 'Attendance Follow-up',
    durationSeconds: 110,
    outcome: 'answered',
    reason: 'Hackathon Participation',
    followUpRequired: false,
    timestamp: '2026-09-19T09:18:00Z',
    voiceTranscribed: 'Representing college in regional smart hackathon.'
  },
  {
    id: 'report-4',
    contactId: 'contact-4',
    contactName: 'Sneha Reddy',
    contactPhone: '+91 9876543213',
    externalId: '04',
    callerId: 'user-2',
    callerName: 'Mr. Kumar',
    campaignName: 'Attendance Follow-up',
    durationSeconds: 95,
    outcome: 'answered',
    reason: 'Doctor Checkup',
    followUpRequired: false,
    timestamp: '2026-09-19T09:25:00Z',
    voiceTranscribed: 'Dental appointment, will submit slip.'
  }
];

export const SEED_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'log-1',
    organizationId: 'org-1',
    actorName: 'Mr. Srinivas Rao (Admin)',
    action: 'DATA_UPLOAD',
    details: 'Uploaded 70 student records for 2026–27 Semester 1 (CSE-A)',
    timestamp: '2026-09-19T08:00:00Z'
  },
  {
    id: 'log-2',
    organizationId: 'org-1',
    actorName: 'Mr. Srinivas Rao (Admin)',
    action: 'CAMPAIGN_ASSIGNMENT',
    details: 'Assigned Attendance Follow-up campaign to Mr. Kumar',
    timestamp: '2026-09-19T08:15:00Z'
  },
  {
    id: 'log-3',
    organizationId: 'org-1',
    actorName: 'Mr. Kumar (Caller)',
    action: 'CALLING_STARTED',
    details: 'Started calling session with 20 selected absent contacts',
    timestamp: '2026-09-19T09:00:00Z'
  },
  {
    id: 'log-4',
    organizationId: 'org-1',
    actorName: 'Mr. Kumar (Caller)',
    action: 'CALL_REPORT_CONFIRMED',
    details: 'Recorded call for Rahul Kumar: Answered (Reason: Fever)',
    timestamp: '2026-09-19T09:05:00Z'
  },
  {
    id: 'log-5',
    organizationId: 'org-1',
    actorName: 'Mr. Kumar (Caller)',
    action: 'RETRY_QUEUED',
    details: 'Moved Karthik Raja to Retry Queue (Status: No Answer)',
    timestamp: '2026-09-19T09:15:00Z'
  }
];
