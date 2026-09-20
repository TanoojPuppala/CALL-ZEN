import React from 'react';
import { useApp } from '../context/AppContext';

export const SplashScreen: React.FC = () => {
  const { setCurrentScreen } = useApp();

  return (
    <div
      onClick={() => setCurrentScreen('login')}
      style={{
        flex: 1,
        background: 'linear-gradient(180deg, #1D4ED8 0%, #1E40AF 100%)',
        color: '#FFFFFF',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 'calc(env(safe-area-inset-top, 0px) + 50px)',
        paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 24px)',
        paddingLeft: '24px',
        paddingRight: '24px',
        textAlign: 'center',
        cursor: 'pointer',
        userSelect: 'none',
        position: 'relative'
      }}
    >
      {/* Center Branding Block */}
      <div style={{ margin: 'auto 0', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {/* Exact Circular Logo matching reference image */}
        <div
          style={{
            width: '90px',
            height: '90px',
            borderRadius: '50%',
            background: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '20px',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)'
          }}
        >
          <svg width="56" height="56" viewBox="0 0 24 24" fill="none">
            <path
              d="M16 11c1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3 1.34 3 3 3zm-8 0c1.66 0 3-1.34 3-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"
              fill="#2563EB"
            />
            <path
              d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z"
              fill="#60A5FA"
              opacity="0.7"
            />
          </svg>
        </div>

        {/* Title */}
        <h1
          style={{
            fontSize: '28px',
            fontWeight: 800,
            letterSpacing: '-0.3px',
            margin: '0 0 8px',
            color: '#FFFFFF'
          }}
        >
          SmartCall AI
        </h1>

        {/* Subtitle */}
        <p
          style={{
            fontSize: '12px',
            fontWeight: 500,
            color: '#BFDBFE',
            margin: '0 0 40px',
            letterSpacing: '0.4px'
          }}
        >
          Connect | Follow-up | Track | Complete
        </p>

        {/* Tagline */}
        <div style={{ marginTop: '20px' }}>
          <h2 style={{ fontSize: '17px', fontWeight: 700, margin: '0 0 4px', color: '#FFFFFF' }}>
            Smarter People
          </h2>
          <h2 style={{ fontSize: '17px', fontWeight: 700, margin: 0, color: '#FFFFFF' }}>
            Stronger Tomorrow
          </h2>
        </div>
      </div>

      {/* Bottom Version */}
      <div style={{ fontSize: '11px', color: '#93C5FD', opacity: 0.85 }}>
        Version 1.0.0 • Tap anywhere to continue
      </div>
    </div>
  );
};
