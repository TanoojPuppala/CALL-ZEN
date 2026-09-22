import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { BottomNavigation } from './BottomNavigation';
import { VoiceAssistantModal } from './VoiceAssistantModal';
import { Toast } from './Toast';
import {
  Menu,
  X,
  Mic,
  ShieldCheck,
  UserCheck,
  Download,
  Smartphone,
  Home,
  Users,
  Database,
  RotateCcw,
  BarChart2,
  LogOut,
  ChevronRight,
  Globe
} from 'lucide-react';
import { ScreenType, IndustryType } from '../../types';

// Import All Screens
import { SplashScreen } from '../../screens/SplashScreen';
import { AdminLoginScreen } from '../../screens/AdminLoginScreen';
import { SignUpScreen } from '../../screens/SignUpScreen';
import { DashboardScreen } from '../../screens/DashboardScreen';
import { DataManagementScreen } from '../../screens/DataManagementScreen';
import { UploadDataScreen } from '../../screens/UploadDataScreen';
import { DataPreviewScreen } from '../../screens/DataPreviewScreen';
import { SelectPeriodScreen } from '../../screens/SelectPeriodScreen';
import { StudentListScreen } from '../../screens/StudentListScreen';
import { ReadyToCallScreen } from '../../screens/ReadyToCallScreen';
import { CallingScreen } from '../../screens/CallingScreen';
import { PostCallReportScreen } from '../../screens/PostCallReportScreen';
import { NextCallScreen } from '../../screens/NextCallScreen';
import { ReportsScreen } from '../../screens/ReportsScreen';
import { RetryQueueScreen } from '../../screens/RetryQueueScreen';

export const AppShell: React.FC = () => {
  const {
    currentScreen,
    setCurrentScreen,
    setIsVoiceAssistantOpen,
    currentIndustry,
    setIndustry,
    roleMode,
    setRoleMode,
    auditLogs,
    currentUser,
    currentOrg,
    logout
  } = useApp();

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [showAuditModal, setShowAuditModal] = useState(false);
  const [showInstallModal, setShowInstallModal] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  React.useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const triggerInstall = () => {
    setShowInstallModal(true);
  };

  // Only the primary operational destinations are exposed in the navigation drawer.
  // Intermediate / workflow pages (Splash, Login, SignUp, Upload, Preview, Period,
  // Ready to Call, Calling, Report, Next Call) are navigated naturally via user actions
  // and are excluded from the navigation bar.
  const mainNavItems: Array<{ id: ScreenType; label: string; desc: string; icon: any }> = [
    { id: 'dashboard', label: 'Dashboard', desc: 'System overview & fast dialer', icon: Home },
    { id: 'student_list', label: 'Contacts & Calling', desc: 'Manage contacts & launch calls', icon: Users },
    { id: 'data_management', label: 'Data Management', desc: 'Upload CSV/Excel & sample data', icon: Database },
    { id: 'retry_queue', label: 'Re-Attend Queue', desc: 'Follow-ups, busy & callback queue', icon: RotateCcw },
    { id: 'reports', label: 'Reports & Analytics', desc: 'Call logs, outcomes & analytics', icon: BarChart2 }
  ];

  const renderActiveScreen = () => {
    switch (currentScreen) {
      case 'splash':
        return <SplashScreen />;
      case 'login':
        return <AdminLoginScreen />;
      case 'signup':
        return <SignUpScreen />;
      case 'dashboard':
        return <DashboardScreen />;
      case 'data_management':
        return <DataManagementScreen />;
      case 'upload_data':
        return <UploadDataScreen />;
      case 'data_preview':
        return <DataPreviewScreen />;
      case 'select_period':
        return <SelectPeriodScreen />;
      case 'student_list':
        return <StudentListScreen />;
      case 'ready_to_call':
        return <ReadyToCallScreen />;
      case 'calling':
        return <CallingScreen />;
      case 'post_call_report':
        return <PostCallReportScreen />;
      case 'next_call':
        return <NextCallScreen />;
      case 'reports':
        return <ReportsScreen />;
      case 'retry_queue':
        return <RetryQueueScreen />;
      default:
        return <DashboardScreen />;
    }
  };

  const showBottomNav = [
    'dashboard',
    'student_list',
    'data_management',
    'reports',
    'retry_queue'
  ].includes(currentScreen);

  const isFullScreenView = ['splash', 'login', 'signup', 'calling'].includes(currentScreen);

  return (
    <div
      style={{
        width: '100%',
        minHeight: '100vh',
        height: '100dvh',
        display: 'flex',
        justifyContent: 'center',
        background: '#0B132B'
      }}
    >
      {/* Real Mobile App Viewport (100% on phones, max 460px on desktop) */}
      <div className="app-container">
        {/* Top Mobile Application Navigation Bar (Single Sleek Row) */}
        {!isFullScreenView && (
          <header
            style={{
              background: '#0F172A',
              color: '#FFFFFF',
              paddingTop: 'calc(env(safe-area-inset-top, 0px) + 34px)',
              paddingBottom: '10px',
              paddingLeft: '14px',
              paddingRight: '14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexShrink: 0,
              borderBottom: '1px solid #1E293B',
              zIndex: 30
            }}
          >
            {/* Left: 3-Dashes Hamburger Menu Button + Logo + Title */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <button
                onClick={() => setIsDrawerOpen(true)}
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  color: '#FFFFFF',
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  flexShrink: 0,
                  boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
                  transition: 'background 0.15s'
                }}
                title="Open Navigation Menu"
                aria-label="Navigation Menu"
              >
                <Menu size={20} />
              </button>

              <div
                onClick={() => setCurrentScreen('dashboard')}
                style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
              >
                <div
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '8px',
                    background: 'linear-gradient(135deg, #2563EB, #4F46E5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#FFFFFF',
                    fontWeight: 900,
                    fontSize: '13px',
                    boxShadow: '0 2px 6px rgba(37,99,235,0.4)',
                    flexShrink: 0
                  }}
                >
                  SC
                </div>
                <div>
                  <span style={{ fontSize: '15px', fontWeight: 800, color: '#F8FAFC', letterSpacing: '-0.3px', display: 'block', lineHeight: 1.1 }}>
                    SmartCall AI
                  </span>
                  <span style={{ fontSize: '9.5px', color: '#94A3B8', fontWeight: 600, textTransform: 'capitalize' }}>
                    {currentIndustry} • {roleMode === 'admin' ? 'Admin' : 'Teacher'}
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Quick Action Buttons */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              {/* Voice Assistant Trigger */}
              <button
                onClick={() => setIsVoiceAssistantOpen(true)}
                style={{
                  background: '#059669',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '5px 8px',
                  fontSize: '10px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  boxShadow: '0 2px 6px rgba(5,150,105,0.3)'
                }}
                title="Voice Assistant"
              >
                <Mic size={13} />
                <span>Voice</span>
              </button>

              {/* Install / Download APK Button */}
              <button
                onClick={triggerInstall}
                style={{
                  background: '#7C3AED',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '5px 8px',
                  fontSize: '10px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  boxShadow: '0 2px 6px rgba(124,58,237,0.3)'
                }}
                title="Install App / Download APK"
              >
                <Download size={13} />
                <span>APK</span>
              </button>
            </div>
          </header>
        )}

        {/* Slide-out Mobile Navigation Drawer (Three-Dashes Menu) */}
        {isDrawerOpen && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(15, 23, 42, 0.75)',
              backdropFilter: 'blur(4px)',
              zIndex: 100,
              display: 'flex',
              justifyContent: 'flex-start'
            }}
            onClick={() => setIsDrawerOpen(false)}
          >
            <div
              className="nav-drawer"
              style={{
                width: '84%',
                maxWidth: '320px',
                height: '100%',
                background: '#0F172A',
                borderRight: '1px solid #1E293B',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: '10px 0 30px rgba(0, 0, 0, 0.5)',
                overflowY: 'auto'
              }}
              onClick={e => e.stopPropagation()}
            >
              {/* Drawer Header */}
              <div
                style={{
                  padding: 'calc(env(safe-area-inset-top, 0px) + 24px) 16px 16px',
                  borderBottom: '1px solid #1E293B',
                  background: 'linear-gradient(180deg, #1E293B 0%, #0F172A 100%)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '8px',
                        background: 'linear-gradient(135deg, #2563EB, #4F46E5)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#FFFFFF',
                        fontWeight: 900,
                        fontSize: '14px',
                        boxShadow: '0 2px 8px rgba(37,99,235,0.4)'
                      }}
                    >
                      SC
                    </div>
                    <div>
                      <h2 style={{ fontSize: '16px', fontWeight: 800, color: '#F8FAFC', margin: 0, lineHeight: 1.1 }}>
                        SmartCall AI
                      </h2>
                      <span style={{ fontSize: '10px', color: '#94A3B8' }}>v2.4.0 Native Mobile</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsDrawerOpen(false)}
                    style={{
                      background: 'rgba(255,255,255,0.08)',
                      border: 'none',
                      borderRadius: '8px',
                      color: '#94A3B8',
                      width: '32px',
                      height: '32px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer'
                    }}
                    title="Close Menu"
                  >
                    <X size={18} />
                  </button>
                </div>

                {/* User Profile Card */}
                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: '10px',
                    padding: '10px 12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    border: '1px solid rgba(255, 255, 255, 0.08)'
                  }}
                >
                  <div
                    style={{
                      width: '34px',
                      height: '34px',
                      borderRadius: '50%',
                      background: roleMode === 'admin' ? '#1E40AF' : '#B45309',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#FFFFFF',
                      fontWeight: 800,
                      fontSize: '12px'
                    }}
                  >
                    {roleMode === 'admin' ? 'AD' : 'TC'}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: '#FFFFFF', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {currentUser?.name || (roleMode === 'admin' ? 'Administrator' : 'Caller Staff')}
                    </div>
                    <div style={{ fontSize: '10px', color: '#94A3B8', textTransform: 'capitalize' }}>
                      {roleMode === 'admin' ? 'Organization Admin' : 'Calling In-Charge'} • {currentOrg ? currentOrg.name : 'Not Configured'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Drawer Body */}
              <div style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column', gap: '18px' }}>
                {/* 1. Main Navigation Items (Only Primary Destinations - No Sub-pages) */}
                <div>
                  <div style={{ fontSize: '10px', fontWeight: 700, color: '#64748B', letterSpacing: '0.8px', marginBottom: '8px', textTransform: 'uppercase' }}>
                    Main Menu
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {mainNavItems.map(item => {
                      const active = currentScreen === item.id;
                      const Icon = item.icon;
                      return (
                        <button
                          key={item.id}
                          onClick={() => {
                            setCurrentScreen(item.id);
                            setIsDrawerOpen(false);
                          }}
                          style={{
                            background: active ? 'rgba(37, 99, 235, 0.18)' : 'transparent',
                            border: active ? '1px solid #3B82F6' : '1px solid transparent',
                            borderRadius: '10px',
                            padding: '10px 12px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            cursor: 'pointer',
                            textAlign: 'left',
                            transition: 'all 0.15s ease'
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div
                              style={{
                                color: active ? '#60A5FA' : '#94A3B8',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                              }}
                            >
                              <Icon size={19} />
                            </div>
                            <div>
                              <div style={{ fontSize: '13px', fontWeight: active ? 700 : 600, color: active ? '#FFFFFF' : '#E2E8F0' }}>
                                {item.label}
                              </div>
                              <div style={{ fontSize: '10px', color: active ? '#93C5FD' : '#64748B' }}>
                                {item.desc}
                              </div>
                            </div>
                          </div>
                          <ChevronRight size={15} color={active ? '#60A5FA' : '#475569'} />
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 2. Organization Domain / Industry Selector */}
                <div style={{ background: 'rgba(255, 255, 255, 0.03)', borderRadius: '12px', padding: '12px', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                    <Globe size={13} color="#60A5FA" />
                    <span style={{ fontSize: '10px', fontWeight: 700, color: '#94A3B8', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                      Organization Domain
                    </span>
                  </div>
                  <select
                    value={currentIndustry}
                    onChange={e => {
                      setIndustry(e.target.value as IndustryType);
                      setIsDrawerOpen(false);
                    }}
                    style={{
                      width: '100%',
                      background: '#1E293B',
                      color: '#93C5FD',
                      border: '1px solid #3B82F6',
                      borderRadius: '8px',
                      padding: '8px 10px',
                      fontSize: '12px',
                      fontWeight: 700,
                      outline: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    <option value="education">🎓 Education (Colleges/Schools)</option>
                    <option value="banking">🏦 Banking (EMI/Collections)</option>
                    <option value="recruitment">💼 HR (Recruitment/Interviews)</option>
                    <option value="corporate">🏢 Corporate (Staff/Attendance)</option>
                    <option value="service">📮 Service Centers (Follow-ups)</option>
                  </select>
                </div>

                {/* 3. Role Switcher & System Tools */}
                <div>
                  <div style={{ fontSize: '10px', fontWeight: 700, color: '#64748B', letterSpacing: '0.8px', marginBottom: '8px', textTransform: 'uppercase' }}>
                    System Tools
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {/* Role Switch */}
                    <button
                      onClick={() => {
                        setRoleMode(roleMode === 'admin' ? 'employee' : 'admin');
                        setIsDrawerOpen(false);
                      }}
                      style={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        borderRadius: '8px',
                        padding: '8px 12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        cursor: 'pointer',
                        color: '#E2E8F0',
                        fontSize: '12px'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <UserCheck size={16} color="#38BDF8" />
                        <span>Switch View Mode</span>
                      </div>
                      <span
                        style={{
                          background: roleMode === 'admin' ? '#1E40AF' : '#B45309',
                          color: '#FFFFFF',
                          padding: '2px 8px',
                          borderRadius: '10px',
                          fontSize: '10px',
                          fontWeight: 700
                        }}
                      >
                        {roleMode === 'admin' ? 'Admin' : 'Teacher'}
                      </span>
                    </button>

                    {/* System Audit Trail */}
                    <button
                      onClick={() => {
                        setIsDrawerOpen(false);
                        setShowAuditModal(true);
                      }}
                      style={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        borderRadius: '8px',
                        padding: '8px 12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        cursor: 'pointer',
                        color: '#E2E8F0',
                        fontSize: '12px'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <ShieldCheck size={16} color="#60A5FA" />
                        <span>System Audit Trail</span>
                      </div>
                      <span style={{ background: 'rgba(255,255,255,0.1)', color: '#CBD5E1', padding: '2px 7px', borderRadius: '10px', fontSize: '10px', fontWeight: 700 }}>
                        {auditLogs.length} logs
                      </span>
                    </button>

                    {/* Download APK / Native App */}
                    <button
                      onClick={() => {
                        setIsDrawerOpen(false);
                        triggerInstall();
                      }}
                      style={{
                        background: 'rgba(124, 58, 237, 0.15)',
                        border: '1px solid rgba(124, 58, 237, 0.4)',
                        borderRadius: '8px',
                        padding: '8px 12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        cursor: 'pointer',
                        color: '#C4B5FD',
                        fontSize: '12px'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Download size={16} color="#A78BFA" />
                        <span>Download Native APK</span>
                      </div>
                      <span style={{ background: '#7C3AED', color: '#FFFFFF', padding: '2px 6px', borderRadius: '4px', fontSize: '9px', fontWeight: 800 }}>
                        APK
                      </span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Drawer Footer / Sign Out */}
              <div
                style={{
                  padding: '16px',
                  borderTop: '1px solid #1E293B',
                  background: '#090E1A'
                }}
              >
                <button
                  onClick={() => {
                    logout();
                    setIsDrawerOpen(false);
                    setCurrentScreen('login');
                  }}
                  style={{
                    width: '100%',
                    background: 'rgba(239, 68, 68, 0.12)',
                    border: '1px solid rgba(239, 68, 68, 0.25)',
                    color: '#F87171',
                    borderRadius: '8px',
                    padding: '10px 14px',
                    fontSize: '12px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    transition: 'background 0.2s'
                  }}
                >
                  <LogOut size={16} />
                  <span>Sign Out of Account</span>
                </button>
              </div>
            </div>
          </div>
        )}


        {/* Main Active Screen Content */}
        <main
          style={{
            flex: 1,
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative'
          }}
        >
          {renderActiveScreen()}

          {/* Floating Voice Assistant Trigger Icon inside Phone View */}
          <button
            onClick={() => setIsVoiceAssistantOpen(true)}
            style={{
              position: 'absolute',
              bottom: showBottomNav ? '72px' : '18px',
              right: '16px',
              width: '46px',
              height: '46px',
              borderRadius: '50%',
              background: '#2563EB',
              color: '#FFFFFF',
              border: '2px solid #FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 6px 18px rgba(37, 99, 235, 0.45)',
              cursor: 'pointer',
              zIndex: 35,
              transition: 'transform 0.15s ease'
            }}
            title="Launch Voice Assistant (PRD Section 32)"
          >
            <Mic size={20} />
          </button>
        </main>

        {/* Bottom Tab Navigation Docked at Bottom of Mobile Screen */}
        {showBottomNav && <BottomNavigation />}

        {/* Global Assistant Modal & Toast */}
        <VoiceAssistantModal />
        <Toast />

        {/* Audit Log Modal (PRD Section 81) */}
        {showAuditModal && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(15, 23, 42, 0.75)',
              backdropFilter: 'blur(4px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 110,
              padding: '20px'
            }}
            onClick={() => setShowAuditModal(false)}
          >
            <div
              style={{
                background: '#FFFFFF',
                borderRadius: '20px',
                width: '100%',
                maxWidth: '440px',
                maxHeight: '80vh',
                overflowY: 'auto',
                padding: '20px'
              }}
              onClick={e => e.stopPropagation()}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <ShieldCheck size={20} color="#2563EB" />
                  <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#1E293B', margin: 0 }}>
                    System Audit Logs (PRD Section 81)
                  </h3>
                </div>
                <button
                  onClick={() => setShowAuditModal(false)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}
                >
                  <X size={20} />
                </button>
              </div>

              <p style={{ fontSize: '12px', color: '#64748B', margin: '0 0 14px' }}>
                Immutable audit trail recording all administrative uploads, reassignments, calls initiated, and reports confirmed.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {auditLogs.map(log => (
                  <div
                    key={log.id}
                    style={{
                      background: '#F8FAFC',
                      border: '1px solid #E2E8F0',
                      borderRadius: '10px',
                      padding: '10px 12px'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                      <strong style={{ fontSize: '12px', color: '#2563EB' }}>{log.action}</strong>
                      <span style={{ fontSize: '10px', color: '#94A3B8' }}>{new Date(log.timestamp).toLocaleTimeString()}</span>
                    </div>
                    <p style={{ fontSize: '11px', color: '#334155', margin: '0 0 2px' }}>{log.details}</p>
                    <span style={{ fontSize: '10px', color: '#64748B' }}>By: {log.actorName}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Mobile Installation & APK Download Modal */}
        {showInstallModal && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(15, 23, 42, 0.8)',
              backdropFilter: 'blur(4px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 120,
              padding: '20px'
            }}
            onClick={() => setShowInstallModal(false)}
          >
            <div
              style={{
                background: '#FFFFFF',
                borderRadius: '20px',
                width: '100%',
                maxWidth: '440px',
                padding: '20px',
                boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
              }}
              onClick={e => e.stopPropagation()}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '10px',
                      background: '#8B5CF6',
                      color: '#FFFFFF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <Smartphone size={20} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#1E293B', margin: 0 }}>
                      Install SmartCall AI on Phone
                    </h3>
                    <span style={{ fontSize: '11px', color: '#64748B' }}>Native Android APK & PWA Setup</span>
                  </div>
                </div>
                <button
                  onClick={() => setShowInstallModal(false)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}
                >
                  <X size={20} />
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '12px', color: '#334155' }}>
                {/* Option 1: Native Android APK (Recommended) */}
                <div style={{ background: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: '12px', padding: '12px' }}>
                  <strong style={{ color: '#1D4ED8', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                    <Download size={15} /> 1. Native Android APK (Recommended)
                  </strong>
                  <p style={{ margin: '0 0 8px', color: '#1E40AF', fontSize: '11px', lineHeight: 1.4 }}>
                    Install the full native Android app with calling dialer integration, push notifications, and offline support:
                  </p>
                  <a
                    href="/app-debug.apk"
                    download="SmartCall_AI.apk"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      background: '#2563EB',
                      color: '#FFFFFF',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      textDecoration: 'none',
                      fontWeight: 700,
                      fontSize: '12px',
                      boxShadow: '0 2px 4px rgba(37,99,235,0.2)'
                    }}
                  >
                    <Download size={16} /> Download SmartCall AI APK (12.7 MB)
                  </a>
                </div>

                {/* Option 2: Browser PWA HTTPS Link */}
                <div style={{ background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: '12px', padding: '12px' }}>
                  <strong style={{ color: '#15803D', display: 'block', marginBottom: '4px' }}>
                    2. Web / PWA Add to Home Screen
                  </strong>
                  <p style={{ margin: '0 0 6px', color: '#166534' }}>
                    Open this address in Chrome on your phone:
                  </p>
                  <div style={{ background: '#FFFFFF', padding: '6px 10px', borderRadius: '6px', border: '1px solid #86EFAC', fontWeight: 700, color: '#15803D', fontSize: '12px', wordBreak: 'break-all' }}>
                    https://10.222.22.1:5173/
                  </div>
                  {deferredPrompt && (
                    <button
                      onClick={async () => {
                        deferredPrompt.prompt();
                        const { outcome } = await deferredPrompt.userChoice;
                        if (outcome === 'accepted') setDeferredPrompt(null);
                      }}
                      style={{
                        marginTop: '8px',
                        width: '100%',
                        background: '#16A34A',
                        color: '#FFFFFF',
                        padding: '8px 12px',
                        borderRadius: '8px',
                        border: 'none',
                        fontWeight: 700,
                        fontSize: '12px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px'
                      }}
                    >
                      <Smartphone size={15} /> 1-Click Install PWA to Device
                    </button>
                  )}
                </div>

                {/* Android Chrome Instructions */}
                <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '10px 12px' }}>
                  <strong style={{ color: '#1E293B', display: 'block', marginBottom: '4px' }}>
                    🤖 Android Chrome (Add to Home Screen)
                  </strong>
                  <ol style={{ margin: 0, paddingLeft: '18px', lineHeight: 1.5, fontSize: '11px' }}>
                    <li>Open <strong>https://10.222.22.1:5173/</strong> in Chrome.</li>
                    <li>Tap the <strong>three dots (⋮)</strong> menu.</li>
                    <li>Tap <strong>"Install app"</strong> or <strong>"Add to Home screen"</strong>.</li>
                  </ol>
                </div>
              </div>

              <button
                onClick={() => setShowInstallModal(false)}
                className="btn-primary"
                style={{ width: '100%', height: '38px', marginTop: '14px', fontWeight: 700 }}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
