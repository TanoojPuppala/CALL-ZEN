import React from 'react';
import { useApp } from '../../context/AppContext';
import { Mic, ArrowLeft, Maximize2, Minimize2, Sparkles, Building2 } from 'lucide-react';

interface HeaderProps {
  title?: string;
  showBack?: boolean;
  onBack?: () => void;
  hideOrgBadge?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  showBack = false,
  onBack,
  hideOrgBadge = false
}) => {
  const {
    currentScreen,
    setCurrentScreen,
    previousScreen,
    currentOrg,
    currentPeriod,
    isDesktopView,
    setIsDesktopView,
    setIsVoiceAssistantOpen,
    callingSession
  } = useApp();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      setCurrentScreen(previousScreen || 'dashboard');
    }
  };

  return (
    <header
      style={{
        background: 'var(--surface)',
        borderBottom: '1px solid var(--border)',
        padding: '12px 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexShrink: 0,
        zIndex: 20
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        {showBack && (
          <button
            onClick={handleBack}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--text-700)',
              padding: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 'var(--radius-md)'
            }}
            title="Go back"
            aria-label="Back"
          >
            <ArrowLeft size={20} />
          </button>
        )}

        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <h1
              style={{
                fontSize: '17px',
                fontWeight: 700,
                color: 'var(--primary-900)',
                margin: 0
              }}
            >
              {title || 'SmartCall AI'}
            </h1>
            {!hideOrgBadge && currentPeriod && (
              <span
                className="badge badge-primary"
                style={{ fontSize: '10px', padding: '2px 8px' }}
                title={`Class/Department: ${currentPeriod.departmentOrClass}`}
              >
                {currentPeriod.departmentOrClass}
              </span>
            )}
          </div>
          {!hideOrgBadge && (currentOrg || currentPeriod) && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
              <Building2 size={11} color="var(--text-500)" />
              <span style={{ fontSize: '11px', color: 'var(--text-500)' }}>
                {currentOrg ? currentOrg.name : 'Organization Not Set'}{currentPeriod ? ` (${currentPeriod.year})` : ''}
              </span>
            </div>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {/* Paused calling queue indicator if in progress */}
        {callingSession && callingSession.state === 'paused' && currentScreen !== 'next_call' && (
          <button
            onClick={() => setCurrentScreen('next_call')}
            className="badge badge-warning"
            style={{ cursor: 'pointer', border: 'none', padding: '4px 8px' }}
            title="Resume calling session"
          >
            Queue Paused ({callingSession.currentIndex + 1}/{callingSession.selectedContactIds.length})
          </button>
        )}

        {/* Voice Assistant Trigger */}
        <button
          onClick={() => setIsVoiceAssistantOpen(true)}
          style={{
            background: 'var(--purple-50)',
            border: '1px solid var(--purple-100)',
            color: 'var(--purple-700)',
            width: '38px',
            height: '38px',
            borderRadius: 'var(--radius-full)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: 'var(--shadow-sm)',
            transition: 'all 0.15s ease'
          }}
          title="Open SmartCall Voice Assistant"
          aria-label="Voice Assistant"
        >
          <Mic size={18} />
        </button>

        {/* Desktop / Mobile Frame Viewport Switcher */}
        <button
          onClick={() => setIsDesktopView(!isDesktopView)}
          style={{
            background: 'var(--surface-alt)',
            border: '1px solid var(--border)',
            color: 'var(--text-600)',
            width: '38px',
            height: '38px',
            borderRadius: 'var(--radius-full)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.15s ease'
          }}
          title={isDesktopView ? 'Switch to Mobile Frame' : 'Expand to Full Width'}
          aria-label="Toggle View Mode"
        >
          {isDesktopView ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
        </button>
      </div>
    </header>
  );
};
