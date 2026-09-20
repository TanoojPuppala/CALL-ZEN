import React from 'react';
import { useApp } from '../context/AppContext';
import { ChevronLeft, Phone, UserCheck, CheckCircle2, ShieldAlert } from 'lucide-react';

export const ReadyToCallScreen: React.FC = () => {
  const {
    selectedContactIds,
    startCallingWorkflow,
    setCurrentScreen,
    currentTemplate,
    currentPeriod,
    currentUser
  } = useApp();

  const handleStartCalling = () => {
    startCallingWorkflow();
  };

  const selectedCount = selectedContactIds.length;
  const callerName = currentUser?.name || currentPeriod.assignedCallerName || 'Mr. Kumar';

  return (
    <div
      style={{
        flex: 1,
        background: '#FFFFFF',
        padding: '16px 20px 24px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between'
      }}
    >
      <div>
        {/* Top Bar matching image 9 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '28px' }}>
          <button
            onClick={() => setCurrentScreen('student_list')}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', color: 'var(--text-700)' }}
          >
            <ChevronLeft size={22} />
          </button>
          <h2 style={{ fontSize: '17px', fontWeight: 800, color: 'var(--text-900)', margin: 0 }}>
            Ready to Call (PRD Section 18)
          </h2>
        </div>

        {/* Center Content matching image 9 & PRD Section 18 */}
        <div style={{ textAlign: 'center', padding: '0 10px' }}>
          {/* Light Blue Circle Phone Icon */}
          <div
            style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: '#EFF6FF',
              color: '#2563EB',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px',
              boxShadow: '0 8px 20px rgba(37, 99, 235, 0.15)'
            }}
          >
            <Phone size={36} fill="#2563EB" />
          </div>

          <h1 style={{ fontSize: '22px', fontWeight: 900, color: 'var(--text-900)', margin: '0 0 16px' }}>
            Calling Queue Confirmation
          </h1>

          {/* Section 18 Confirmation Card */}
          <div
            style={{
              background: '#F8FAFC',
              border: '1.5px solid #E2E8F0',
              borderRadius: '16px',
              padding: '18px 16px',
              marginBottom: '20px',
              textAlign: 'left'
            }}
          >
            <div style={{ marginBottom: '12px', borderBottom: '1px solid #E2E8F0', paddingBottom: '10px' }}>
              <span style={{ fontSize: '11px', color: '#64748B', display: 'block' }}>You Selected:</span>
              <strong style={{ fontSize: '20px', fontWeight: 900, color: '#1E293B' }}>
                {selectedCount} {currentTemplate.entityPluralLabel}
              </strong>
            </div>

            <div style={{ marginBottom: '10px' }}>
              <span style={{ fontSize: '11px', color: '#64748B', display: 'block' }}>Campaign:</span>
              <strong style={{ fontSize: '14px', color: '#2563EB' }}>
                {currentTemplate.primaryCampaignName}
              </strong>
            </div>

            <div style={{ marginBottom: '10px' }}>
              <span style={{ fontSize: '11px', color: '#64748B', display: 'block' }}>Class / Department:</span>
              <strong style={{ fontSize: '13px', color: '#1E293B' }}>
                {currentPeriod.departmentOrClass} ({currentPeriod.year})
              </strong>
            </div>

            <div>
              <span style={{ fontSize: '11px', color: '#64748B', display: 'block' }}>Assigned Caller:</span>
              <strong style={{ fontSize: '13px', color: '#1E293B' }}>
                {callerName}
              </strong>
            </div>
          </div>

          <p style={{ fontSize: '12px', color: 'var(--text-500)', lineHeight: 1.5, margin: 0 }}>
            Calling will process one person at a time. The actual call is conducted by you (human caller).
          </p>
        </div>
      </div>

      {/* Buttons matching image 9 & Section 18 (Start Calling & Cancel) */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'center' }}>
        <button
          type="button"
          onClick={handleStartCalling}
          className="btn-primary"
          style={{ width: '100%', height: '48px', fontSize: '15px', fontWeight: 800 }}
        >
          START CALLING ({selectedCount})
        </button>

        <button
          type="button"
          onClick={() => setCurrentScreen('student_list')}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-600)',
            fontSize: '14px',
            fontWeight: 600,
            cursor: 'pointer'
          }}
        >
          Cancel & Return to List
        </button>
      </div>
    </div>
  );
};
