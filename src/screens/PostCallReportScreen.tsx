import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ChevronLeft, Check, Sparkles, Mic, Calendar, Clock, Edit2, CheckCircle2 } from 'lucide-react';
import { CallOutcome } from '../types';

export const PostCallReportScreen: React.FC = () => {
  const {
    activeCallingContact,
    callingSession,
    confirmPostCallReport,
    currentPendingReport,
    setCurrentScreen,
    currentTemplate,
    showToast
  } = useApp();

  const [outcome, setOutcome] = useState<CallOutcome>(currentPendingReport?.outcome || 'answered');
  const [reason, setReason] = useState<string>(currentPendingReport?.reason || 'Fever');
  const [followUpRequired, setFollowUpRequired] = useState<boolean>(currentPendingReport?.followUpRequired || false);
  const [followUpDate, setFollowUpDate] = useState<string>(
    currentPendingReport?.followUpDate || new Date(Date.now() + 86400000).toISOString().split('T')[0]
  );
  const [isEditing, setIsEditing] = useState(false);
  const [voiceSpoken, setVoiceSpoken] = useState<string>('');

  const contactName = activeCallingContact?.name || 'Contact';
  const contactPhone = activeCallingContact?.phone || '';
  const durationSec = currentPendingReport?.durationSeconds || 0;
  const initialLetter = contactName.charAt(0).toUpperCase();

  const outcomeOptions: Array<{ key: CallOutcome; label: string; icon: string; bg: string; color: string }> = [
    { key: 'answered', label: 'Answered', icon: '✓', bg: '#DCFCE7', color: '#15803D' },
    { key: 'callback_required', label: 'Callback', icon: '◷', bg: '#FEF3C7', color: '#B45309' },
    { key: 'no_answer', label: 'No Answer', icon: '✕', bg: '#FEE2E2', color: '#DC2626' },
    { key: 'switched_off', label: 'Switched Off', icon: '📵', bg: '#FEE2E2', color: '#DC2626' },
    { key: 'busy', label: 'Busy', icon: '📞', bg: '#FFEDD5', color: '#C2410C' },
    { key: 'wrong_number', label: 'Wrong No', icon: '❌', bg: '#F3F4F6', color: '#4B5563' },
    { key: 'not_required', label: 'Not Req', icon: '—', bg: '#F3F4F6', color: '#6B7280' }
  ];

  const handleVoiceChip = (spokenText: string, suggestedReason: string, suggestedOutcome: CallOutcome, hasFollowUp: boolean) => {
    setVoiceSpoken(spokenText);
    setReason(suggestedReason);
    setOutcome(suggestedOutcome);
    setFollowUpRequired(hasFollowUp);
    showToast(`AI Structured: "${suggestedReason}"`);
  };

  const handleConfirmAndNext = () => {
    confirmPostCallReport({
      outcome,
      reason,
      followUpRequired,
      followUpDate: followUpRequired ? followUpDate : undefined,
      durationSeconds: durationSec,
      voiceTranscribed: voiceSpoken || undefined
    });
  };

  return (
    <div
      style={{
        flex: 1,
        background: '#FFFFFF',
        padding: '16px 16px 20px',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between'
      }}
    >
      <div>
        {/* Top Bar matching image 11 */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <button
            onClick={() => setCurrentScreen('student_list')}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', color: 'var(--text-700)' }}
          >
            <ChevronLeft size={22} />
          </button>
          <span style={{ fontSize: '12px', fontWeight: 700, color: '#64748B' }}>
            Queue {callingSession ? `${callingSession.currentIndex + 1} of ${callingSession.selectedContactIds.length}` : '1 of 20'}
          </span>
        </div>

        {/* Center Green Checkmark & Call Ended */}
        <div style={{ textAlign: 'center', marginBottom: '14px' }}>
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '50%',
              background: '#22C55E',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 6px',
              boxShadow: '0 4px 12px rgba(34, 197, 94, 0.3)'
            }}
          >
            <Check size={24} strokeWidth={3} />
          </div>
          <h2 style={{ fontSize: '17px', fontWeight: 800, color: 'var(--text-900)', margin: 0 }}>
            Call Ended
          </h2>
        </div>

        {/* Contact Summary Card */}
        <div
          style={{
            border: '1px solid var(--border)',
            borderRadius: '12px',
            padding: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '14px',
            background: '#FFFFFF'
          }}
        >
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '50%',
              background: '#EDE9FE',
              color: '#6D28D9',
              fontSize: '18px',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}
          >
            {initialLetter}
          </div>
          <div>
            <h3 style={{ fontSize: '14px', fontWeight: 800, color: 'var(--text-900)', margin: '0 0 2px' }}>
              {contactName}
            </h3>
            <p style={{ fontSize: '11px', color: 'var(--text-500)', margin: '0 0 2px' }}>
              {currentTemplate.idColumnHeader}: {activeCallingContact?.externalId || '01'} • {contactPhone}
            </p>
            <p style={{ fontSize: '11px', color: '#2563EB', margin: 0, fontWeight: 700 }}>
              Call Duration: {Math.floor(durationSec / 60)}m {durationSec % 60}s
            </p>
          </div>
        </div>

        {/* PRD Section 22: Fast Call Outcome Selector (7 Options) */}
        <div style={{ marginBottom: '14px' }}>
          <label style={{ display: 'block', fontSize: '11px', fontWeight: 800, color: '#475569', textTransform: 'uppercase', marginBottom: '6px' }}>
            What happened? (Section 22)
          </label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {outcomeOptions.map(opt => {
              const isSelected = outcome === opt.key;
              return (
                <button
                  key={opt.key}
                  type="button"
                  onClick={() => setOutcome(opt.key)}
                  style={{
                    padding: '5px 10px',
                    borderRadius: '8px',
                    border: isSelected ? `2px solid ${opt.color}` : '1px solid #E2E8F0',
                    background: isSelected ? opt.bg : '#FFFFFF',
                    color: isSelected ? opt.color : '#475569',
                    fontSize: '11px',
                    fontWeight: isSelected ? 800 : 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <span>{opt.icon}</span>
                  <span>{opt.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* AI Suggested Structured Report Card (PRD Section 23 & 25) */}
        <div
          style={{
            border: '1.5px solid #BBF7D0',
            background: '#F0FDF4',
            borderRadius: '12px',
            padding: '12px 14px',
            marginBottom: '12px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Sparkles size={15} color="#16A34A" />
              <h4 style={{ fontSize: '12px', fontWeight: 800, color: '#15803D', margin: 0 }}>
                Structured Call Report
              </h4>
            </div>
            <button
              onClick={() => setIsEditing(!isEditing)}
              style={{ background: 'none', border: 'none', color: '#15803D', fontSize: '11px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '2px' }}
            >
              <Edit2 size={12} />
              <span>{isEditing ? 'Done' : 'Edit'}</span>
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px' }}>
            {/* Status */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ color: '#475569', fontWeight: 600 }}>Status:</span>
              <span
                style={{
                  background: outcome === 'answered' ? '#DCFCE7' : '#FEE2E2',
                  color: outcome === 'answered' ? '#15803D' : '#DC2626',
                  padding: '2px 10px',
                  borderRadius: '99px',
                  fontSize: '11px',
                  fontWeight: 800,
                  textTransform: 'capitalize'
                }}
              >
                {outcome.replace('_', ' ')}
              </span>
            </div>

            {/* Reason */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ color: '#475569', fontWeight: 600 }}>Reason:</span>
              {isEditing ? (
                <input
                  type="text"
                  value={reason}
                  onChange={e => setReason(e.target.value)}
                  style={{
                    border: '1px solid #86EFAC',
                    background: '#FFFFFF',
                    borderRadius: '6px',
                    padding: '2px 6px',
                    fontSize: '11px',
                    fontWeight: 700,
                    width: '140px',
                    textAlign: 'right'
                  }}
                />
              ) : (
                <span style={{ fontWeight: 800, color: '#166534' }}>{reason}</span>
              )}
            </div>

            {/* Follow-up */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ color: '#475569', fontWeight: 600 }}>Follow-up:</span>
              <span style={{ fontWeight: 700, color: followUpRequired ? '#D97706' : '#64748B' }}>
                {followUpRequired ? `Required on ${followUpDate}` : 'Not Required'}
              </span>
            </div>
          </div>
        </div>

        {/* PRD Section 24: Voice Report Input Presets ("Tell me what happened") */}
        <div style={{ marginBottom: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
            <Mic size={14} color="#2563EB" />
            <span style={{ fontSize: '11px', fontWeight: 800, color: '#1E40AF' }}>
              Tell me what happened (Voice Input / Quick Presets):
            </span>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            <button
              type="button"
              onClick={() => handleVoiceChip('Rahul said he has fever', 'Fever', 'answered', false)}
              style={{
                background: '#EFF6FF',
                border: '1px solid #BFDBFE',
                borderRadius: '8px',
                padding: '4px 8px',
                fontSize: '10px',
                fontWeight: 600,
                color: '#1D4ED8',
                cursor: 'pointer'
              }}
            >
              🗣 "He has fever"
            </button>
            <button
              type="button"
              onClick={() => handleVoiceChip('He is attending tomorrow because he was sick today', 'Reported Illness', 'answered', true)}
              style={{
                background: '#EFF6FF',
                border: '1px solid #BFDBFE',
                borderRadius: '8px',
                padding: '4px 8px',
                fontSize: '10px',
                fontWeight: 600,
                color: '#1D4ED8',
                cursor: 'pointer'
              }}
            >
              🗣 "Attending tomorrow"
            </button>
            <button
              type="button"
              onClick={() => handleVoiceChip('Family function at native place', 'Family Function', 'answered', true)}
              style={{
                background: '#EFF6FF',
                border: '1px solid #BFDBFE',
                borderRadius: '8px',
                padding: '4px 8px',
                fontSize: '10px',
                fontWeight: 600,
                color: '#1D4ED8',
                cursor: 'pointer'
              }}
            >
              🗣 "Family function"
            </button>
            <button
              type="button"
              onClick={() => handleVoiceChip('Phone rang but no response', 'Not Picked', 'no_answer', true)}
              style={{
                background: '#FEF2F2',
                border: '1px solid #FECACA',
                borderRadius: '8px',
                padding: '4px 8px',
                fontSize: '10px',
                fontWeight: 600,
                color: '#DC2626',
                cursor: 'pointer'
              }}
            >
              🗣 "No answer / Ringing"
            </button>
          </div>
        </div>
      </div>

      {/* Action Buttons matching PRD Section 25 & 59 (Edit & CONFIRM & NEXT) */}
      <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
        <button
          type="button"
          onClick={() => {
            setIsEditing(!isEditing);
            showToast(isEditing ? 'Saved report changes' : 'Edit report fields');
          }}
          className="btn-secondary"
          style={{ flex: 1, height: '44px', fontWeight: 700 }}
        >
          {isEditing ? 'Done' : 'Edit'}
        </button>

        <button
          type="button"
          onClick={handleConfirmAndNext}
          className="btn-primary"
          style={{ flex: 2, height: '44px', fontWeight: 800, fontSize: '13px' }}
        >
          CONFIRM & NEXT →
        </button>
      </div>
    </div>
  );
};
