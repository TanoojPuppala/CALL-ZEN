import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ChevronLeft, Eye, EyeOff, ShieldCheck, UserPlus, Building, Mail, Lock, User, Briefcase } from 'lucide-react';
import { UserRole, IndustryType } from '../types';
import { signUpUser } from '../services/supabase';

export const SignUpScreen: React.FC = () => {
  const { setCurrentScreen, showToast, login, setIndustry, createOrganization } = useApp();

  const [fullName, setFullName] = useState('');
  const [orgName, setOrgName] = useState('');
  const [industry, setFormIndustry] = useState<IndustryType>('education');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<UserRole>('org_admin');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName.trim() || !email.trim() || !orgName.trim()) {
      showToast('Please fill in all required fields');
      return;
    }

    if (password && password.length < 6) {
      showToast('Password must be at least 6 characters');
      return;
    }

    if (password && password !== confirmPassword) {
      showToast('Passwords do not match');
      return;
    }

    setIsLoading(true);
    showToast('Creating account in Supabase...');

    try {
      const result = await signUpUser({
        fullName,
        email,
        password: password || 'SmartCall@2026',
        orgName,
        industry,
        role
      });

      setIndustry(industry);
      createOrganization(orgName, industry, 'ORG-' + Date.now().toString().slice(-4), fullName, email);
      login(role);
      showToast(result.message || 'Account created successfully! Welcome.');
      setTimeout(() => {
        setIsLoading(false);
        setCurrentScreen('dashboard');
      }, 500);
    } catch (err: any) {
      setIsLoading(false);
      showToast('Error creating account. Continuing in offline mode.');
      login(role);
      setCurrentScreen('dashboard');
    }
  };

  return (
    <div
      style={{
        flex: 1,
        background: '#FFFFFF',
        display: 'flex',
        flexDirection: 'column',
        padding: '16px 20px 24px',
        overflowY: 'auto'
      }}
    >
      <div>
        {/* Top Back Arrow */}
        <button
          onClick={() => setCurrentScreen('login')}
          style={{
            background: 'none',
            border: 'none',
            padding: '4px 0',
            cursor: 'pointer',
            color: 'var(--text-700)',
            marginBottom: '10px'
          }}
          title="Back to Login"
        >
          <ChevronLeft size={24} />
        </button>

        {/* Headings */}
        <div style={{ textAlign: 'center', marginBottom: '16px' }}>
          <div
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '12px',
              background: '#EFF6FF',
              color: '#2563EB',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 8px',
              boxShadow: '0 4px 12px rgba(37,99,235,0.15)'
            }}
          >
            <UserPlus size={24} />
          </div>
          <h2 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-900)', margin: '0 0 2px' }}>
            Create Account
          </h2>
          <h3 style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-600)', margin: 0 }}>
            Join SmartCall AI • Cloud & Offline Ready
          </h3>
        </div>

        {/* Registration Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {/* Full Name */}
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: 'var(--text-700)', marginBottom: '4px' }}>
              Full Name *
            </label>
            <div style={{ position: 'relative' }}>
              <User size={16} color="var(--text-400)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                required
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                placeholder="e.g. Dr. Ananya Sharma"
                style={{
                  width: '100%',
                  padding: '10px 12px 10px 36px',
                  borderRadius: '10px',
                  border: '1px solid var(--border)',
                  fontSize: '13px',
                  outline: 'none',
                  background: '#F8FAFC'
                }}
              />
            </div>
          </div>

          {/* Organization Name */}
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: 'var(--text-700)', marginBottom: '4px' }}>
              Organization / College / Company *
            </label>
            <div style={{ position: 'relative' }}>
              <Building size={16} color="var(--text-400)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                required
                value={orgName}
                onChange={e => setOrgName(e.target.value)}
                placeholder="e.g. Acme Corporation"
                style={{
                  width: '100%',
                  padding: '10px 12px 10px 36px',
                  borderRadius: '10px',
                  border: '1px solid var(--border)',
                  fontSize: '13px',
                  outline: 'none',
                  background: '#F8FAFC'
                }}
              />
            </div>
          </div>

          {/* Industry Selection */}
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: 'var(--text-700)', marginBottom: '4px' }}>
              Industry Category *
            </label>
            <div style={{ position: 'relative' }}>
              <Briefcase size={16} color="var(--text-400)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <select
                value={industry}
                onChange={e => setFormIndustry(e.target.value as IndustryType)}
                style={{
                  width: '100%',
                  padding: '10px 12px 10px 36px',
                  borderRadius: '10px',
                  border: '1px solid var(--border)',
                  fontSize: '13px',
                  outline: 'none',
                  background: '#F8FAFC',
                  fontWeight: 600
                }}
              >
                <option value="education">🎓 Education (Schools, Colleges)</option>
                <option value="banking">🏦 Banking & Financial Services</option>
                <option value="recruitment">💼 HR & Recruitment</option>
                <option value="corporate">🏢 Corporate Operations</option>
                <option value="service">📮 Public Service & Hospitals</option>
              </select>
            </div>
          </div>

          {/* Email */}
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: 'var(--text-700)', marginBottom: '4px' }}>
              Work Email *
            </label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} color="var(--text-400)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="admin@company.com"
                style={{
                  width: '100%',
                  padding: '10px 12px 10px 36px',
                  borderRadius: '10px',
                  border: '1px solid var(--border)',
                  fontSize: '13px',
                  outline: 'none',
                  background: '#F8FAFC'
                }}
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: 'var(--text-700)', marginBottom: '4px' }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <Lock size={16} color="var(--text-400)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Minimum 6 characters"
                style={{
                  width: '100%',
                  padding: '10px 36px 10px 36px',
                  borderRadius: '10px',
                  border: '1px solid var(--border)',
                  fontSize: '13px',
                  outline: 'none',
                  background: '#F8FAFC'
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-500)',
                  cursor: 'pointer'
                }}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Role Mode Selection */}
          <div>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'var(--text-600)', textTransform: 'uppercase', marginBottom: '6px' }}>
              Select Initial Role:
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '6px' }}>
              <button
                type="button"
                onClick={() => setRole('org_admin')}
                style={{
                  padding: '8px 10px',
                  borderRadius: '8px',
                  border: role === 'org_admin' ? '2px solid #2563EB' : '1px solid #E2E8F0',
                  background: role === 'org_admin' ? '#EFF6FF' : '#F8FAFC',
                  color: role === 'org_admin' ? '#1D4ED8' : '#64748B',
                  fontWeight: 700,
                  fontSize: '11px',
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
              >
                👑 Org Admin
                <span style={{ display: 'block', fontSize: '9px', fontWeight: 500, color: '#64748B' }}>Full Management</span>
              </button>

              <button
                type="button"
                onClick={() => setRole('caller')}
                style={{
                  padding: '8px 10px',
                  borderRadius: '8px',
                  border: role === 'caller' ? '2px solid #2563EB' : '1px solid #E2E8F0',
                  background: role === 'caller' ? '#EFF6FF' : '#F8FAFC',
                  color: role === 'caller' ? '#1D4ED8' : '#64748B',
                  fontWeight: 700,
                  fontSize: '11px',
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
              >
                📞 Caller / Teacher
                <span style={{ display: 'block', fontSize: '9px', fontWeight: 500, color: '#64748B' }}>Calling Workflow</span>
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary"
            style={{
              width: '100%',
              height: '44px',
              fontSize: '14px',
              fontWeight: 700,
              marginTop: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            {isLoading ? 'Creating Account...' : 'Create Account & Enter'}
          </button>
        </form>

        {/* Link back to login */}
        <div style={{ textAlign: 'center', marginTop: '16px' }}>
          <span style={{ fontSize: '12px', color: '#64748B' }}>
            Already have an account?{' '}
            <button
              onClick={() => setCurrentScreen('login')}
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
              Sign In
            </button>
          </span>
        </div>
      </div>
    </div>
  );
};
