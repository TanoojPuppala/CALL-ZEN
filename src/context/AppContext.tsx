import React, { createContext, useContext, useState } from 'react';
import {
  User,
  Organization,
  Period,
  Contact,
  Campaign,
  CallingSession,
  CallOutcome,
  CallReport,
  RetryItem,
  FollowUpItem,
  AuditLog,
  ScreenType,
  IndustryType,
  IndustryTemplate,
  RoleMode
} from '../types';
import {
  INDUSTRY_TEMPLATES,
  SEED_ORGANIZATIONS,
  SEED_USERS,
  SEED_PERIODS,
  SEED_CAMPAIGNS,
  SEED_CONTACTS,
  BANKING_SEED_CONTACTS,
  SEED_RETRY_ITEMS,
  SEED_CALL_REPORTS,
  SEED_AUDIT_LOGS
} from '../data/seedData';
import {
  isSupabaseConfigured,
  fetchContactsFromSupabase,
  syncContactsToSupabase,
  deleteContactFromSupabase,
  saveCallLogToSupabase,
  saveAuditLogToSupabase,
  fetchPeriodsFromSupabase,
  fetchCallLogsFromSupabase
} from '../services/supabase';
import confetti from 'canvas-confetti';

interface AnalyticsSummary {
  totalContacts: number;
  assignedToday: number;
  completedToday: number;
  pendingToday: number;
  completionRate: number;
  retryCount: number;
  followUpsCount: number;
  orgCompletionRate: number;
  employeeCompletionRate: number;
  campaignsBreakdown: Array<{ name: string; rate: number; total: number; completed: number }>;
}

interface AppContextType {
  // Navigation
  currentScreen: ScreenType;
  setCurrentScreen: (screen: ScreenType) => void;
  previousScreen: ScreenType;
  isDesktopView: boolean;
  setIsDesktopView: (val: boolean) => void;

  // Industry Template & Customization (PRD Sections 1, 51, 52)
  currentIndustry: IndustryType;
  currentTemplate: IndustryTemplate;
  setIndustry: (industry: IndustryType) => void;

  // Dual Role Mode (PRD Sections 6, 78, 79)
  roleMode: RoleMode;
  setRoleMode: (mode: RoleMode) => void;

  // Auth & Org
  currentUser: User | null;
  currentOrg: Organization;
  organizations: Organization[];
  setCurrentOrg: (org: Organization) => void;
  periods: Period[];
  currentPeriod: Period;
  setCurrentPeriod: (period: Period) => void;
  archivePeriod: (periodId: string) => void;
  restorePeriod: (periodId: string) => void;
  reassignInCharge: (periodId: string, newCallerId: string, newCallerName: string) => void;
  login: (role?: string) => void;
  logout: () => void;

  // Contacts & Dynamic Selection (PRD Sections 16, 17, 18)
  contacts: Contact[];
  selectedContactIds: string[];
  toggleSelectContact: (id: string) => void;
  selectAbsentOnly: () => void;
  selectAllContacts: () => void;
  clearContactSelection: () => void;
  addContacts: (newContacts: Contact[]) => void;
  updateContact: (updated: Contact) => void;
  deleteContact: (id: string) => void;

  // Campaigns
  campaigns: Campaign[];

  // Calling Session & State Machine (PRD Sections 19, 20, 21, 30, 31)
  callingSession: CallingSession | null;
  activeCallingContact: Contact | null;
  startCallingWorkflow: () => void;
  startRetryWorkflow: () => void;
  endActiveCall: (durationSeconds: number, outcomeHint?: CallOutcome) => void;
  currentPendingReport: Partial<CallReport> | null;
  setCurrentPendingReport: (report: Partial<CallReport> | null) => void;
  confirmPostCallReport: (report: Partial<CallReport>) => void;
  startNextQueuedCall: () => void;
  skipCurrentQueuedCall: () => void;
  pauseCallingWorkflow: () => void;
  resumeCallingWorkflow: () => void;
  cancelCallingWorkflow: () => void;

  // Retry Engine & Re-Attend Queue (PRD Sections 27, 28, 29, 63, 64, 65)
  retryQueue: RetryItem[];
  retrySingleContact: (item: RetryItem) => void;
  scheduleRetryItem: (id: string, time: string) => void;

  // Follow-ups & Call Reports (PRD Sections 23-26, 66)
  callReports: CallReport[];
  followUps: FollowUpItem[];
  auditLogs: AuditLog[];
  logAuditEvent: (action: string, details: string) => void;

  // Analytics Engine & Export (PRD Sections 39-45, 80)
  getAnalyticsSummary: () => AnalyticsSummary;
  exportReport: (format: 'csv' | 'excel' | 'pdf', timeframe: string) => void;

  // Uploaded Data Preview (PRD Section 12)
  uploadedPreviewData: Contact[];
  setUploadedPreviewData: (contacts: Contact[]) => void;

  // Feedback Toast & Voice Modal
  toastMessage: string | null;
  showToast: (msg: string) => void;
  isVoiceAssistantOpen: boolean;
  setIsVoiceAssistantOpen: (val: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation State
  const [currentScreen, setCurrentScreenInternal] = useState<ScreenType>('splash');
  const [previousScreen, setPreviousScreen] = useState<ScreenType>('dashboard');
  const [isDesktopView, setIsDesktopView] = useState<boolean>(false);

  // Uploaded Data for Preview & Validation
  const [uploadedPreviewData, setUploadedPreviewData] = useState<Contact[]>([]);

  // Industry Template & Dual Role Mode
  const [currentIndustry, setCurrentIndustry] = useState<IndustryType>('education');
  const [roleMode, setRoleMode] = useState<RoleMode>('admin');

  // Core Entity State
  const [organizations] = useState<Organization[]>(SEED_ORGANIZATIONS);
  const [currentOrg, setCurrentOrg] = useState<Organization>(SEED_ORGANIZATIONS[0]);
  const [currentUser, setCurrentUser] = useState<User | null>(SEED_USERS[0]);
  const [periods, setPeriods] = useState<Period[]>(SEED_PERIODS);
  const [currentPeriod, setCurrentPeriod] = useState<Period>(SEED_PERIODS[0]);
  const [contacts, setContacts] = useState<Contact[]>(SEED_CONTACTS);
  const [campaigns] = useState<Campaign[]>(SEED_CAMPAIGNS);

  // Selection & Calling Session State
  const [selectedContactIds, setSelectedContactIds] = useState<string[]>([]);
  const [callingSession, setCallingSession] = useState<CallingSession | null>(null);
  const [currentPendingReport, setCurrentPendingReport] = useState<Partial<CallReport> | null>(null);

  // Retry, Reports, Follow-ups, Audit
  const [retryQueue, setRetryQueue] = useState<RetryItem[]>(SEED_RETRY_ITEMS);
  const [callReports, setCallReports] = useState<CallReport[]>(SEED_CALL_REPORTS);
  const [followUps, setFollowUps] = useState<FollowUpItem[]>([
    {
      id: 'fu-1',
      contactId: 'contact-2',
      contactName: 'Priya Sharma',
      contactPhone: '+91 9876543211',
      externalId: '02',
      dueDate: '2026-09-20',
      dueTime: '10:00 AM',
      reason: 'Family Function',
      notes: 'Returning tomorrow morning, check attendance.',
      assignedCallerId: 'user-2',
      assignedCallerName: 'Mr. Kumar',
      status: 'pending'
    }
  ]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(SEED_AUDIT_LOGS);

  // Toast & Modals
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isVoiceAssistantOpen, setIsVoiceAssistantOpen] = useState<boolean>(false);

  // Load Supabase records if configured
  React.useEffect(() => {
    if (isSupabaseConfigured) {
      (async () => {
        const fetchedContacts = await fetchContactsFromSupabase();
        if (fetchedContacts && fetchedContacts.length > 0) {
          setContacts(fetchedContacts);
        }
        const fetchedPeriods = await fetchPeriodsFromSupabase();
        if (fetchedPeriods && fetchedPeriods.length > 0) {
          setPeriods(fetchedPeriods);
        }
        const fetchedCallLogs = await fetchCallLogsFromSupabase();
        if (fetchedCallLogs && fetchedCallLogs.length > 0) {
          setCallReports(fetchedCallLogs);
        }
      })();
    }
  }, []);

  const currentTemplate = INDUSTRY_TEMPLATES[currentIndustry] || INDUSTRY_TEMPLATES.education;

  const setCurrentScreen = (screen: ScreenType) => {
    setPreviousScreen(currentScreen);
    setCurrentScreenInternal(screen);
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  const logAuditEvent = (action: string, details: string) => {
    const actorName = currentUser ? currentUser.name : 'System Admin';
    const actorRole = currentUser ? currentUser.role : 'org_admin';
    const newLog: AuditLog = {
      id: `log-${Date.now()}`,
      organizationId: currentOrg.id,
      actorName,
      action,
      details,
      timestamp: new Date().toISOString()
    };
    setAuditLogs(prev => [newLog, ...prev]);
    if (isSupabaseConfigured) {
      saveAuditLogToSupabase(actorName, actorRole, action, details);
    }
  };

  // Industry Template Switcher (Sections 51 & 52)
  const setIndustry = (industry: IndustryType) => {
    setCurrentIndustry(industry);
    if (industry === 'banking') {
      setContacts(BANKING_SEED_CONTACTS);
      const bankOrg = organizations.find(o => o.type === 'banking') || organizations[1];
      setCurrentOrg(bankOrg);
      const bankPeriod = periods.find(p => p.id === 'period-bank-1') || periods[0];
      setCurrentPeriod(bankPeriod);
      setSelectedContactIds([BANKING_SEED_CONTACTS[0].id, BANKING_SEED_CONTACTS[1].id]);
    } else {
      setContacts(SEED_CONTACTS);
      setCurrentOrg(organizations[0]);
      setCurrentPeriod(periods[0]);
      setSelectedContactIds([]);
    }
    logAuditEvent('INDUSTRY_SWITCHED', `Active industry template switched to: ${industry}`);
    showToast(`Switched template to ${INDUSTRY_TEMPLATES[industry].displayName}`);
  };

  // Auth (Section 5 & 6)
  const login = (roleOverride?: string) => {
    const user = SEED_USERS.find(u => (roleOverride ? u.role === roleOverride : true)) || SEED_USERS[0];
    setCurrentUser(user);
    if (user.role === 'caller') {
      setRoleMode('employee');
    } else {
      setRoleMode('admin');
    }
    logAuditEvent('LOGIN_SUCCESS', `Logged in as ${user.name} (${user.roleTitle})`);
    showToast(`Welcome back, ${user.name}`);
    setCurrentScreen('dashboard');
  };

  const logout = () => {
    logAuditEvent('LOGOUT', `User ${currentUser?.name || ''} logged out`);
    setCurrentUser(null);
    setCurrentScreen('login');
  };

  // Dataset Versioning & Period Management (Sections 13-15, 46-48)
  const archivePeriod = (periodId: string) => {
    setPeriods(prev =>
      prev.map(p => (p.id === periodId ? { ...p, isArchived: true } : p))
    );
    const p = periods.find(item => item.id === periodId);
    logAuditEvent('PERIOD_ARCHIVED', `Archived dataset: ${p?.departmentOrClass} (${p?.year} ${p?.semesterOrPeriod})`);
    showToast(`Dataset archived safely. Historical logs remain accessible.`);
  };

  const restorePeriod = (periodId: string) => {
    setPeriods(prev =>
      prev.map(p => (p.id === periodId ? { ...p, isArchived: false } : p))
    );
    const p = periods.find(item => item.id === periodId);
    logAuditEvent('PERIOD_RESTORED', `Restored dataset: ${p?.departmentOrClass}`);
    showToast(`Dataset restored to active.`);
  };

  const reassignInCharge = (periodId: string, newCallerId: string, newCallerName: string) => {
    setPeriods(prev =>
      prev.map(p =>
        p.id === periodId
          ? { ...p, assignedCallerId: newCallerId, assignedCallerName: newCallerName }
          : p
      )
    );
    logAuditEvent(
      'IN_CHARGE_REASSIGNED',
      `Reassigned period ${periodId} in-charge to ${newCallerName}. Historical records preserved.`
    );
    showToast(`Class in-charge successfully reassigned to ${newCallerName}`);
  };

  // Contacts Selection Methods (Sections 16, 17, 18)
  const toggleSelectContact = (id: string) => {
    setSelectedContactIds(prev => {
      if (prev.includes(id)) {
        return prev.filter(item => item !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const selectAbsentOnly = () => {
    const absentIds = contacts
      .filter(
        c =>
          c.periodId === currentPeriod.id &&
          ((c.overallAttendance && c.overallAttendance < 75) ||
            c.status === 'absent' ||
            c.priority === 'urgent' ||
            c.priority === 'high')
      )
      .map(c => c.id);
    setSelectedContactIds(absentIds);
    showToast(`Selected ${absentIds.length} contacts needing attention`);
  };

  const selectAllContacts = () => {
    const allIds = contacts.filter(c => c.periodId === currentPeriod.id).map(c => c.id);
    setSelectedContactIds(allIds);
    showToast(`Selected all ${allIds.length} contacts in ${currentPeriod.departmentOrClass}`);
  };

  const clearContactSelection = () => {
    setSelectedContactIds([]);
    showToast('Contact selection cleared');
  };

  const addContacts = (newContacts: Contact[]) => {
    setContacts(prev => [...newContacts, ...prev]);
    if (isSupabaseConfigured) {
      syncContactsToSupabase(newContacts);
    }
    logAuditEvent('DATA_UPLOAD', `Imported ${newContacts.length} new records`);
    showToast(`Imported ${newContacts.length} contacts successfully`);
  };

  const updateContact = (updated: Contact) => {
    setContacts(prev => prev.map(c => (c.id === updated.id ? updated : c)));
    if (isSupabaseConfigured) {
      syncContactsToSupabase([updated]);
    }
    showToast(`Updated ${updated.name}`);
  };

  const deleteContact = (id: string) => {
    const contact = contacts.find(c => c.id === id);
    setContacts(prev => prev.filter(c => c.id !== id));
    setSelectedContactIds(prev => prev.filter(selectedId => selectedId !== id));
    if (isSupabaseConfigured) {
      deleteContactFromSupabase(id);
    }
    logAuditEvent('DATA_DELETE', `Deleted contact ${contact?.name || id}`);
    showToast(`Deleted contact`);
  };

  // Active contact in calling session
  const activeCallingContact = React.useMemo(() => {
    if (!callingSession || callingSession.selectedContactIds.length === 0) return null;
    const contactId = callingSession.selectedContactIds[callingSession.currentIndex];
    return contacts.find(c => c.id === contactId) || null;
  }, [callingSession, contacts]);

  // Calling State Machine Invariant:
  // Contacts selected -> Ready to Call -> Confirmation -> Start Calling!
  const startCallingWorkflow = () => {
    if (selectedContactIds.length === 0) {
      showToast('Please select at least one contact to call.');
      return;
    }

    const session: CallingSession = {
      id: `session-${Date.now()}`,
      organizationId: currentOrg.id,
      periodId: currentPeriod.id,
      campaignId: 'camp-1',
      campaignName: currentTemplate.primaryCampaignName,
      callerId: currentUser?.id || 'user-2',
      callerName: currentUser?.name || 'Mr. Kumar',
      selectedContactIds: [...selectedContactIds],
      currentIndex: 0,
      state: 'calling',
      completedCount: 0,
      retryCount: 0,
      startedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setCallingSession(session);
    logAuditEvent(
      'CALLING_STARTED',
      `Started calling session with ${session.selectedContactIds.length} selected contacts (Campaign: ${session.campaignName})`
    );
    setCurrentScreen('calling');
  };

  // Launch calling workflow on Retry Queue (Section 28)
  const startRetryWorkflow = () => {
    const retryContactIds = retryQueue.map(item => item.contactId);
    if (retryContactIds.length === 0) {
      showToast('Re-Attend Queue is currently empty! 🎉');
      return;
    }

    const session: CallingSession = {
      id: `retry-session-${Date.now()}`,
      organizationId: currentOrg.id,
      periodId: currentPeriod.id,
      campaignId: 'camp-retry',
      campaignName: 'Re-Attend Calls Queue',
      callerId: currentUser?.id || 'user-2',
      callerName: currentUser?.name || 'Mr. Kumar',
      selectedContactIds: retryContactIds,
      currentIndex: 0,
      state: 'calling',
      completedCount: 0,
      retryCount: 0,
      startedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setCallingSession(session);
    logAuditEvent('RETRY_SESSION_STARTED', `Started Re-Attend calling for ${retryContactIds.length} unanswered contacts`);
    showToast(`Starting Re-Attend calling for ${retryContactIds.length} contacts`);
    setCurrentScreen('calling');
  };

  // End active call and prepare AI suggested report (Sections 21-24)
  const endActiveCall = (durationSeconds: number, outcomeHint?: CallOutcome) => {
    if (!callingSession || !activeCallingContact) return;

    const outcome = outcomeHint || (durationSeconds > 5 ? 'answered' : 'no_answer');
    let reason = 'General Update';
    let followUpRequired = false;

    if (outcome === 'answered') {
      const reasons = ['Fever', 'Family Function', 'Out of Station', 'Medical Checkup', 'Bus delay'];
      reason = reasons[callingSession.currentIndex % reasons.length];
      followUpRequired = reason === 'Family Function';
    } else if (outcome === 'no_answer') {
      reason = 'Not Picked';
      followUpRequired = true;
    } else if (outcome === 'busy') {
      reason = 'Line Engaged';
      followUpRequired = true;
    } else if (outcome === 'switched_off') {
      reason = 'Device Switched Off';
      followUpRequired = true;
    } else if (outcome === 'wrong_number') {
      reason = 'Invalid Number';
      followUpRequired = false;
    }

    const suggestedReport: Partial<CallReport> = {
      id: `report-${Date.now()}`,
      sessionId: callingSession.id,
      contactId: activeCallingContact.id,
      contactName: activeCallingContact.name,
      contactPhone: activeCallingContact.phone,
      externalId: activeCallingContact.externalId,
      callerId: currentUser?.id || 'user-2',
      callerName: currentUser?.name || 'Mr. Kumar',
      campaignName: callingSession.campaignName,
      durationSeconds,
      outcome,
      reason,
      followUpRequired,
      followUpDate: followUpRequired ? new Date(Date.now() + 86400000).toISOString().split('T')[0] : undefined,
      followUpTime: followUpRequired ? '10:00 AM' : undefined,
      followUpNotes: followUpRequired ? 'Scheduled callback.' : undefined,
      timestamp: new Date().toISOString()
    };

    setCurrentPendingReport(suggestedReport);
    setCallingSession(prev => (prev ? { ...prev, state: 'call_ended', updatedAt: new Date().toISOString() } : null));
    setCurrentScreen('post_call_report');
  };

  // Confirm post-call report (Sections 25, 27, 59, 63)
  const confirmPostCallReport = (reportData: Partial<CallReport>) => {
    if (!callingSession || !activeCallingContact) return;

    const fullReport: CallReport = {
      id: reportData.id || `rep-${Date.now()}`,
      sessionId: callingSession.id,
      contactId: activeCallingContact.id,
      contactName: activeCallingContact.name,
      contactPhone: activeCallingContact.phone,
      externalId: activeCallingContact.externalId,
      callerId: currentUser?.id || 'user-2',
      callerName: currentUser?.name || 'Mr. Kumar',
      campaignName: callingSession.campaignName,
      durationSeconds: reportData.durationSeconds || 0,
      outcome: reportData.outcome || 'answered',
      reason: reportData.reason || 'General Note',
      followUpRequired: !!reportData.followUpRequired,
      followUpDate: reportData.followUpDate,
      followUpTime: reportData.followUpTime,
      followUpNotes: reportData.followUpNotes,
      timestamp: new Date().toISOString(),
      voiceTranscribed: reportData.voiceTranscribed
    };

    setCallReports(prev => [fullReport, ...prev]);
    if (isSupabaseConfigured) {
      saveCallLogToSupabase(fullReport);
    }

    // PRD INVARIANT: Unreachable contacts enter retry queue, NOT completed!
    const isUnreachable = ['no_answer', 'busy', 'switched_off', 'callback_required'].includes(fullReport.outcome);

    if (isUnreachable) {
      setRetryQueue(prev => {
        const existing = prev.find(r => r.contactId === activeCallingContact.id);
        const nextAttemptNum = existing ? existing.retryCount + 1 : 1;
        const newAttempt = {
          attemptNumber: nextAttemptNum,
          outcome: fullReport.outcome,
          timestamp: new Date().toISOString(),
          reason: fullReport.reason
        };

        const updatedItem: RetryItem = {
          id: existing ? existing.id : `retry-${Date.now()}`,
          contactId: activeCallingContact.id,
          contactName: activeCallingContact.name,
          contactPhone: activeCallingContact.phone,
          externalId: activeCallingContact.externalId,
          department: activeCallingContact.department,
          campaignId: callingSession.campaignId,
          reason: fullReport.reason,
          outcome: fullReport.outcome,
          retryCount: nextAttemptNum,
          maxRetries: 3,
          attempts: existing ? [newAttempt, ...existing.attempts] : [newAttempt],
          status: 'not_answered',
          timestamp: new Date().toISOString()
        };

        return [updatedItem, ...prev.filter(r => r.contactId !== activeCallingContact.id)];
      });
      showToast(`${activeCallingContact.name} moved to Re-Attend Retry Queue`);
    } else if (fullReport.outcome === 'answered') {
      // Remove from retry queue if was present
      setRetryQueue(prev => prev.filter(r => r.contactId !== activeCallingContact.id));
    }

    // Schedule follow-up if requested
    if (fullReport.followUpRequired && fullReport.followUpDate) {
      const newFollowUp: FollowUpItem = {
        id: `fu-${Date.now()}`,
        contactId: activeCallingContact.id,
        contactName: activeCallingContact.name,
        contactPhone: activeCallingContact.phone,
        externalId: activeCallingContact.externalId,
        dueDate: fullReport.followUpDate,
        dueTime: fullReport.followUpTime || '10:00 AM',
        reason: fullReport.reason,
        notes: fullReport.followUpNotes || '',
        assignedCallerId: currentUser?.id || 'user-2',
        assignedCallerName: currentUser?.name || 'Mr. Kumar',
        status: 'pending'
      };
      setFollowUps(prev => [newFollowUp, ...prev]);
    }

    logAuditEvent(
      'CALL_REPORT_CONFIRMED',
      `Confirmed report for ${activeCallingContact.name} (Status: ${fullReport.outcome}, Reason: ${fullReport.reason})`
    );

    // Update calling session counts
    const updatedCompleted = !isUnreachable ? callingSession.completedCount + 1 : callingSession.completedCount;
    const updatedRetry = isUnreachable ? callingSession.retryCount + 1 : callingSession.retryCount;
    const nextIndex = callingSession.currentIndex + 1;

    if (nextIndex < callingSession.selectedContactIds.length) {
      setCallingSession({
        ...callingSession,
        currentIndex: nextIndex,
        state: 'next_contact',
        completedCount: updatedCompleted,
        retryCount: updatedRetry,
        updatedAt: new Date().toISOString()
      });
      setCurrentScreen('next_call');
    } else {
      // Queue Finished!
      setCallingSession({
        ...callingSession,
        state: 'completed',
        completedCount: updatedCompleted,
        retryCount: updatedRetry,
        updatedAt: new Date().toISOString()
      });
      confetti({
        particleCount: 130,
        spread: 75,
        origin: { y: 0.6 }
      });
      showToast('Calling session completed!');
      setCurrentScreen('reports');
    }
  };

  const startNextQueuedCall = () => {
    if (!callingSession) return;
    setCallingSession(prev => (prev ? { ...prev, state: 'calling', updatedAt: new Date().toISOString() } : null));
    setCurrentScreen('calling');
  };

  const skipCurrentQueuedCall = () => {
    if (!callingSession) return;
    const nextIndex = callingSession.currentIndex + 1;
    if (nextIndex < callingSession.selectedContactIds.length) {
      setCallingSession({
        ...callingSession,
        currentIndex: nextIndex,
        state: 'next_contact',
        updatedAt: new Date().toISOString()
      });
      showToast('Skipped contact');
    } else {
      showToast('Queue complete');
      setCurrentScreen('reports');
    }
  };

  // Pause and Resume Invariant: Never lose position (Sections 30, 31, 68)
  const pauseCallingWorkflow = () => {
    if (!callingSession) return;
    setCallingSession({
      ...callingSession,
      state: 'paused',
      updatedAt: new Date().toISOString()
    });
    logAuditEvent(
      'CALLING_PAUSED',
      `Paused calling queue at position ${callingSession.currentIndex + 1} of ${callingSession.selectedContactIds.length}`
    );
    showToast(`Calling paused at contact ${callingSession.currentIndex + 1}. Progress saved.`);
    setCurrentScreen('dashboard');
  };

  const resumeCallingWorkflow = () => {
    if (!callingSession) {
      showToast('No active session to resume');
      return;
    }
    setCallingSession({
      ...callingSession,
      state: 'next_contact',
      updatedAt: new Date().toISOString()
    });
    logAuditEvent('CALLING_RESUMED', `Resumed calling queue from contact ${callingSession.currentIndex + 1}`);
    showToast(`Resumed calling from contact ${callingSession.currentIndex + 1}`);
    setCurrentScreen('next_call');
  };

  const cancelCallingWorkflow = () => {
    setCallingSession(null);
    showToast('Calling queue closed');
    setCurrentScreen('student_list');
  };

  // Retry Operations
  const retrySingleContact = (item: RetryItem) => {
    const contact = contacts.find(c => c.id === item.contactId);
    if (!contact) return;

    const retrySession: CallingSession = {
      id: `retry-single-${Date.now()}`,
      organizationId: currentOrg.id,
      periodId: currentPeriod.id,
      campaignId: 'camp-retry',
      campaignName: 'Single Retry Call',
      callerId: currentUser?.id || 'user-2',
      callerName: currentUser?.name || 'Mr. Kumar',
      selectedContactIds: [contact.id],
      currentIndex: 0,
      state: 'calling',
      completedCount: 0,
      retryCount: item.retryCount,
      startedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setCallingSession(retrySession);
    setCurrentScreen('calling');
  };

  const scheduleRetryItem = (id: string, time: string) => {
    setRetryQueue(prev =>
      prev.map(item => (item.id === id ? { ...item, status: 'scheduled', scheduledTime: time } : item))
    );
    showToast(`Contact scheduled for callback at ${time}`);
  };

  // Dynamic Analytics Engine (PRD Sections 39-45)
  // Formula: Completion % = Completed / Assigned * 100
  const getAnalyticsSummary = (): AnalyticsSummary => {
    const totalContacts = contacts.length;
    const assignedToday = callingSession ? callingSession.selectedContactIds.length : 20;
    const completedToday = callReports.filter(r => r.outcome === 'answered').length;
    const pendingToday = Math.max(0, assignedToday - completedToday);
    const completionRate = assignedToday > 0 ? Math.round((completedToday / assignedToday) * 100) : 75;

    // Independent Org vs Employee (Section 44)
    const orgCompletionRate = 80;
    const employeeCompletionRate = completionRate;

    const campaignsBreakdown = [
      { name: 'Attendance Follow-up', rate: 85, total: 20, completed: 17 },
      { name: 'Fee Reminder Campaign', rate: 72, total: 30, completed: 22 },
      { name: 'Interview Confirmation', rate: 91, total: 100, completed: 91 }
    ];

    return {
      totalContacts,
      assignedToday,
      completedToday,
      pendingToday,
      completionRate,
      retryCount: retryQueue.length,
      followUpsCount: followUps.length,
      orgCompletionRate,
      employeeCompletionRate,
      campaignsBreakdown
    };
  };

  // Report Export Engine (PRD Section 80)
  const exportReport = (format: 'csv' | 'excel' | 'pdf', timeframe: string) => {
    const analytics = getAnalyticsSummary();
    const rows = [
      ['SmartCall AI - Executive Calling Report'],
      [`Generated At: ${new Date().toLocaleString()}`],
      [`Timeframe: ${timeframe.toUpperCase()}`],
      [`Organization: ${currentOrg.name}`],
      [''],
      ['Metric', 'Value'],
      ['Total Contacts', analytics.totalContacts.toString()],
      ['Assigned Today', analytics.assignedToday.toString()],
      ['Completed Calls', analytics.completedToday.toString()],
      ['Pending Calls', analytics.pendingToday.toString()],
      ['Completion Rate', `${analytics.completionRate}%`],
      ['Retry Queue Count', analytics.retryCount.toString()],
      ['Follow-ups Due', analytics.followUpsCount.toString()],
      [''],
      ['Recent Call Reports'],
      ['Name', 'Phone', 'Outcome', 'Reason', 'Duration (s)', 'Timestamp'],
      ...callReports.map(r => [
        r.contactName || '',
        r.contactPhone || '',
        r.outcome,
        r.reason,
        r.durationSeconds.toString(),
        r.timestamp
      ])
    ];

    const csvContent = 'data:text/csv;charset=utf-8,' + rows.map(e => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `smartcall_${timeframe}_report_${Date.now()}.${format === 'pdf' ? 'txt' : 'csv'}`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    logAuditEvent('REPORT_EXPORTED', `Exported ${timeframe} report in ${format.toUpperCase()} format`);
    showToast(`Downloaded ${timeframe.toUpperCase()} report as ${format.toUpperCase()}`);
  };

  return (
    <AppContext.Provider
      value={{
        currentScreen,
        setCurrentScreen,
        previousScreen,
        isDesktopView,
        setIsDesktopView,
        currentIndustry,
        currentTemplate,
        setIndustry,
        roleMode,
        setRoleMode,
        currentUser,
        currentOrg,
        organizations,
        setCurrentOrg,
        periods,
        currentPeriod,
        setCurrentPeriod,
        archivePeriod,
        restorePeriod,
        reassignInCharge,
        login,
        logout,
        contacts,
        selectedContactIds,
        toggleSelectContact,
        selectAbsentOnly,
        selectAllContacts,
        clearContactSelection,
        addContacts,
        updateContact,
        deleteContact,
        campaigns,
        callingSession,
        activeCallingContact,
        startCallingWorkflow,
        startRetryWorkflow,
        endActiveCall,
        currentPendingReport,
        setCurrentPendingReport,
        confirmPostCallReport,
        startNextQueuedCall,
        skipCurrentQueuedCall,
        pauseCallingWorkflow,
        resumeCallingWorkflow,
        cancelCallingWorkflow,
        retryQueue,
        retrySingleContact,
        scheduleRetryItem,
        callReports,
        followUps,
        auditLogs,
        logAuditEvent,
        getAnalyticsSummary,
        exportReport,
        uploadedPreviewData,
        setUploadedPreviewData,
        toastMessage,
        showToast,
        isVoiceAssistantOpen,
        setIsVoiceAssistantOpen
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
