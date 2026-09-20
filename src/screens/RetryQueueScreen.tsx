import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ChevronLeft, RefreshCw, Clock, Phone, AlertCircle, CheckCircle2, Calendar } from 'lucide-react';
import { RetryItem } from '../types';

export const RetryQueueScreen: React.FC = () => {
  const {
    retryQueue,
    startRetryWorkflow,
    retrySingleContact,
    scheduleRetryItem,
    setCurrentScreen,
    showToast,
    currentTemplate
  } = useApp();

  const [activeTab, setActiveTab] = useState<'pending' | 'history'>('pending');
  const [showScheduleModal, setShowScheduleModal] = useState<string | null>(null);

  const getStatusColor = (outcome: string) => {
    switch (outcome) {
      case 'no_answer':
        return { bg: '#FEE2E2', text: '#DC2626', label: 'No Answer' };
      case 'busy':
        return { bg: '#FFEDD5', text: '#C2410C', label: 'Busy' };
      case 'switched_off':
        return { bg: '#FEE2E2', text: '#B91C1C', label: 'Switched Off' };
      case 'callback_required':
        return { bg: '#FEF3C7', text: '#B45309', label: 'Callback Due' };
      default:
        return { bg: '#F1F5F9', text: '#475569', label: outcome };
    }
  };

  const handleScheduleOption = (itemId: string, label: string) => {
    scheduleRetryItem(itemId, label);
    setShowScheduleModal(null);
  };

  return (
    <div
      style={{
        flex: 1,
        padding: '16px 16px 20px',
        overflowY: 'auto',
        background: '#FFFFFF',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'relative'
      }}
    >
      <div>
        {/* Top Bar matching image 14 */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={() => setCurrentScreen('dashboard')}
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', color: 'var(--text-700)' }}
            >
              <ChevronLeft size={22} />
            </button>
            <h2 style={{ fontSize: '17px', fontWeight: 800, color: 'var(--text-900)', margin: 0 }}>
              Re-Attend Queue (PRD Section 28)
            </h2>
          </div>

          <span style={{ fontSize: '11px', background: '#FEF2F2', color: '#DC2626', padding: '3px 8px', borderRadius: '6px', fontWeight: 800 }}>
            {retryQueue.length} Unanswered
          </span>
        </div>

        {/* Tabs (Not Answered vs Retry History) */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '14px' }}>
          <button
            type="button"
            onClick={() => setActiveTab('pending')}
            style={{
              flex: 1,
              padding: '8px 12px',
              borderRadius: '8px',
              border: 'none',
              background: activeTab === 'pending' ? '#2563EB' : '#F1F5F9',
              color: activeTab === 'pending' ? '#FFFFFF' : 'var(--text-600)',
              fontSize: '12px',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            Pending Retry ({retryQueue.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('history')}
            style={{
              flex: 1,
              padding: '8px 12px',
              borderRadius: '8px',
              border: 'none',
              background: activeTab === 'history' ? '#2563EB' : '#F1F5F9',
              color: activeTab === 'history' ? '#FFFFFF' : 'var(--text-600)',
              fontSize: '12px',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            Attempt Log (Max 3)
          </button>
        </div>

        {/* Informative Alert (PRD Section 27: Unreachable contacts never marked completed!) */}
        <div
          style={{
            background: '#FFFBEB',
            border: '1px solid #FDE68A',
            borderRadius: '10px',
            padding: '8px 12px',
            marginBottom: '14px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '11px',
            color: '#92400E'
          }}
        >
          <AlertCircle size={15} color="#D97706" style={{ flexShrink: 0 }} />
          <span>
            Unanswered, busy, and switched off calls stay in retry queue until answered or max retries (3) reached.
          </span>
        </div>

        {/* Table / Cards List */}
        {activeTab === 'pending' ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
            {retryQueue.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '30px 10px' }}>
                <CheckCircle2 size={36} color="#16A34A" style={{ margin: '0 auto 8px' }} />
                <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#1E293B', margin: '0 0 4px' }}>
                  No Pending Retries!
                </h4>
                <p style={{ fontSize: '12px', color: '#64748B', margin: 0 }}>
                  All selected calls for today have been completed.
                </p>
              </div>
            ) : (
              retryQueue.map(item => {
                const badge = getStatusColor(item.outcome);
                return (
                  <div
                    key={item.id}
                    style={{
                      border: '1px solid var(--border)',
                      borderRadius: '10px',
                      padding: '10px 12px',
                      background: '#FFFFFF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontSize: '11px', fontWeight: 800, color: '#64748B' }}>
                          #{item.externalId}
                        </span>
                        <strong style={{ fontSize: '13px', color: 'var(--text-900)' }}>
                          {item.contactName}
                        </strong>
                      </div>
                      <span style={{ fontSize: '11px', color: '#64748B', display: 'block', marginTop: '1px' }}>
                        {item.contactPhone}
                      </span>
                      {item.scheduledTime && (
                        <span style={{ fontSize: '10px', color: '#2563EB', fontWeight: 700, marginTop: '2px', display: 'block' }}>
                          ⏰ Scheduled: {item.scheduledTime}
                        </span>
                      )}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ textAlign: 'right' }}>
                        <span
                          style={{
                            fontSize: '10px',
                            fontWeight: 800,
                            padding: '2px 8px',
                            borderRadius: '99px',
                            background: badge.bg,
                            color: badge.text,
                            display: 'inline-block'
                          }}
                        >
                          {badge.label}
                        </span>
                        <span style={{ fontSize: '10px', color: '#64748B', display: 'block', marginTop: '2px' }}>
                          Attempt {item.retryCount} of {item.maxRetries}
                        </span>
                      </div>

                      <button
                        onClick={() => retrySingleContact(item)}
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '8px',
                          background: '#EFF6FF',
                          border: '1px solid #BFDBFE',
                          color: '#2563EB',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer'
                        }}
                        title="Call single contact now"
                      >
                        <Phone size={14} />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        ) : (
          /* Attempt History Tab (PRD Section 29) */
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
            {retryQueue.map(item => (
              <div key={item.id} style={{ border: '1px solid #E2E8F0', borderRadius: '10px', padding: '10px 12px', background: '#F8FAFC' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <strong style={{ fontSize: '12px', color: '#1E293B' }}>{item.contactName} (#{item.externalId})</strong>
                  <span style={{ fontSize: '11px', color: '#DC2626', fontWeight: 700 }}>Total Attempts: {item.retryCount}/3</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  {item.attempts.map(att => (
                    <div key={att.attemptNumber} style={{ fontSize: '11px', color: '#475569', display: 'flex', justifyContent: 'space-between' }}>
                      <span>Attempt {att.attemptNumber}: {att.outcome.replace('_', ' ')}</span>
                      <span style={{ color: '#64748B' }}>{att.reason || 'Not Picked'}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Buttons matching image 14 & PRD Section 28 (START RE-ATTEND & Schedule for Later) */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <button
          type="button"
          onClick={startRetryWorkflow}
          disabled={retryQueue.length === 0}
          className="btn-primary"
          style={{
            width: '100%',
            height: '46px',
            fontSize: '14px',
            fontWeight: 800,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            opacity: retryQueue.length === 0 ? 0.6 : 1
          }}
        >
          <RefreshCw size={16} />
          <span>START RE-ATTEND ({retryQueue.length} Contacts)</span>
        </button>

        <button
          type="button"
          onClick={() => {
            if (retryQueue.length > 0) {
              setShowScheduleModal(retryQueue[0].id);
            } else {
              showToast('No contacts in retry queue to schedule');
            }
          }}
          className="btn-secondary"
          style={{
            width: '100%',
            height: '42px',
            fontSize: '13px',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px'
          }}
        >
          <Clock size={16} />
          <span>Schedule for Later (Section 65)</span>
        </button>
      </div>

      {/* Schedule Callback Options Modal (PRD Section 65 & 66) */}
      {showScheduleModal && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.7)',
            backdropFilter: 'blur(3px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            zIndex: 40
          }}
        >
          <div style={{ background: '#FFFFFF', borderRadius: '16px', padding: '18px', width: '100%', maxWidth: '320px' }}>
            <h4 style={{ fontSize: '14px', fontWeight: 800, color: '#1E293B', margin: '0 0 6px' }}>
              Schedule Callback (Section 65)
            </h4>
            <p style={{ fontSize: '11px', color: '#64748B', margin: '0 0 14px' }}>
              Configure automatic retry timer for unanswered contacts:
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '14px' }}>
              <button
                onClick={() => handleScheduleOption(showScheduleModal, 'In 2 Hours (11:30 AM)')}
                style={{
                  padding: '8px 12px',
                  borderRadius: '8px',
                  border: '1px solid #E2E8F0',
                  background: '#F8FAFC',
                  fontSize: '12px',
                  fontWeight: 600,
                  color: '#1E293B',
                  textAlign: 'left',
                  cursor: 'pointer'
                }}
              >
                ⏱ Retry in 2 Hours (Recommended)
              </button>
              <button
                onClick={() => handleScheduleOption(showScheduleModal, 'Tomorrow at 10:00 AM')}
                style={{
                  padding: '8px 12px',
                  borderRadius: '8px',
                  border: '1px solid #E2E8F0',
                  background: '#F8FAFC',
                  fontSize: '12px',
                  fontWeight: 600,
                  color: '#1E293B',
                  textAlign: 'left',
                  cursor: 'pointer'
                }}
              >
                📅 Tomorrow at 10:00 AM
              </button>
              <button
                onClick={() => handleScheduleOption(showScheduleModal, 'After 5:00 PM Today')}
                style={{
                  padding: '8px 12px',
                  borderRadius: '8px',
                  border: '1px solid #E2E8F0',
                  background: '#F8FAFC',
                  fontSize: '12px',
                  fontWeight: 600,
                  color: '#1E293B',
                  textAlign: 'left',
                  cursor: 'pointer'
                }}
              >
                🌆 Evening Batch (After 5:00 PM)
              </button>
            </div>

            <button
              onClick={() => setShowScheduleModal(null)}
              className="btn-secondary"
              style={{ width: '100%', height: '36px', fontSize: '12px' }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
