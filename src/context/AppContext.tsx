import React, { createContext, useContext, useState, useEffect } from 'react';
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
  LeaveRecord,
  ScreenType,
  IndustryType,
  IndustryTemplate,
  RoleMode
} from '../types';
import { INDUSTRY_TEMPLATES } from '../data/seedData';
import { SmartCallDB } from '../services/db';
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
  approvedLeaveCount: number;
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

  // Industry Template & Customization
  currentIndustry: IndustryType;
  currentTemplate: IndustryTemplate;
  setIndustry: (industry: IndustryType) => void;

  // Role Mode
  roleMode: RoleMode;
  setRoleMode: (mode: RoleMode) => void;

  // Auth & Org
  currentUser: User | null;
  currentOrg: Organization | null;
  organizations: Organization[];
  setCurrentOrg: (org: Organization) => void;
  createOrganization: (name: string, type: IndustryType, code: string, adminName: string, email: string) => void;

  // Periods / Semesters
  periods: Period[];
  currentPeriod: Period | null;
  setCurrentPeriod: (period: Period) => void;
  createPeriod: (name: string, year: string, deptClass: string, inChargeName?: string) => void;
  archivePeriod: (periodId: string) => void;
  restorePeriod: (periodId: string) => void;
  reassignInCharge: (periodId: string, newCallerId: string, newCallerName: string) => void;
  login: (role?: string) => void;
  logout: () => void;

  // Contacts
  contacts: Contact[];
  selectedContactIds: string[];
  toggleSelectContact: (id: string) => void;
  selectAbsentOnly: () => void;
  selectAllContacts: () => void;
  clearContactSelection: () => void;
  addContacts: (newContacts: Contact[]) => void;
  updateContact: (updated: Contact) => void;
  deleteContact: (id: string) => void;

  // Leave Records
  leaveRecords: LeaveRecord[];
  addLeaveRecord: (contactId: string, contactName: string, startDate: string, endDate: string, reason: string) => void;
  isContactOnApprovedLeave: (contactId: string) => boolean;

  // Campaigns
  campaigns: Campaign[];

  // Calling Session & State Machine
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

  // Retry Engine
  retryQueue: RetryItem[];
  retrySingleContact: (item: RetryItem) => void;
  scheduleRetryItem: (id: string, time: string) => void;

  // Follow-ups & Call Reports
  callReports: CallReport[];
  followUps: FollowUpItem[];
  auditLogs: AuditLog[];
  logAuditEvent: (action: string, details: string) => void;

  // Analytics Engine & Export
  getAnalyticsSummary: () => AnalyticsSummary;
  exportReport: (format: 'csv' | 'excel' | 'pdf', timeframe: string) => void;

  // Uploaded Data Preview
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

  // Uploaded Data for Preview
  const [uploadedPreviewData, setUploadedPreviewData] = useState<Contact[]>([]);

  // Industry Template & Dual Role Mode
  const [currentIndustry, setCurrentIndustry] = useState<IndustryType>('education');
  const [roleMode, setRoleMode] = useState<RoleMode>('admin');

  // Core Entity State initialized from persistent database
  const [organizations, setOrganizations] = useState<Organization[]>(() => SmartCallDB.getOrganizations());
  const [currentOrg, setCurrentOrg] = useState<Organization | null>(() => organizations[0] || null);
  const [currentUser, setCurrentUser] = useState<User | null>(() => SmartCallDB.getCurrentUser());
  const [periods, setPeriods] = useState<Period[]>(() => SmartCallDB.getPeriods());
  const [currentPeriod, setCurrentPeriod] = useState<Period | null>(() => periods[0] || null);
  const [contacts, setContacts] = useState<Contact[]>(() => SmartCallDB.getContacts());
  const [leaveRecords, setLeaveRecords] = useState<LeaveRecord[]>(() => SmartCallDB.getLeaveRecords());
  const [campaigns] = useState<Campaign[]>([]);

  // Selection & Calling Session State
  const [selectedContactIds, setSelectedContactIds] = useState<string[]>([]);
  const [callingSession, setCallingSession] = useState<CallingSession | null>(() => SmartCallDB.getActiveCallingSession());
  const [currentPendingReport, setCurrentPendingReport] = useState<Partial<CallReport> | null>(null);

  // Retry, Reports, Follow-ups, Audit
  const [retryQueue, setRetryQueue] = useState<RetryItem[]>(() => SmartCallDB.getRetryQueue());
  const [callReports, setCallReports] = useState<CallReport[]>(() => SmartCallDB.getCallReports());
  const [followUps, setFollowUps] = useState<FollowUpItem[]>(() => SmartCallDB.getFollowUps());
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => SmartCallDB.getAuditLogs());

  // Toast & Modals
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isVoiceAssistantOpen, setIsVoiceAssistantOpen] = useState<boolean>(false);

  // Load Supabase records if configured
  useEffect(() => {
    if (isSupabaseConfigured) {
      (async () => {
        const fetchedContacts = await fetchContactsFromSupabase();
        if (fetchedContacts && fetchedContacts.length > 0) {
          setContacts(fetchedContacts);
          SmartCallDB.saveContacts(fetchedContacts);
        }
        const fetchedPeriods = await fetchPeriodsFromSupabase();
        if (fetchedPeriods && fetchedPeriods.length > 0) {
          setPeriods(fetchedPeriods);
          SmartCallDB.savePeriods(fetchedPeriods);
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
      organizationId: currentOrg ? currentOrg.id : 'org-default',
      actorName,
      action,
      details,
      timestamp: new Date().toISOString()
    };
    setAuditLogs(prev => {
      const updated = [newLog, ...prev];
      SmartCallDB.addAuditLog(newLog);
      return updated;
    });
    if (isSupabaseConfigured) {
      saveAuditLogToSupabase(actorName, actorRole, action, details);
    }
  };

  // Organization Setup Flow
  const createOrganization = (name: string, type: IndustryType, code: string, adminName: string, email: string) => {
    const newOrg: Organization = {
      id: `org-${Date.now()}`,
      name,
      type,
      code
    };
    const adminUser: User = {
      id: `user-${Date.now()}`,
      name: adminName,
      email,
      role: 'org_admin',
      roleTitle: 'Organization Admin',
      avatar: adminName.substring(0, 2).toUpperCase(),
      organizationId: newOrg.id
    };

    SmartCallDB.saveOrganization(newOrg);
    SmartCallDB.saveCurrentUser(adminUser);

    setOrganizations(prev => [...prev, newOrg]);
    setCurrentOrg(newOrg);
    setCurrentUser(adminUser);

    logAuditEvent('ORG_CREATED', `Created organization: ${name} (${type})`);
    showToast(`Organization "${name}" created successfully!`);
  };

  // Period / Semester Creation
  const createPeriod = (name: string, year: string, deptClass: string, inChargeName?: string) => {
    const newPeriod: Period = {
      id: `period-${Date.now()}`,
      organizationId: currentOrg ? currentOrg.id : 'org-default',
      year,
      semesterOrPeriod: name,
      departmentOrClass: deptClass,
      assignedCallerName: inChargeName || (currentUser ? currentUser.name : 'Admin'),
      isArchived: false,
      totalContacts: 0,
      createdAt: new Date().toISOString()
    };

    setPeriods(prev => {
      const updated = [...prev, newPeriod];
      SmartCallDB.savePeriods(updated);
      return updated;
    });
    if (!currentPeriod) setCurrentPeriod(newPeriod);

    logAuditEvent('PERIOD_CREATED', `Created class/dataset: ${deptClass} (${year} ${name})`);
    showToast(`Dataset "${deptClass}" created.`);
  };

  // Industry Template Switcher
  const setIndustry = (industry: IndustryType) => {
    setCurrentIndustry(industry);
    logAuditEvent('INDUSTRY_SWITCHED', `Active industry template switched to: ${industry}`);
    showToast(`Switched template to ${INDUSTRY_TEMPLATES[industry].displayName}`);
  };

  // Auth
  const login = (roleOverride?: string) => {
    if (!currentUser) {
      const defaultAdmin: User = {
        id: `user-admin`,
        name: 'System Admin',
        email: 'admin@smartcall.ai',
        role: (roleOverride as any) || 'org_admin',
        roleTitle: 'Administrator',
        organizationId: currentOrg ? currentOrg.id : 'org-default'
      };
      setCurrentUser(defaultAdmin);
      SmartCallDB.saveCurrentUser(defaultAdmin);
    }
    setRoleMode(roleOverride === 'caller' ? 'employee' : 'admin');
    showToast(`Welcome to SmartCall AI`);
    setCurrentScreen('dashboard');
  };

  const logout = () => {
    logAuditEvent('LOGOUT', `User ${currentUser?.name || ''} logged out`);
    setCurrentUser(null);
    SmartCallDB.saveCurrentUser(null);
    setCurrentScreen('login');
  };

  // Leave Management & Approved Leave Invariant
  const isContactOnApprovedLeave = (contactId: string): boolean => {
    const today = new Date().toISOString().split('T')[0];
    return leaveRecords.some(r =>
      r.contactId === contactId &&
      r.status === 'APPROVED' &&
      r.startDate <= today &&
      r.endDate >= today
    );
  };

  const addLeaveRecord = (contactId: string, contactName: string, startDate: string, endDate: string, reason: string) => {
    const newRecord: LeaveRecord = {
      id: `leave-${Date.now()}`,
      contactId,
      contactName,
      periodId: currentPeriod ? currentPeriod.id : undefined,
      startDate,
      endDate,
      reason,
      status: 'APPROVED',
      requestedBy: currentUser?.name || 'Admin',
      approvedBy: currentUser?.name || 'Admin',
      createdAt: new Date().toISOString()
    };

    setLeaveRecords(prev => [newRecord, ...prev]);
    SmartCallDB.saveLeaveRecord(newRecord);

    logAuditEvent('LEAVE_APPROVED', `Approved leave for ${contactName} (${startDate} to ${endDate})`);
    showToast(`Approved leave recorded for ${contactName}. Excluded from calling queue.`);
  };

  // Dataset Versioning & Period Management
  const archivePeriod = (periodId: string) => {
    setPeriods(prev => {
      const updated = prev.map(p => (p.id === periodId ? { ...p, isArchived: true } : p));
      SmartCallDB.savePeriods(updated);
      return updated;
    });
    logAuditEvent('PERIOD_ARCHIVED', `Archived dataset ${periodId}`);
    showToast(`Dataset archived safely.`);
  };

  const restorePeriod = (periodId: string) => {
    setPeriods(prev => {
      const updated = prev.map(p => (p.id === periodId ? { ...p, isArchived: false } : p));
      SmartCallDB.savePeriods(updated);
      return updated;
    });
    logAuditEvent('PERIOD_RESTORED', `Restored dataset ${periodId}`);
    showToast(`Dataset restored to active.`);
  };

  const reassignInCharge = (periodId: string, newCallerId: string, newCallerName: string) => {
    setPeriods(prev => {
      const updated = prev.map(p =>
        p.id === periodId
          ? { ...p, assignedCallerId: newCallerId, assignedCallerName: newCallerName }
          : p
      );
      SmartCallDB.savePeriods(updated);
      return updated;
    });
    logAuditEvent('IN_CHARGE_REASSIGNED', `Reassigned period ${periodId} in-charge to ${newCallerName}`);
    showToast(`Class in-charge successfully reassigned to ${newCallerName}`);
  };

  // Contacts Selection Methods
  const toggleSelectContact = (id: string) => {
    // Cannot select contacts on approved leave
    if (isContactOnApprovedLeave(id)) {
      showToast('Contact is on Approved Leave and cannot be queued for calling.');
      return;
    }
    setSelectedContactIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const selectAbsentOnly = () => {
    if (!currentPeriod) return;
    const absentIds = contacts
      .filter(
        c =>
          c.periodId === currentPeriod.id &&
          !isContactOnApprovedLeave(c.id) &&
          ((c.overallAttendance && c.overallAttendance < 75) ||
            c.status === 'absent' ||
            c.priority === 'urgent' ||
            c.priority === 'high')
      )
      .map(c => c.id);
    setSelectedContactIds(absentIds);
    showToast(`Selected ${absentIds.length} eligible contacts needing attention`);
  };

  const selectAllContacts = () => {
    if (!currentPeriod) return;
    const allIds = contacts
      .filter(c => c.periodId === currentPeriod.id && !isContactOnApprovedLeave(c.id))
      .map(c => c.id);
    setSelectedContactIds(allIds);
    showToast(`Selected all ${allIds.length} eligible contacts`);
  };

  const clearContactSelection = () => {
    setSelectedContactIds([]);
    showToast('Contact selection cleared');
  };

  const addContacts = (newContacts: Contact[]) => {
    setContacts(prev => {
      const updated = [...newContacts, ...prev];
      SmartCallDB.saveContacts(updated);
      return updated;
    });
    if (isSupabaseConfigured) {
      syncContactsToSupabase(newContacts);
    }
    logAuditEvent('DATA_UPLOAD', `Imported ${newContacts.length} new records`);
    showToast(`Imported ${newContacts.length} contacts successfully`);
  };

  const updateContact = (updated: Contact) => {
    setContacts(prev => {
      const updatedList = prev.map(c => (c.id === updated.id ? updated : c));
      SmartCallDB.saveContacts(updatedList);
      return updatedList;
    });
    if (isSupabaseConfigured) {
      syncContactsToSupabase([updated]);
    }
    showToast(`Updated ${updated.name}`);
  };

  const deleteContact = (id: string) => {
    const contact = contacts.find(c => c.id === id);
    setContacts(prev => {
      const filtered = prev.filter(c => c.id !== id);
      SmartCallDB.saveContacts(filtered);
      return filtered;
    });
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

  // Calling Session Workflows
  const startCallingWorkflow = () => {
    // Filter out any contacts on approved leave
    const eligibleContactIds = selectedContactIds.filter(id => !isContactOnApprovedLeave(id));

    if (eligibleContactIds.length === 0) {
      showToast('Please select at least one eligible contact to call.');
      return;
    }

    const session: CallingSession = {
      id: `session-${Date.now()}`,
      organizationId: currentOrg ? currentOrg.id : 'org-default',
      periodId: currentPeriod ? currentPeriod.id : 'period-default',
      campaignId: 'camp-1',
      campaignName: currentTemplate.primaryCampaignName,
      callerId: currentUser?.id || 'user-default',
      callerName: currentUser?.name || 'Caller',
      selectedContactIds: [...eligibleContactIds],
      currentIndex: 0,
      state: 'calling',
      completedCount: 0,
      retryCount: 0,
      startedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setCallingSession(session);
    SmartCallDB.saveCallingSession(session);
    logAuditEvent(
      'CALLING_STARTED',
      `Started calling session with ${session.selectedContactIds.length} selected contacts`
    );
    setCurrentScreen('calling');
  };

  const startRetryWorkflow = () => {
    const retryContactIds = retryQueue.map(item => item.contactId);
    if (retryContactIds.length === 0) {
      showToast('Re-Attend Queue is currently empty.');
      return;
    }

    const session: CallingSession = {
      id: `retry-session-${Date.now()}`,
      organizationId: currentOrg ? currentOrg.id : 'org-default',
      periodId: currentPeriod ? currentPeriod.id : 'period-default',
      campaignId: 'camp-retry',
      campaignName: 'Re-Attend Calls Queue',
      callerId: currentUser?.id || 'user-default',
      callerName: currentUser?.name || 'Caller',
      selectedContactIds: retryContactIds,
      currentIndex: 0,
      state: 'calling',
      completedCount: 0,
      retryCount: 0,
      startedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setCallingSession(session);
    SmartCallDB.saveCallingSession(session);
    logAuditEvent('RETRY_SESSION_STARTED', `Started Re-Attend calling for ${retryContactIds.length} contacts`);
    setCurrentScreen('calling');
  };

  const endActiveCall = (durationSeconds: number, outcomeHint?: CallOutcome) => {
    if (!callingSession || !activeCallingContact) return;

    const outcome = outcomeHint || (durationSeconds > 5 ? 'answered' : 'no_answer');
    let reason = 'General Update';
    let followUpRequired = false;

    if (outcome === 'answered') {
      reason = 'Contact Answered';
      followUpRequired = false;
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
      callerId: currentUser?.id || 'user-default',
      callerName: currentUser?.name || 'Caller',
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
    setCallingSession(prev => {
      const updated = prev ? { ...prev, state: 'call_ended' as const, updatedAt: new Date().toISOString() } : null;
      SmartCallDB.saveCallingSession(updated);
      return updated;
    });
    setCurrentScreen('post_call_report');
  };

  const confirmPostCallReport = (reportData: Partial<CallReport>) => {
    if (!callingSession || !activeCallingContact) return;

    const fullReport: CallReport = {
      id: reportData.id || `rep-${Date.now()}`,
      sessionId: callingSession.id,
      contactId: activeCallingContact.id,
      contactName: activeCallingContact.name,
      contactPhone: activeCallingContact.phone,
      externalId: activeCallingContact.externalId,
      callerId: currentUser?.id || 'user-default',
      callerName: currentUser?.name || 'Caller',
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
    SmartCallDB.saveCallReport(fullReport);

    if (isSupabaseConfigured) {
      saveCallLogToSupabase(fullReport);
    }

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

        const updatedQueue = [updatedItem, ...prev.filter(r => r.contactId !== activeCallingContact.id)];
        SmartCallDB.saveRetryQueue(updatedQueue);
        return updatedQueue;
      });
      showToast(`${activeCallingContact.name} moved to Retry Queue`);
    } else if (fullReport.outcome === 'answered') {
      setRetryQueue(prev => {
        const filtered = prev.filter(r => r.contactId !== activeCallingContact.id);
        SmartCallDB.saveRetryQueue(filtered);
        return filtered;
      });
    }

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
        assignedCallerId: currentUser?.id || 'user-default',
        assignedCallerName: currentUser?.name || 'Caller',
        status: 'pending'
      };
      setFollowUps(prev => {
        const updated = [newFollowUp, ...prev];
        SmartCallDB.saveFollowUps(updated);
        return updated;
      });
    }

    logAuditEvent(
      'CALL_REPORT_CONFIRMED',
      `Recorded call for ${activeCallingContact.name} (${fullReport.outcome})`
    );

    const updatedCompleted = !isUnreachable ? callingSession.completedCount + 1 : callingSession.completedCount;
    const updatedRetry = isUnreachable ? callingSession.retryCount + 1 : callingSession.retryCount;
    const nextIndex = callingSession.currentIndex + 1;

    if (nextIndex < callingSession.selectedContactIds.length) {
      const nextSession = {
        ...callingSession,
        currentIndex: nextIndex,
        state: 'next_contact' as const,
        completedCount: updatedCompleted,
        retryCount: updatedRetry,
        updatedAt: new Date().toISOString()
      };
      setCallingSession(nextSession);
      SmartCallDB.saveCallingSession(nextSession);
      setCurrentScreen('next_call');
    } else {
      const completedSession = {
        ...callingSession,
        state: 'completed' as const,
        completedCount: updatedCompleted,
        retryCount: updatedRetry,
        updatedAt: new Date().toISOString()
      };
      setCallingSession(completedSession);
      SmartCallDB.saveCallingSession(null);
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
    const updated = { ...callingSession, state: 'calling' as const, updatedAt: new Date().toISOString() };
    setCallingSession(updated);
    SmartCallDB.saveCallingSession(updated);
    setCurrentScreen('calling');
  };

  const skipCurrentQueuedCall = () => {
    if (!callingSession) return;
    const nextIndex = callingSession.currentIndex + 1;
    if (nextIndex < callingSession.selectedContactIds.length) {
      const updated = {
        ...callingSession,
        currentIndex: nextIndex,
        state: 'next_contact' as const,
        updatedAt: new Date().toISOString()
      };
      setCallingSession(updated);
      SmartCallDB.saveCallingSession(updated);
      showToast('Skipped contact');
    } else {
      showToast('Queue complete');
      setCurrentScreen('reports');
    }
  };

  const pauseCallingWorkflow = () => {
    if (!callingSession) return;
    const updated = {
      ...callingSession,
      state: 'paused' as const,
      updatedAt: new Date().toISOString()
    };
    setCallingSession(updated);
    SmartCallDB.saveCallingSession(updated);
    logAuditEvent('CALLING_PAUSED', `Paused queue at contact ${callingSession.currentIndex + 1}`);
    showToast(`Calling paused at contact ${callingSession.currentIndex + 1}. Position saved.`);
    setCurrentScreen('dashboard');
  };

  const resumeCallingWorkflow = () => {
    if (!callingSession) {
      showToast('No active session to resume');
      return;
    }
    const updated = {
      ...callingSession,
      state: 'next_contact' as const,
      updatedAt: new Date().toISOString()
    };
    setCallingSession(updated);
    SmartCallDB.saveCallingSession(updated);
    setCurrentScreen('next_call');
  };

  const cancelCallingWorkflow = () => {
    setCallingSession(null);
    SmartCallDB.saveCallingSession(null);
    showToast('Calling queue closed');
    setCurrentScreen('student_list');
  };

  const retrySingleContact = (item: RetryItem) => {
    const contact = contacts.find(c => c.id === item.contactId);
    if (!contact) return;

    const retrySession: CallingSession = {
      id: `retry-single-${Date.now()}`,
      organizationId: currentOrg ? currentOrg.id : 'org-default',
      periodId: currentPeriod ? currentPeriod.id : 'period-default',
      campaignId: 'camp-retry',
      campaignName: 'Single Retry Call',
      callerId: currentUser?.id || 'user-default',
      callerName: currentUser?.name || 'Caller',
      selectedContactIds: [contact.id],
      currentIndex: 0,
      state: 'calling',
      completedCount: 0,
      retryCount: item.retryCount,
      startedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setCallingSession(retrySession);
    SmartCallDB.saveCallingSession(retrySession);
    setCurrentScreen('calling');
  };

  const scheduleRetryItem = (id: string, time: string) => {
    setRetryQueue(prev => {
      const updated = prev.map(item => (item.id === id ? { ...item, status: 'scheduled' as const, scheduledTime: time } : item));
      SmartCallDB.saveRetryQueue(updated);
      return updated;
    });
    showToast(`Contact scheduled for callback at ${time}`);
  };

  // Database-Driven Analytics Engine (Strictly 0 when database is empty)
  const getAnalyticsSummary = (): AnalyticsSummary => {
    const totalContacts = contacts.length;
    const assignedToday = callingSession ? callingSession.selectedContactIds.length : 0;
    const completedToday = callReports.filter(r => r.outcome === 'answered').length;
    const pendingToday = Math.max(0, assignedToday - completedToday);
    const completionRate = assignedToday > 0 ? Math.round((completedToday / assignedToday) * 100) : 0;
    const approvedLeaveCount = leaveRecords.filter(r => r.status === 'APPROVED').length;

    return {
      totalContacts,
      assignedToday,
      completedToday,
      pendingToday,
      completionRate,
      retryCount: retryQueue.length,
      followUpsCount: followUps.length,
      approvedLeaveCount,
      orgCompletionRate: completionRate,
      employeeCompletionRate: completionRate,
      campaignsBreakdown: []
    };
  };

  const exportReport = (format: 'csv' | 'excel' | 'pdf', timeframe: string) => {
    const analytics = getAnalyticsSummary();
    const rows = [
      ['SmartCall AI - Calling Report'],
      [`Generated At: ${new Date().toLocaleString()}`],
      [`Timeframe: ${timeframe.toUpperCase()}`],
      [`Organization: ${currentOrg ? currentOrg.name : 'Not Configured'}`],
      [''],
      ['Metric', 'Value'],
      ['Total Contacts', analytics.totalContacts.toString()],
      ['Assigned Today', analytics.assignedToday.toString()],
      ['Completed Calls', analytics.completedToday.toString()],
      ['Pending Calls', analytics.pendingToday.toString()],
      ['Completion Rate', `${analytics.completionRate}%`],
      ['Retry Queue Count', analytics.retryCount.toString()],
      ['Approved Leave Count', analytics.approvedLeaveCount.toString()],
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
        createOrganization,
        periods,
        currentPeriod,
        setCurrentPeriod,
        createPeriod,
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
        leaveRecords,
        addLeaveRecord,
        isContactOnApprovedLeave,
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
