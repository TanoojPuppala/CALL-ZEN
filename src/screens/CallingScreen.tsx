import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  Volume2,
  Mic,
  MicOff,
  Grid,
  PhoneOff,
  Phone,
  Pause,
  SkipForward,
  FileText,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { CallOutcome } from '../types';

export const CallingScreen: React.FC = () => {
  const {
    activeCallingContact,
    callingSession,
    endActiveCall,
    pauseCallingWorkflow,
    skipCurrentQueuedCall,
    currentTemplate,
    showToast
  } = useApp();

  const [callState, setCallState] = useState<'idle' | 'calling' | 'connected'>('idle');
  const [durationSeconds, setDurationSeconds] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeaker, setIsSpeaker] = useState(false);
  const [noteText, setNoteText] = useState('');
  const [showNoteModal, setShowNoteModal] = useState(false);

  // Timer while connected
  useEffect(() => {
    let interval: any = null;
    if (callState === 'connected') {
      interval = setInterval(() => {
        setDurationSeconds(s => s + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [callState]);

  const contactName = activeCallingContact?.name || 'Contact';
  const contactPhone = activeCallingContact?.phone || '';
  const contactId = activeCallingContact?.externalId || 'ID';
  const campaignName = callingSession?.campaignName || currentTemplate.primaryCampaignName;
  const queueIndex = callingSession ? callingSession.currentIndex + 1 : 0;
  const queueTotal = callingSession ? callingSession.selectedContactIds.length : 0;
  const initialLetter = contactName.charAt(0).toUpperCase();

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
    const secs = (totalSeconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  // PRD Section 21: Native Phone Calling Launch
  const handleLaunchCall = () => {
    setCallState('calling');
    showToast(`Launching native phone dialer for ${contactName}...`);

    // Launch native phone dialer protocol
    if (typeof window !== 'undefined') {
      try {
        window.open(`tel:${contactPhone}`, '_self');
      } catch (e) {
        // Handled silently
      }
    }

    // Simulate connection after 2 seconds
    setTimeout(() => {
      setCallState('connected');
    }, 1800);
  };

  const handleEndCall = (outcomeHint?: CallOutcome) => {
    const finalDuration = durationSeconds > 0 ? durationSeconds : 65;
    endActiveCall(finalDuration, outcomeHint || 'answered');
  };

  return (
    <div
      style={{
        flex: 1,
        background: '#111827',
        color: '#FFFFFF',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '16px 18px 24px',
        userSelect: 'none',
        position: 'relative'
      }}
    >
      {/* Top Header Tracker (PRD Section 20) */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <span style={{ fontSize: '11px', color: '#93C5FD', fontWeight: 700, textTransform: 'uppercase' }}>
            {campaignName}
          </span>
          <div style={{ fontSize: '13px', fontWeight: 800, color: '#F1F5F9' }}>
            Queue: {queueIndex} / {queueTotal}
          </div>
        </div>

        <button
          onClick={pauseCallingWorkflow}
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            color: '#FFFFFF',
            borderRadius: '8px',
            padding: '6px 10px',
            fontSize: '11px',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}
          title="Pause calling session (PRD Section 30)"
        >
          <Pause size={13} />
          <span>Pause</span>
        </button>
      </div>

      {/* Center Contact Profile (PRD Section 20) */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: 'auto 0' }}>
        {/* Avatar with Ring */}
        <div style={{ position: 'relative', marginBottom: '20px' }}>
          {callState === 'connected' && (
            <div
              style={{
                position: 'absolute',
                inset: '-8px',
                borderRadius: '50%',
                background: 'rgba(34, 197, 94, 0.25)',
                animation: 'pulse 2s infinite'
              }}
            />
          )}
          <div
            style={{
              width: '92px',
              height: '92px',
              borderRadius: '50%',
              background: '#374151',
              color: '#FFFFFF',
              fontSize: '36px',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
              border: callState === 'connected' ? '3px solid #22C55E' : '3px solid #4B5563'
            }}
          >
            {initialLetter}
          </div>
        </div>

        {/* Status indicator */}
        <span
          style={{
            fontSize: '12px',
            color: callState === 'connected' ? '#4ADE80' : '#9CA3AF',
            marginBottom: '4px',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          {callState === 'idle' && 'Ready to Call (Human Control)'}
          {callState === 'calling' && 'Dialing Native Phone...'}
          {callState === 'connected' && `Call in Progress • ${formatTimer(durationSeconds)}`}
        </span>

        {/* Contact Name & Details */}
        <h2 style={{ fontSize: '22px', fontWeight: 900, color: '#FFFFFF', margin: '0 0 4px', textAlign: 'center' }}>
          {contactName}
        </h2>

        <p style={{ fontSize: '13px', color: '#94A3B8', margin: '0 0 4px' }}>
          {currentTemplate.idColumnHeader}: <strong style={{ color: '#F8FAFC' }}>{contactId}</strong> • {activeCallingContact?.department || 'CSE-A'}
        </p>

        <p style={{ fontSize: '15px', color: '#60A5FA', fontWeight: 700, margin: 0 }}>
          {contactPhone}
        </p>

        {/* Audio Wave Visualizer while connected */}
        {callState === 'connected' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', height: '24px', marginTop: '16px' }}>
            <span style={{ width: '3px', height: '14px', background: '#22C55E', borderRadius: '99px', animation: 'bounce 0.8s infinite' }} />
            <span style={{ width: '3px', height: '22px', background: '#22C55E', borderRadius: '99px', animation: 'bounce 0.6s infinite 0.1s' }} />
            <span style={{ width: '3px', height: '18px', background: '#22C55E', borderRadius: '99px', animation: 'bounce 0.9s infinite 0.2s' }} />
            <span style={{ width: '3px', height: '26px', background: '#22C55E', borderRadius: '99px', animation: 'bounce 0.7s infinite 0.15s' }} />
            <span style={{ width: '3px', height: '16px', background: '#22C55E', borderRadius: '99px', animation: 'bounce 0.85s infinite 0.25s' }} />
          </div>
        )}
      </div>

      {/* Action Controls based on Call State */}
      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
        {callState === 'idle' ? (
          /* Big Green CALL NOW Button (PRD Section 20 & 21) */
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <button
              onClick={handleLaunchCall}
              style={{
                width: '100%',
                height: '52px',
                borderRadius: '14px',
                background: '#16A34A',
                border: 'none',
                color: '#FFFFFF',
                fontSize: '16px',
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                cursor: 'pointer',
                boxShadow: '0 8px 25px rgba(22, 163, 74, 0.45)'
              }}
            >
              <Phone size={20} fill="#FFFFFF" />
              <span>CALL NOW</span>
            </button>

            {/* Quick Fast-Outcome buttons (e.g. if phone was unreachable immediately) */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
              <button
                onClick={() => handleEndCall('no_answer')}
                style={{
                  background: 'rgba(255,255,255,0.08)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  color: '#CBD5E1',
                  padding: '7px 4px',
                  borderRadius: '8px',
                  fontSize: '11px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                No Answer
              </button>
              <button
                onClick={() => handleEndCall('busy')}
                style={{
                  background: 'rgba(255,255,255,0.08)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  color: '#CBD5E1',
                  padding: '7px 4px',
                  borderRadius: '8px',
                  fontSize: '11px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Busy
              </button>
              <button
                onClick={() => handleEndCall('switched_off')}
                style={{
                  background: 'rgba(255,255,255,0.08)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  color: '#CBD5E1',
                  padding: '7px 4px',
                  borderRadius: '8px',
                  fontSize: '11px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Switched Off
              </button>
            </div>
          </div>
        ) : (
          /* Active Call Controls Row: Speaker, Mute, Keypad, Note + Big Red End Call */
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '24px' }}>
              {/* Speaker */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                <button
                  onClick={() => setIsSpeaker(!isSpeaker)}
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    background: isSpeaker ? '#4B5563' : '#1F2937',
                    border: '1px solid #374151',
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer'
                  }}
                >
                  <Volume2 size={20} />
                </button>
                <span style={{ fontSize: '11px', color: '#D1D5DB' }}>Speaker</span>
              </div>

              {/* Mute */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    background: isMuted ? '#4B5563' : '#1F2937',
                    border: '1px solid #374151',
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer'
                  }}
                >
                  {isMuted ? <MicOff size={20} /> : <Mic size={20} />}
                </button>
                <span style={{ fontSize: '11px', color: '#D1D5DB' }}>Mute</span>
              </div>

              {/* Add Note (Section 20) */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                <button
                  onClick={() => setShowNoteModal(true)}
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    background: noteText ? '#2563EB' : '#1F2937',
                    border: '1px solid #374151',
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer'
                  }}
                >
                  <FileText size={20} />
                </button>
                <span style={{ fontSize: '11px', color: '#D1D5DB' }}>Note</span>
              </div>
            </div>

            {/* Big Red Circular End Call Button */}
            <button
              onClick={() => handleEndCall('answered')}
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: '#EF4444',
                border: 'none',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0 8px 24px rgba(239, 68, 68, 0.45)'
              }}
              title="End Call & Record Report"
            >
              <PhoneOff size={28} />
            </button>
          </div>
        )}

        {/* Secondary Bar: Skip & In-Call note hint */}
        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', fontSize: '12px', color: '#94A3B8' }}>
          <button
            onClick={skipCurrentQueuedCall}
            style={{
              background: 'none',
              border: 'none',
              color: '#94A3B8',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '12px'
            }}
          >
            <SkipForward size={14} />
            <span>Skip Contact</span>
          </button>

          <span style={{ fontStyle: 'italic', fontSize: '11px' }}>
            Human call • Not an AI robot
          </span>
        </div>
      </div>

      {/* In-Call Note Modal */}
      {showNoteModal && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.85)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            zIndex: 30
          }}
        >
          <div style={{ background: '#1E293B', borderRadius: '16px', padding: '18px', width: '100%', maxWidth: '320px' }}>
            <h4 style={{ fontSize: '14px', fontWeight: 800, color: '#FFFFFF', margin: '0 0 10px' }}>
              Add In-Call Note
            </h4>
            <textarea
              value={noteText}
              onChange={e => setNoteText(e.target.value)}
              placeholder="e.g. Student reported fever, will submit leave letter..."
              rows={3}
              style={{
                width: '100%',
                background: '#0F172A',
                color: '#FFFFFF',
                border: '1px solid #334155',
                borderRadius: '8px',
                padding: '8px 10px',
                fontSize: '12px',
                outline: 'none',
                resize: 'none',
                marginBottom: '12px'
              }}
            />
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => setShowNoteModal(false)}
                className="btn-secondary"
                style={{ flex: 1, height: '36px', fontSize: '12px' }}
              >
                Close
              </button>
              <button
                onClick={() => {
                  setShowNoteModal(false);
                  showToast('Note saved with active call');
                }}
                className="btn-primary"
                style={{ flex: 1, height: '36px', fontSize: '12px' }}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
