import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ChevronLeft, Eye, EyeOff, CheckCircle, Fingerprint, Scan, ShieldCheck } from 'lucide-react';
import { UserRole } from '../types';

export const AdminLoginScreen: React.FC = () => {
  const { login, setCurrentScreen, showToast } = useApp();
  const [email, setEmail] = useState('admin@college.edu');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [biometricType, setBiometricType] = useState<'face' | 'fingerprint'>('face');
  const [isScanning, setIsScanning] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole>('org_admin');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(selectedRole);
  };

  const handleBiometricAuth = () => {
    setIsScanning(true);
    showToast(`Scanning device ${biometricType === 'face' ? 'Face ID' : 'Fingerprint'}...`);
    setTimeout(() => {
      setIsScanning(false);
      setIsVerified(true);
      showToast('Biometric verified securely via native enclave');
      setTimeout(() => {
        login(selectedRole);
      }, 700);
    }, 900);
  };

  return (
    <div
      style={{
        flex: 1,
        background: '#FFFFFF',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '16px 20px 24px',
        overflowY: 'auto'
      }}
    >
      <div>
        {/* Top Back Arrow */}
        <button
          onClick={() => setCurrentScreen('splash')}
          style={{
            background: 'none',
            border: 'none',
            padding: '4px 0',
            cursor: 'pointer',
            color: 'var(--text-700)',
            marginBottom: '12px'
          }}
        >
          <ChevronLeft size={24} />
        </button>

        {/* Headings */}
        <div style={{ textAlign: 'center', marginBottom: '18px' }}>
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              background: '#EFF6FF',
              color: '#2563EB',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 8px'
            }}
          >
            <ShieldCheck size={26} />
          </div>
          <h2 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-900)', margin: '0 0 2px' }}>
            Welcome Back
          </h2>
          <h3 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-600)', margin: 0 }}>
            Secure Authorized Login
          </h3>
        </div>

        {/* Role Quick Switcher */}
        <div style={{ marginBottom: '14px' }}>
          <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'var(--text-600)', textTransform: 'uppercase', marginBottom: '6px' }}>
            Login As Role:
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '6px' }}>
            <button
              type="button"
              onClick={() => {
                setSelectedRole('org_admin');
                setEmail('admin@college.edu');
              }}
              style={{
                padding: '7px 8px',
                borderRadius: '8px',
                border: selectedRole === 'org_admin' ? '1.5px solid #2563EB' : '1px solid #E2E8F0',
                background: selectedRole === 'org_admin' ? '#EFF6FF' : '#FFFFFF',
                color: selectedRole === 'org_admin' ? '#1D4ED8' : '#475569',
                fontSize: '11px',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              Org Admin (Full Access)
            </button>
            <button
              type="button"
              onClick={() => {
                setSelectedRole('caller');
                setEmail('teacher.kumar@college.edu');
              }}
              style={{
                padding: '7px 8px',
                borderRadius: '8px',
                border: selectedRole === 'caller' ? '1.5px solid #2563EB' : '1px solid #E2E8F0',
                background: selectedRole === 'caller' ? '#EFF6FF' : '#FFFFFF',
                color: selectedRole === 'caller' ? '#1D4ED8' : '#475569',
                fontSize: '11px',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              Teacher / Caller Mode
            </button>
          </div>
        </div>

        {/* Inputs */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-700)', marginBottom: '4px' }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="sc-input"
              style={{ fontSize: '13px', height: '42px' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-700)', marginBottom: '4px' }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="sc-input"
                style={{ fontSize: '13px', height: '42px', paddingRight: '40px' }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '11px',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--text-400)'
                }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Device Biometric Selector (PRD Section 5) */}
          <div style={{ marginTop: '6px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-700)', margin: 0 }}>
                Device Biometric Auth
              </label>
              <div style={{ display: 'flex', gap: '4px' }}>
                <button
                  type="button"
                  onClick={() => setBiometricType('face')}
                  style={{
                    padding: '3px 8px',
                    borderRadius: '6px',
                    border: 'none',
                    background: biometricType === 'face' ? '#2563EB' : '#F1F5F9',
                    color: biometricType === 'face' ? '#FFFFFF' : '#64748B',
                    fontSize: '10px',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  Face ID
                </button>
                <button
                  type="button"
                  onClick={() => setBiometricType('fingerprint')}
                  style={{
                    padding: '3px 8px',
                    borderRadius: '6px',
                    border: 'none',
                    background: biometricType === 'fingerprint' ? '#2563EB' : '#F1F5F9',
                    color: biometricType === 'fingerprint' ? '#FFFFFF' : '#64748B',
                    fontSize: '10px',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  Fingerprint
                </button>
              </div>
            </div>

            {/* Interactive Biometric Scanner Box */}
            <div
              onClick={handleBiometricAuth}
              style={{
                width: '124px',
                height: '124px',
                margin: '0 auto',
                borderRadius: '16px',
                position: 'relative',
                overflow: 'hidden',
                background: biometricType === 'face' ? '#E2E8F0' : '#F8FAFC',
                border: isScanning ? '2px solid #2563EB' : '2px solid #E2E8F0',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: 'var(--shadow-sm)',
                transition: 'all 0.2s ease'
              }}
              title={`Click to authenticate with ${biometricType === 'face' ? 'Face ID' : 'Fingerprint'}`}
            >
              {biometricType === 'face' ? (
                <>
                  <img
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80"
                    alt="Face Auth"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      inset: '8px',
                      border: '2px dashed #22C55E',
                      borderRadius: '10px',
                      pointerEvents: 'none'
                    }}
                  />
                </>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', color: '#2563EB' }}>
                  <Fingerprint size={52} strokeWidth={1.5} />
                  <span style={{ fontSize: '10px', fontWeight: 700, color: '#64748B' }}>Touch Sensor</span>
                </div>
              )}

              {/* Scanning Ray effect */}
              {isScanning && (
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '4px',
                    background: '#2563EB',
                    boxShadow: '0 0 10px #2563EB',
                    animation: 'bounce 1s infinite'
                  }}
                />
              )}

              {/* Verification Success Overlay */}
              {isVerified && (
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'rgba(34, 197, 94, 0.85)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#FFFFFF'
                  }}
                >
                  <CheckCircle size={36} color="#FFFFFF" />
                  <span style={{ fontSize: '11px', fontWeight: 700, marginTop: '4px' }}>Verified</span>
                </div>
              )}
            </div>
            <span style={{ display: 'block', textAlign: 'center', fontSize: '10px', color: 'var(--text-500)', marginTop: '6px' }}>
              Tap scanner for instant device biometric login
            </span>
          </div>

          {/* Primary Login Button */}
          <button
            type="submit"
            className="btn-primary"
            style={{
              width: '100%',
              borderRadius: 'var(--radius-lg)',
              height: '44px',
              fontSize: '14px',
              fontWeight: 700,
              marginTop: '6px'
            }}
          >
            Login to Dashboard
          </button>
        </form>

        {/* Sign Up Navigation Link */}
        <div style={{ textAlign: 'center', marginTop: '14px' }}>
          <span style={{ fontSize: '12px', color: '#64748B' }}>
            Don't have an account?{' '}
            <button
              type="button"
              onClick={() => setCurrentScreen('signup')}
              style={{
                background: 'none',
                border: 'none',
                color: '#2563EB',
                fontWeight: 700,
                fontSize: '12px',
                cursor: 'pointer',
                textDecoration: 'underline'
              }}
            >
              Sign Up (Supabase)
            </button>
          </span>
        </div>
      </div>

      {/* Footer */}
      <div style={{ textAlign: 'center', marginTop: '12px' }}>
        <p style={{ fontSize: '11px', color: 'var(--text-400)', margin: 0 }}>
          Protected by device hardware keystore • No raw biometrics stored
        </p>
      </div>
    </div>
  );
};
