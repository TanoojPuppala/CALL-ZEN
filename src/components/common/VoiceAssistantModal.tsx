import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { voiceAssistant, VoiceCommandResult } from '../../services/voiceAssistant';
import { Mic, MicOff, X, Sparkles, Volume2, AlertCircle, CheckCircle2, UserCheck, Layers, Phone } from 'lucide-react';
import { Contact } from '../../types';

export const VoiceAssistantModal: React.FC = () => {
  const {
    isVoiceAssistantOpen,
    setIsVoiceAssistantOpen,
    contacts,
    selectedContactIds,
    toggleSelectContact,
    setCurrentScreen,
    pauseCallingWorkflow,
    resumeCallingWorkflow,
    startNextQueuedCall,
    showToast,
    campaigns,
    currentPendingReport,
    setCurrentPendingReport
  } = useApp();

  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState<string>('');
  const [lastResult, setLastResult] = useState<VoiceCommandResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (isVoiceAssistantOpen) {
      handleToggleListen();
    } else {
      voiceAssistant.stopListening();
      setIsListening(false);
      setLastResult(null);
      setErrorMsg(null);
    }
  }, [isVoiceAssistantOpen]);

  const handleToggleListen = () => {
    if (isListening) {
      voiceAssistant.stopListening();
      setIsListening(false);
    } else {
      setErrorMsg(null);
      setTranscript('Listening... Speak your command now.');

      voiceAssistant.startListening(
        contacts,
        selectedContactIds,
        campaigns,
        result => {
          setTranscript(result.rawTranscript);
          setLastResult(result);
          processCommandResult(result);
        },
        err => {
          setErrorMsg(err);
          setIsListening(false);
        },
        state => {
          setIsListening(state);
        }
      );
    }
  };

  const handleSimulateCommand = (phrase: string) => {
    setTranscript(phrase);
    setErrorMsg(null);
    const result = voiceAssistant.parseCommand(phrase, contacts, selectedContactIds, campaigns);
    setLastResult(result);
    voiceAssistant.speak(result.responseMessage);
    processCommandResult(result);
  };

  const processCommandResult = (result: VoiceCommandResult) => {
    switch (result.intent) {
      case 'CALL_CONTACT':
        if (result.matchedContact && selectedContactIds.includes(result.matchedContact.id)) {
          showToast(`Voice matched: Calling ${result.matchedContact.name}`);
          setTimeout(() => {
            setIsVoiceAssistantOpen(false);
            setCurrentScreen('calling');
          }, 1200);
        }
        break;

      case 'PAUSE_CALLING':
        pauseCallingWorkflow();
        setTimeout(() => setIsVoiceAssistantOpen(false), 1200);
        break;

      case 'RESUME_CALLING':
        resumeCallingWorkflow();
        setTimeout(() => setIsVoiceAssistantOpen(false), 1200);
        break;

      case 'CALL_NEXT':
        startNextQueuedCall();
        setTimeout(() => setIsVoiceAssistantOpen(false), 1200);
        break;

      case 'SHOW_PENDING':
        setCurrentScreen('student_list');
        setTimeout(() => setIsVoiceAssistantOpen(false), 1200);
        break;

      case 'SHOW_REPORT':
      case 'SHOW_PROGRESS':
        setCurrentScreen('reports');
        setTimeout(() => setIsVoiceAssistantOpen(false), 1200);
        break;

      case 'SHOW_RETRY':
        setCurrentScreen('retry_queue');
        setTimeout(() => setIsVoiceAssistantOpen(false), 1200);
        break;

      case 'DICTATE_REPORT':
        if (result.parsedReport) {
          if (currentPendingReport) {
            setCurrentPendingReport({
              ...currentPendingReport,
              outcome: result.parsedReport.status,
              reason: result.parsedReport.reason,
              followUpRequired: result.parsedReport.followUp !== 'Not Required',
              followUpDate: result.parsedReport.followUpDate,
              voiceTranscribed: result.rawTranscript
            });
          }
          showToast(`Voice report captured: ${result.parsedReport.reason}`);
          setTimeout(() => setIsVoiceAssistantOpen(false), 1400);
        }
        break;

      default:
        break;
    }
  };

  const handleSelectDisambiguatedContact = (candidate: Contact) => {
    const isSelected = selectedContactIds.includes(candidate.id);
    if (!isSelected) {
      toggleSelectContact(candidate.id);
      showToast(`Selected ${candidate.name}. Ready to call.`);
    }
    voiceAssistant.speak(`Selected ${candidate.name}.`);
    setTimeout(() => {
      setIsVoiceAssistantOpen(false);
      setCurrentScreen('ready_to_call');
    }, 900);
  };

  if (!isVoiceAssistantOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.7)',
        backdropFilter: 'blur(5px)',
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        zIndex: 100
      }}
      onClick={() => setIsVoiceAssistantOpen(false)}
    >
      <div
        style={{
          background: '#FFFFFF',
          width: '100%',
          maxWidth: '440px',
          borderTopLeftRadius: '24px',
          borderTopRightRadius: '24px',
          padding: '20px 18px 28px',
          boxShadow: '0 -10px 30px rgba(0,0,0,0.25)',
          maxHeight: '85vh',
          overflowY: 'auto'
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: '#EFF6FF',
                color: '#2563EB',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Sparkles size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                SmartCall Assistant
              </h3>
              <p style={{ fontSize: '11px', color: '#64748B', margin: 0 }}>
                Google Assistant-style command engine
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsVoiceAssistantOpen(false)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B', padding: '4px' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Microphone Button with Pulsing Wave Visualizer */}
        <div style={{ textAlign: 'center', margin: '14px 0 18px' }}>
          <div style={{ position: 'relative', display: 'inline-block' }}>
            {isListening && (
              <div
                style={{
                  position: 'absolute',
                  inset: '-10px',
                  borderRadius: '50%',
                  background: 'rgba(37, 99, 235, 0.25)',
                  animation: 'ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite'
                }}
              />
            )}
            <button
              onClick={handleToggleListen}
              style={{
                width: '68px',
                height: '68px',
                borderRadius: '50%',
                background: isListening ? '#EF4444' : '#2563EB',
                color: '#FFFFFF',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: isListening
                  ? '0 8px 25px rgba(239, 68, 68, 0.45)'
                  : '0 8px 25px rgba(37, 99, 235, 0.45)',
                position: 'relative',
                zIndex: 2,
                transition: 'all 0.2s ease'
              }}
            >
              {isListening ? <MicOff size={28} /> : <Mic size={28} />}
            </button>
          </div>

          <div style={{ marginTop: '10px' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: isListening ? '#DC2626' : '#2563EB' }}>
              {isListening ? 'Listening for command...' : 'Tap mic or click any sample command below'}
            </span>
          </div>

          {/* Transcript / Spoken Feedback Box */}
          <div
            style={{
              marginTop: '12px',
              padding: '12px 14px',
              background: '#F8FAFC',
              borderRadius: '12px',
              border: '1px solid #E2E8F0',
              textAlign: 'left'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
              <Volume2 size={13} color="#2563EB" />
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#2563EB', textTransform: 'uppercase' }}>
                Command Heard:
              </span>
            </div>
            <p style={{ fontSize: '13px', fontWeight: 600, color: '#1E293B', margin: 0, fontStyle: transcript ? 'normal' : 'italic' }}>
              {transcript || 'No voice input yet. Say: "Call Rahul", "Next person", "Pause calling"...'}
            </p>
          </div>
        </div>

        {/* SECTION 35: MULTIPLE MATCHES DISAMBIGUATION MODAL INLINE */}
        {lastResult?.intent === 'DISAMBIGUATE_CONTACT' && lastResult.matchedCandidates && (
          <div
            style={{
              background: '#FEF3C7',
              border: '1.5px solid #F59E0B',
              borderRadius: '12px',
              padding: '14px',
              marginBottom: '16px',
              animation: 'fadeIn 0.2s ease'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <AlertCircle size={18} color="#D97706" />
              <h4 style={{ fontSize: '13px', fontWeight: 800, color: '#92400E', margin: 0 }}>
                Disambiguation Required (Section 35)
              </h4>
            </div>
            <p style={{ fontSize: '12px', color: '#78350F', margin: '0 0 10px', lineHeight: 1.4 }}>
              {lastResult.responseMessage}
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {lastResult.matchedCandidates.map(candidate => {
                const inQueue = selectedContactIds.includes(candidate.id);
                return (
                  <button
                    key={candidate.id}
                    onClick={() => handleSelectDisambiguatedContact(candidate)}
                    style={{
                      background: '#FFFFFF',
                      border: '1px solid #FCD34D',
                      borderRadius: '8px',
                      padding: '8px 12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: 'pointer',
                      textAlign: 'left'
                    }}
                  >
                    <div>
                      <strong style={{ fontSize: '12px', color: '#1E293B' }}>{candidate.name}</strong>
                      <span style={{ fontSize: '11px', color: '#64748B', display: 'block' }}>
                        ID: {candidate.externalId} • {candidate.department || 'CSE-A'}
                      </span>
                    </div>
                    <span
                      style={{
                        fontSize: '11px',
                        padding: '2px 8px',
                        borderRadius: '99px',
                        background: inQueue ? '#DCFCE7' : '#EFF6FF',
                        color: inQueue ? '#15803D' : '#1D4ED8',
                        fontWeight: 700
                      }}
                    >
                      {inQueue ? 'In Queue ✓' : 'Select & Call'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Safety Warning (Not in queue) */}
        {lastResult?.safetyWarning && (
          <div
            style={{
              background: '#FEE2E2',
              border: '1px solid #FCA5A5',
              borderRadius: '10px',
              padding: '10px 12px',
              marginBottom: '14px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <AlertCircle size={16} color="#DC2626" />
            <span style={{ fontSize: '12px', color: '#991B1B', fontWeight: 600 }}>
              {lastResult.safetyWarning}
            </span>
          </div>
        )}

        {/* Quick Sample Voice Command Presets (Section 33 & 36) */}
        <div>
          <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>
            Quick Simulated Commands (PRD Section 33):
          </span>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            <button
              onClick={() => handleSimulateCommand('Call Rahul')}
              style={{
                background: '#FEF3C7',
                border: '1px solid #FDE68A',
                color: '#92400E',
                borderRadius: '8px',
                padding: '6px 10px',
                fontSize: '11px',
                fontWeight: 700,
                cursor: 'pointer'
              }}
              title="Demonstrates Section 35 disambiguation with multiple Rahuls"
            >
              🗣 "Call Rahul" (Disambiguate)
            </button>

            <button
              onClick={() => handleSimulateCommand('Call Rahul Kumar')}
              style={{
                background: '#EFF6FF',
                border: '1px solid #DBEAFE',
                color: '#1D4ED8',
                borderRadius: '8px',
                padding: '6px 10px',
                fontSize: '11px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              🗣 "Call Rahul Kumar"
            </button>

            <button
              onClick={() => handleSimulateCommand('Call Rahul from CSE')}
              style={{
                background: '#EFF6FF',
                border: '1px solid #DBEAFE',
                color: '#1D4ED8',
                borderRadius: '8px',
                padding: '6px 10px',
                fontSize: '11px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              🗣 "Call Rahul from CSE"
            </button>

            <button
              onClick={() => handleSimulateCommand('Call the next person')}
              style={{
                background: '#F0FDF4',
                border: '1px solid #BBF7D0',
                color: '#15803D',
                borderRadius: '8px',
                padding: '6px 10px',
                fontSize: '11px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              🗣 "Next person"
            </button>

            <button
              onClick={() => handleSimulateCommand('Pause calling')}
              style={{
                background: '#F8FAFC',
                border: '1px solid #E2E8F0',
                color: '#475569',
                borderRadius: '8px',
                padding: '6px 10px',
                fontSize: '11px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              🗣 "Pause calling"
            </button>

            <button
              onClick={() => handleSimulateCommand('Show people who didn\'t answer')}
              style={{
                background: '#FEF2F2',
                border: '1px solid #FECACA',
                color: '#B91C1C',
                borderRadius: '8px',
                padding: '6px 10px',
                fontSize: '11px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              🗣 "Show retry queue"
            </button>

            <button
              onClick={() => handleSimulateCommand('Show today\'s report')}
              style={{
                background: '#FAF5FF',
                border: '1px solid #F3E8FF',
                color: '#7E22CE',
                borderRadius: '8px',
                padding: '6px 10px',
                fontSize: '11px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              🗣 "Show today's report"
            </button>

            <button
              onClick={() => handleSimulateCommand('Rahul said he has fever')}
              style={{
                background: '#F0FDF4',
                border: '1px solid #BBF7D0',
                color: '#15803D',
                borderRadius: '8px',
                padding: '6px 10px',
                fontSize: '11px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              🗣 "Report: Fever"
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
