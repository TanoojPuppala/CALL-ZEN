import React from 'react';
import { useApp } from '../context/AppContext';
import { ChevronLeft, Pause, Play, Phone, SkipForward, ArrowRight } from 'lucide-react';

export const NextCallScreen: React.FC = () => {
  const {
    activeCallingContact,
    callingSession,
    startNextQueuedCall,
    skipCurrentQueuedCall,
    pauseCallingWorkflow,
    resumeCallingWorkflow,
    setCurrentScreen,
    currentTemplate
  } = useApp();

  const nextContactName = activeCallingContact?.name || 'Priya Sharma';
  const nextContactPhone = activeCallingContact?.phone || '+91 9876543211';
  const nextContactId = activeCallingContact?.externalId || '02';
  const initialLetter = nextContactName.charAt(0).toUpperCase();

  const isPaused = callingSession?.state === 'paused';
  const queueIndex = callingSession ? callingSession.currentIndex + 1 : 2;
  const totalInQueue = callingSession ? callingSession.selectedContactIds.length : 20;
  const remainingInQueue = Math.max(0, totalInQueue - queueIndex);

  return (
    <div
      style={{
        flex: 1,
        background: '#FFFFFF',
        padding: '16px 16px 24px',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between'
      }}
    >
      <div>
        {/* Top Bar matching image 12 */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={() => setCurrentScreen('dashboard')}
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', color: 'var(--text-700)' }}
            >
              <ChevronLeft size={22} />
            </button>
            <h2 style={{ fontSize: '17px', fontWeight: 800, color: 'var(--text-900)', margin: 0 }}>
              Next Contact (PRD Section 37)
            </h2>
          </div>

          <span style={{ fontSize: '11px', background: '#EFF6FF', color: '#2563EB', padding: '3px 8px', borderRadius: '6px', fontWeight: 700 }}>
            {queueIndex} of {totalInQueue}
          </span>
        </div>

        {/* Center Contact Presentation matching image 12 */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          {/* Light Purple Circle Avatar with Initial */}
          <div
            style={{
              width: '88px',
              height: '88px',
              borderRadius: '50%',
              background: '#EDE9FE',
              color: '#6D28D9',
              fontSize: '34px',
              fontWeight: 900,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
              boxShadow: '0 8px 20px rgba(109, 40, 217, 0.15)'
            }}
          >
            {initialLetter}
          </div>

          <span style={{ fontSize: '12px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
            Up Next in Queue:
          </span>

          <h3 style={{ fontSize: '20px', fontWeight: 900, color: 'var(--text-900)', margin: '0 0 4px' }}>
            {nextContactName}
          </h3>

          <p style={{ fontSize: '13px', color: 'var(--text-600)', margin: '0 0 2px' }}>
            {currentTemplate.idColumnHeader}: <strong style={{ color: '#1E293B' }}>{nextContactId}</strong> • {activeCallingContact?.department || 'CSE-A'}
          </p>

          <p style={{ fontSize: '14px', color: '#2563EB', fontWeight: 700, margin: 0 }}>
            {nextContactPhone}
          </p>
        </div>

        {/* Buttons matching image 12 (Start Next Call & Skip) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
          <button
            type="button"
            onClick={startNextQueuedCall}
            className="btn-primary"
            style={{
              width: '100%',
              height: '48px',
              fontSize: '15px',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            <Phone size={18} fill="#FFFFFF" />
            <span>START NEXT CALL ({queueIndex}/{totalInQueue})</span>
          </button>

          <button
            type="button"
            onClick={skipCurrentQueuedCall}
            className="btn-secondary"
            style={{
              width: '100%',
              height: '42px',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            <SkipForward size={16} />
            <span>Skip Contact</span>
          </button>
        </div>

        {/* Remaining in Queue Box matching image 12 */}
        <div
          style={{
            border: '1px solid var(--border)',
            borderRadius: '12px',
            padding: '12px 14px',
            textAlign: 'center',
            background: '#F8FAFC',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <span style={{ fontSize: '12px', color: 'var(--text-600)', fontWeight: 600 }}>
            Remaining in Queue:
          </span>
          <strong style={{ fontSize: '16px', color: '#2563EB' }}>
            {remainingInQueue} contacts left
          </strong>
        </div>
      </div>

      {/* Bottom Pause/Resume Control (PRD Section 30 & 31) */}
      <div
        onClick={isPaused ? resumeCallingWorkflow : pauseCallingWorkflow}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          cursor: 'pointer',
          padding: '10px',
          borderRadius: '10px',
          background: '#F1F5F9',
          color: 'var(--text-800)'
        }}
        title="Pause or resume calling queue safely"
      >
        <div
          style={{
            width: '26px',
            height: '26px',
            borderRadius: '50%',
            background: isPaused ? '#2563EB' : '#475569',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {isPaused ? <Play size={12} fill="#FFFFFF" /> : <Pause size={12} />}
        </div>
        <span style={{ fontSize: '12px', fontWeight: 700 }}>
          {isPaused ? 'Resume Calling Queue' : 'Pause Queue (Save Progress)'}
        </span>
      </div>
    </div>
  );
};
