import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Bell,
  Database,
  Table,
  Phone,
  BarChart2,
  RefreshCw,
  Clock,
  CheckCircle,
  Play,
  Layers,
  Sparkles,
  ArrowUpRight,
  TrendingUp,
  UserCheck
} from 'lucide-react';

export const DashboardScreen: React.FC = () => {
  const {
    currentUser,
    currentOrg,
    roleMode,
    setRoleMode,
    currentTemplate,
    setCurrentScreen,
    callingSession,
    resumeCallingWorkflow,
    startCallingWorkflow,
    startRetryWorkflow,
    selectedContactIds,
    getAnalyticsSummary,
    campaigns,
    retryQueue,
    followUps
  } = useApp();

  const analytics = getAnalyticsSummary();
  const isPaused = callingSession?.state === 'paused';

  const renderAdminDashboard = () => (
    <>
      {/* 4 Metric Top Cards matching PRD Section 7 & 77 */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '10px',
          marginBottom: '14px'
        }}
      >
        <div
          style={{
            background: '#FFFFFF',
            border: '1px solid var(--border)',
            borderRadius: '12px',
            padding: '12px',
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          <span style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-500)', textTransform: 'uppercase' }}>
            Total {currentTemplate.entityPluralLabel}
          </span>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginTop: '4px' }}>
            <span style={{ fontSize: '20px', fontWeight: 900, color: '#1E293B' }}>
              {analytics.totalContacts.toLocaleString()}
            </span>
            <span style={{ fontSize: '10px', color: '#16A34A', fontWeight: 700, display: 'flex', alignItems: 'center' }}>
              <TrendingUp size={12} style={{ marginRight: '2px' }} /> Active
            </span>
          </div>
        </div>

        <div
          style={{
            background: '#FFFFFF',
            border: '1px solid var(--border)',
            borderRadius: '12px',
            padding: '12px',
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          <span style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-500)', textTransform: 'uppercase' }}>
            Today's Calls
          </span>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginTop: '4px' }}>
            <span style={{ fontSize: '20px', fontWeight: 900, color: '#2563EB' }}>
              {analytics.assignedToday}
            </span>
            <span style={{ fontSize: '11px', color: '#1D4ED8', fontWeight: 700 }}>
              {analytics.completionRate}% Done
            </span>
          </div>
        </div>

        <div
          style={{
            background: '#FFFFFF',
            border: '1px solid var(--border)',
            borderRadius: '12px',
            padding: '12px',
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          <span style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-500)', textTransform: 'uppercase' }}>
            Completed
          </span>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginTop: '4px' }}>
            <span style={{ fontSize: '20px', fontWeight: 900, color: '#16A34A' }}>
              {analytics.completedToday}
            </span>
            <span style={{ fontSize: '10px', color: '#64748B', fontWeight: 600 }}>
              Answered
            </span>
          </div>
        </div>

        <div
          style={{
            background: '#FFFFFF',
            border: '1px solid var(--border)',
            borderRadius: '12px',
            padding: '12px',
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          <span style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-500)', textTransform: 'uppercase' }}>
            Pending Calls
          </span>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginTop: '4px' }}>
            <span style={{ fontSize: '20px', fontWeight: 900, color: '#EF4444' }}>
              {analytics.pendingToday}
            </span>
            <span style={{ fontSize: '10px', color: '#EF4444', fontWeight: 700 }}>
              In Queue
            </span>
          </div>
        </div>
      </div>

      {/* 4 Feature Action Cards (2x2 Grid) matching image 3 */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '10px',
          marginBottom: '14px'
        }}
      >
        {/* 1. Data Management */}
        <div
          onClick={() => setCurrentScreen('data_management')}
          className="sc-card"
          style={{
            padding: '14px 12px',
            textAlign: 'center',
            cursor: 'pointer',
            borderRadius: '12px',
            border: '1px solid var(--border)',
            background: '#FFFFFF'
          }}
        >
          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: '#FFF7ED',
              color: '#F97316',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 8px'
            }}
          >
            <Database size={20} />
          </div>
          <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-900)' }}>
            Data Management
          </span>
        </div>

        {/* 2. View Records */}
        <div
          onClick={() => setCurrentScreen('student_list')}
          className="sc-card"
          style={{
            padding: '14px 12px',
            textAlign: 'center',
            cursor: 'pointer',
            borderRadius: '12px',
            border: '1px solid var(--border)',
            background: '#FFFFFF'
          }}
        >
          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: '#ECFEFF',
              color: '#06B6D4',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 8px'
            }}
          >
            <Table size={20} />
          </div>
          <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-900)' }}>
            Spreadsheet Table
          </span>
        </div>

        {/* 3. Start Calling */}
        <div
          onClick={() => {
            if (selectedContactIds.length > 0) {
              setCurrentScreen('ready_to_call');
            } else {
              setCurrentScreen('student_list');
            }
          }}
          className="sc-card"
          style={{
            padding: '14px 12px',
            textAlign: 'center',
            cursor: 'pointer',
            borderRadius: '12px',
            border: '1px solid var(--border)',
            background: '#FFFFFF'
          }}
        >
          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: '#F0FDF4',
              color: '#16A34A',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 8px'
            }}
          >
            <Phone size={20} />
          </div>
          <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-900)' }}>
            Start Calling ({selectedContactIds.length})
          </span>
        </div>

        {/* 4. Reports & Analytics */}
        <div
          onClick={() => setCurrentScreen('reports')}
          className="sc-card"
          style={{
            padding: '14px 12px',
            textAlign: 'center',
            cursor: 'pointer',
            borderRadius: '12px',
            border: '1px solid var(--border)',
            background: '#FFFFFF'
          }}
        >
          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: '#FAF5FF',
              color: '#9333EA',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 8px'
            }}
          >
            <BarChart2 size={20} />
          </div>
          <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-900)' }}>
            Reports & Analytics
          </span>
        </div>
      </div>

      {/* Active Campaigns Progress (PRD Section 45 & 77) */}
      <div
        style={{
          background: '#FFFFFF',
          border: '1px solid var(--border)',
          borderRadius: '14px',
          padding: '14px',
          marginBottom: '14px',
          boxShadow: 'var(--shadow-sm)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
          <h4 style={{ fontSize: '13px', fontWeight: 800, color: '#1E293B', margin: 0 }}>
            Active Campaigns (Section 45)
          </h4>
          <span style={{ fontSize: '11px', color: '#2563EB', fontWeight: 700 }}>
            Org Completion: 80%
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {analytics.campaignsBreakdown.map(camp => (
            <div key={camp.name}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '3px' }}>
                <span style={{ fontWeight: 600, color: '#334155' }}>{camp.name}</span>
                <span style={{ fontWeight: 800, color: '#0F172A' }}>{camp.rate}%</span>
              </div>
              <div style={{ width: '100%', height: '6px', background: '#F1F5F9', borderRadius: '99px', overflow: 'hidden' }}>
                <div
                  style={{
                    width: `${camp.rate}%`,
                    height: '100%',
                    background: camp.rate > 80 ? '#16A34A' : camp.rate > 70 ? '#2563EB' : '#F59E0B',
                    borderRadius: '99px'
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Follow-ups & Retry Row (Section 77) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', marginBottom: '12px' }}>
        <div
          onClick={() => setCurrentScreen('retry_queue')}
          style={{
            background: '#FEF2F2',
            border: '1px solid #FECACA',
            borderRadius: '12px',
            padding: '12px',
            cursor: 'pointer'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#DC2626', marginBottom: '4px' }}>
            <RefreshCw size={14} />
            <span style={{ fontSize: '11px', fontWeight: 700 }}>RETRY REQUIRED</span>
          </div>
          <span style={{ fontSize: '22px', fontWeight: 900, color: '#B91C1C' }}>
            {analytics.retryCount}
          </span>
          <span style={{ fontSize: '10px', color: '#991B1B', display: 'block', marginTop: '2px' }}>
            Unanswered calls to re-attend
          </span>
        </div>

        <div
          onClick={() => setCurrentScreen('student_list')}
          style={{
            background: '#F0FDF4',
            border: '1px solid #BBF7D0',
            borderRadius: '12px',
            padding: '12px',
            cursor: 'pointer'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#16A34A', marginBottom: '4px' }}>
            <Clock size={14} />
            <span style={{ fontSize: '11px', fontWeight: 700 }}>FOLLOW-UPS DUE</span>
          </div>
          <span style={{ fontSize: '22px', fontWeight: 900, color: '#15803D' }}>
            {analytics.followUpsCount}
          </span>
          <span style={{ fontSize: '10px', color: '#166534', display: 'block', marginTop: '2px' }}>
            Scheduled callbacks
          </span>
        </div>
      </div>
    </>
  );

  // EMPLOYEE / TEACHER DASHBOARD (PRD SECTION 78)
  const renderEmployeeDashboard = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      {/* Employee Greeting Card */}
      <div
        style={{
          background: 'linear-gradient(135deg, #1E3A8A 0%, #2563EB 100%)',
          borderRadius: '16px',
          padding: '18px 16px',
          color: '#FFFFFF',
          boxShadow: '0 8px 20px rgba(37, 99, 235, 0.25)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: '#93C5FD' }}>
            Assigned Queue • {currentTemplate.primaryCampaignName}
          </span>
          <span style={{ fontSize: '11px', background: 'rgba(255,255,255,0.2)', padding: '2px 8px', borderRadius: '99px', fontWeight: 700 }}>
            {analytics.completionRate}%
          </span>
        </div>

        <h2 style={{ fontSize: '18px', fontWeight: 800, margin: '0 0 12px' }}>
          Ready for Today's Calling
        </h2>

        {/* 3 Metric Pills */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', background: 'rgba(255,255,255,0.12)', borderRadius: '10px', padding: '10px' }}>
          <div style={{ textAlign: 'center' }}>
            <span style={{ fontSize: '10px', color: '#BFDBFE', display: 'block' }}>Assigned</span>
            <strong style={{ fontSize: '18px', fontWeight: 900 }}>{analytics.assignedToday}</strong>
          </div>
          <div style={{ textAlign: 'center' }}>
            <span style={{ fontSize: '10px', color: '#BFDBFE', display: 'block' }}>Completed</span>
            <strong style={{ fontSize: '18px', fontWeight: 900 }}>{analytics.completedToday}</strong>
          </div>
          <div style={{ textAlign: 'center' }}>
            <span style={{ fontSize: '10px', color: '#BFDBFE', display: 'block' }}>Pending</span>
            <strong style={{ fontSize: '18px', fontWeight: 900 }}>{analytics.pendingToday}</strong>
          </div>
        </div>
      </div>

      {/* 4 Focused Big Action Buttons matching Section 78 */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {/* 1. START CALLING */}
        <button
          type="button"
          onClick={() => {
            if (selectedContactIds.length > 0) {
              setCurrentScreen('ready_to_call');
            } else {
              setCurrentScreen('student_list');
            }
          }}
          className="btn-primary"
          style={{
            height: '52px',
            fontSize: '15px',
            fontWeight: 800,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            borderRadius: '12px'
          }}
        >
          <Phone size={20} />
          <span>START CALLING ({selectedContactIds.length > 0 ? selectedContactIds.length : 'Select Contacts'})</span>
        </button>

        {/* 2. RE-ATTEND CALLS */}
        <button
          type="button"
          onClick={startRetryWorkflow}
          style={{
            height: '48px',
            background: '#FEF2F2',
            border: '1.5px solid #FCA5A5',
            color: '#B91C1C',
            borderRadius: '12px',
            fontSize: '14px',
            fontWeight: 800,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            cursor: 'pointer'
          }}
        >
          <RefreshCw size={18} />
          <span>RE-ATTEND CALLS ({retryQueue.length})</span>
        </button>

        {/* 3. FOLLOW-UPS */}
        <button
          type="button"
          onClick={() => setCurrentScreen('student_list')}
          style={{
            height: '48px',
            background: '#F0FDF4',
            border: '1.5px solid #86EFAC',
            color: '#15803D',
            borderRadius: '12px',
            fontSize: '14px',
            fontWeight: 800,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            cursor: 'pointer'
          }}
        >
          <Clock size={18} />
          <span>FOLLOW-UPS ({followUps.length})</span>
        </button>

        {/* 4. MY REPORT */}
        <button
          type="button"
          onClick={() => setCurrentScreen('reports')}
          style={{
            height: '46px',
            background: '#FFFFFF',
            border: '1.5px solid #CBD5E1',
            color: '#334155',
            borderRadius: '12px',
            fontSize: '14px',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            cursor: 'pointer'
          }}
        >
          <BarChart2 size={18} />
          <span>MY PROGRESS REPORT</span>
        </button>
      </div>

      <div style={{ textAlign: 'center', padding: '6px' }}>
        <p style={{ fontSize: '11px', color: '#64748B', margin: 0, fontStyle: 'italic' }}>
          "Just speak the outcome. SmartCall handles the structured report."
        </p>
      </div>
    </div>
  );

  return (
    <div style={{ flex: 1, padding: '14px 16px 20px', overflowY: 'auto', background: '#F8FAFC' }}>
      {/* Top Header Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <img
            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"
            alt={currentUser?.name || 'User'}
            style={{ width: '38px', height: '38px', borderRadius: '50%', objectFit: 'cover' }}
          />
          <div>
            <h3 style={{ fontSize: '14px', fontWeight: 800, color: 'var(--text-900)', margin: 0 }}>
              {roleMode === 'admin' ? `Hello, ${currentUser?.name || 'Admin'}` : 'Good Morning, Teacher 👋'}
            </h3>
            <span style={{ fontSize: '11px', color: 'var(--text-500)' }}>
              {roleMode === 'admin' ? `${currentOrg.name}` : `${currentTemplate.primaryCampaignName}`}
            </span>
          </div>
        </div>

        {/* Dual Role Switcher Badge (Section 79) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <button
            type="button"
            onClick={() => setRoleMode(roleMode === 'admin' ? 'employee' : 'admin')}
            style={{
              background: roleMode === 'admin' ? '#EFF6FF' : '#FEF3C7',
              border: roleMode === 'admin' ? '1px solid #BFDBFE' : '1px solid #FDE68A',
              color: roleMode === 'admin' ? '#1D4ED8' : '#92400E',
              padding: '4px 8px',
              borderRadius: '8px',
              fontSize: '10px',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
            title="Toggle between Admin view and Teacher/Employee view"
          >
            <UserCheck size={12} />
            <span>{roleMode === 'admin' ? 'View: Admin' : 'View: Teacher'}</span>
          </button>

          <button
            onClick={() => setCurrentScreen('reports')}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-700)',
              cursor: 'pointer',
              padding: '4px'
            }}
          >
            <Bell size={18} />
          </button>
        </div>
      </div>

      {/* Paused Session Banner (Sections 30 & 31) */}
      {isPaused && (
        <div
          onClick={resumeCallingWorkflow}
          style={{
            background: '#FEF3C7',
            border: '1px solid #FDE68A',
            borderRadius: '12px',
            padding: '10px 14px',
            marginBottom: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: 'pointer'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Play size={16} color="#D97706" />
            <div>
              <strong style={{ fontSize: '12px', color: '#92400E', display: 'block' }}>
                Calling Queue Paused
              </strong>
              <span style={{ fontSize: '11px', color: '#B45309' }}>
                Position saved at contact {callingSession.currentIndex + 1} of {callingSession.selectedContactIds.length}
              </span>
            </div>
          </div>
          <span style={{ fontSize: '11px', fontWeight: 800, color: '#D97706' }}>Resume →</span>
        </div>
      )}

      {/* Switch between Admin and Employee UX */}
      {roleMode === 'admin' ? renderAdminDashboard() : renderEmployeeDashboard()}
    </div>
  );
};
