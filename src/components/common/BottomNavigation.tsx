import React from 'react';
import { useApp } from '../../context/AppContext';
import { Home, Database, Phone, BarChart2, User } from 'lucide-react';
import { ScreenType } from '../../types';

export const BottomNavigation: React.FC = () => {
  const { currentScreen, setCurrentScreen, showToast, currentUser, currentOrg } = useApp();

  const isHomeActive = currentScreen === 'dashboard';
  const isDataActive = ['data_management', 'upload_data', 'data_preview', 'select_period'].includes(currentScreen);
  const isCallingActive = ['student_list', 'ready_to_call', 'calling', 'post_call_report', 'next_call'].includes(currentScreen);
  const isReportsActive = currentScreen === 'reports';
  const isProfileActive = false;

  return (
    <nav
      style={{
        background: '#FFFFFF',
        borderTop: '1px solid var(--border)',
        paddingTop: '8px',
        paddingBottom: 'max(env(safe-area-inset-bottom, 0px), 12px)',
        paddingLeft: '10px',
        paddingRight: '10px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        flexShrink: 0
      }}
    >
      {/* 1. Home */}
      <button
        onClick={() => setCurrentScreen('dashboard')}
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '2px',
          color: isHomeActive ? '#2563EB' : '#94A3B8'
        }}
      >
        <Home size={20} strokeWidth={isHomeActive ? 2.5 : 2} />
        <span style={{ fontSize: '11px', fontWeight: isHomeActive ? 700 : 500 }}>Home</span>
      </button>

      {/* 2. Data */}
      <button
        onClick={() => setCurrentScreen('data_management')}
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '2px',
          color: isDataActive ? '#2563EB' : '#94A3B8'
        }}
      >
        <Database size={20} strokeWidth={isDataActive ? 2.5 : 2} />
        <span style={{ fontSize: '11px', fontWeight: isDataActive ? 700 : 500 }}>Data</span>
      </button>

      {/* 3. Calling */}
      <button
        onClick={() => setCurrentScreen('student_list')}
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '2px',
          color: isCallingActive ? '#2563EB' : '#94A3B8'
        }}
      >
        <Phone size={20} strokeWidth={isCallingActive ? 2.5 : 2} />
        <span style={{ fontSize: '11px', fontWeight: isCallingActive ? 700 : 500 }}>Calling</span>
      </button>

      {/* 4. Reports */}
      <button
        onClick={() => setCurrentScreen('reports')}
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '2px',
          color: isReportsActive ? '#2563EB' : '#94A3B8'
        }}
      >
        <BarChart2 size={20} strokeWidth={isReportsActive ? 2.5 : 2} />
        <span style={{ fontSize: '11px', fontWeight: isReportsActive ? 700 : 500 }}>Reports</span>
      </button>

      {/* 5. Profile */}
      <button
        onClick={() => showToast(`Profile: ${currentUser ? currentUser.name : 'Admin'} (${currentOrg ? currentOrg.name : 'Not Configured'})`)}
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '2px',
          color: '#94A3B8'
        }}
      >
        <User size={20} strokeWidth={2} />
        <span style={{ fontSize: '11px', fontWeight: 500 }}>Profile</span>
      </button>
    </nav>
  );
};
