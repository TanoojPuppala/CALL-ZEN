import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  ChevronLeft,
  Upload,
  FileSpreadsheet,
  Archive,
  RotateCcw,
  UserCheck,
  Globe,
  Download,
  Search,
  CheckCircle,
  Calendar,
  Layers
} from 'lucide-react';
import { IndustryType } from '../types';

export const DataManagementScreen: React.FC = () => {
  const {
    setCurrentScreen,
    showToast,
    periods,
    archivePeriod,
    restorePeriod,
    reassignInCharge,
    currentIndustry,
    setIndustry,
    currentTemplate,
    exportReport
  } = useApp();

  const [activeTab, setActiveTab] = useState<'hub' | 'periods' | 'reassign' | 'templates'>('hub');
  const [selectedPeriodToReassign, setSelectedPeriodToReassign] = useState(periods[0].id);
  const [newCallerName, setNewCallerName] = useState('Dr. Ananya Sharma');

  const handleReassign = () => {
    reassignInCharge(selectedPeriodToReassign, 'user-3', newCallerName);
    setActiveTab('hub');
  };

  return (
    <div style={{ flex: 1, padding: '16px 16px 20px', overflowY: 'auto', background: '#F8FAFC' }}>
      {/* Top Bar matching PRD */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={() => {
              if (activeTab !== 'hub') {
                setActiveTab('hub');
              } else {
                setCurrentScreen('dashboard');
              }
            }}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', color: 'var(--text-700)' }}
          >
            <ChevronLeft size={22} />
          </button>
          <h2 style={{ fontSize: '17px', fontWeight: 800, color: 'var(--text-900)', margin: 0 }}>
            Data Management
          </h2>
        </div>

        <span style={{ fontSize: '11px', background: '#EFF6FF', color: '#2563EB', padding: '3px 8px', borderRadius: '6px', fontWeight: 700 }}>
          {currentTemplate.displayName.split(' ')[0]}
        </span>
      </div>

      {/* Segmented Sub-navigation */}
      <div style={{ display: 'flex', gap: '6px', marginBottom: '14px', overflowX: 'auto', paddingBottom: '4px' }}>
        <button
          onClick={() => setActiveTab('hub')}
          style={{
            padding: '6px 12px',
            borderRadius: '8px',
            border: activeTab === 'hub' ? '1.5px solid #2563EB' : '1px solid #E2E8F0',
            background: activeTab === 'hub' ? '#2563EB' : '#FFFFFF',
            color: activeTab === 'hub' ? '#FFFFFF' : '#475569',
            fontSize: '11px',
            fontWeight: 700,
            cursor: 'pointer',
            whiteSpace: 'nowrap'
          }}
        >
          Management Hub
        </button>
        <button
          onClick={() => setActiveTab('periods')}
          style={{
            padding: '6px 12px',
            borderRadius: '8px',
            border: activeTab === 'periods' ? '1.5px solid #2563EB' : '1px solid #E2E8F0',
            background: activeTab === 'periods' ? '#2563EB' : '#FFFFFF',
            color: activeTab === 'periods' ? '#FFFFFF' : '#475569',
            fontSize: '11px',
            fontWeight: 700,
            cursor: 'pointer',
            whiteSpace: 'nowrap'
          }}
        >
          Semesters & Archiving ({periods.length})
        </button>
        <button
          onClick={() => setActiveTab('reassign')}
          style={{
            padding: '6px 12px',
            borderRadius: '8px',
            border: activeTab === 'reassign' ? '1.5px solid #2563EB' : '1px solid #E2E8F0',
            background: activeTab === 'reassign' ? '#2563EB' : '#FFFFFF',
            color: activeTab === 'reassign' ? '#FFFFFF' : '#475569',
            fontSize: '11px',
            fontWeight: 700,
            cursor: 'pointer',
            whiteSpace: 'nowrap'
          }}
        >
          In-Charge Reassign
        </button>
        <button
          onClick={() => setActiveTab('templates')}
          style={{
            padding: '6px 12px',
            borderRadius: '8px',
            border: activeTab === 'templates' ? '1.5px solid #2563EB' : '1px solid #E2E8F0',
            background: activeTab === 'templates' ? '#2563EB' : '#FFFFFF',
            color: activeTab === 'templates' ? '#FFFFFF' : '#475569',
            fontSize: '11px',
            fontWeight: 700,
            cursor: 'pointer',
            whiteSpace: 'nowrap'
          }}
        >
          Industry Templates
        </button>
      </div>

      {/* 1. MANAGEMENT HUB VIEW */}
      {activeTab === 'hub' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {/* Upload New Data */}
          <div
            onClick={() => setCurrentScreen('upload_data')}
            style={{
              background: '#FFFFFF',
              border: '1px solid var(--border)',
              borderRadius: '12px',
              padding: '12px 14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '8px',
                  background: '#16A34A',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}
              >
                <Upload size={18} />
              </div>
              <div>
                <h4 style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-900)', margin: 0 }}>
                  Upload New Dataset
                </h4>
                <p style={{ fontSize: '11px', color: 'var(--text-500)', margin: '2px 0 0' }}>
                  Excel (.xlsx), CSV, PDF tables, Image OCR
                </p>
              </div>
            </div>
          </div>

          {/* Current Data / Spreadsheet */}
          <div
            onClick={() => setCurrentScreen('student_list')}
            style={{
              background: '#FFFFFF',
              border: '1px solid var(--border)',
              borderRadius: '12px',
              padding: '12px 14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '8px',
                  background: '#2563EB',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}
              >
                <FileSpreadsheet size={18} />
              </div>
              <div>
                <h4 style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-900)', margin: 0 }}>
                  View Active {currentTemplate.entityPluralLabel}
                </h4>
                <p style={{ fontSize: '11px', color: 'var(--text-500)', margin: '2px 0 0' }}>
                  Spreadsheet table, check-selection, filters
                </p>
              </div>
            </div>
          </div>

          {/* Versioning & Period Management */}
          <div
            onClick={() => setActiveTab('periods')}
            style={{
              background: '#FFFFFF',
              border: '1px solid var(--border)',
              borderRadius: '12px',
              padding: '12px 14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '8px',
                  background: '#D97706',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}
              >
                <Calendar size={18} />
              </div>
              <div>
                <h4 style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-900)', margin: 0 }}>
                  Period & Semester Versioning
                </h4>
                <p style={{ fontSize: '11px', color: 'var(--text-500)', margin: '2px 0 0' }}>
                  Manage 2026–27 Sem 1, Sem 2 & Archived datasets
                </p>
              </div>
            </div>
          </div>

          {/* In-Charge Reassignment (Section 46 & 47) */}
          <div
            onClick={() => setActiveTab('reassign')}
            style={{
              background: '#FFFFFF',
              border: '1px solid var(--border)',
              borderRadius: '12px',
              padding: '12px 14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '8px',
                  background: '#7C3AED',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}
              >
                <UserCheck size={18} />
              </div>
              <div>
                <h4 style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-900)', margin: 0 }}>
                  Teacher / Caller Reassignment
                </h4>
                <p style={{ fontSize: '11px', color: 'var(--text-500)', margin: '2px 0 0' }}>
                  Change class in-charge without losing past call logs
                </p>
              </div>
            </div>
          </div>

          {/* Industry Template Switcher (Section 51) */}
          <div
            onClick={() => setActiveTab('templates')}
            style={{
              background: '#FFFFFF',
              border: '1px solid var(--border)',
              borderRadius: '12px',
              padding: '12px 14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '8px',
                  background: '#0D9488',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}
              >
                <Globe size={18} />
              </div>
              <div>
                <h4 style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-900)', margin: 0 }}>
                  Industry Schema Templates
                </h4>
                <p style={{ fontSize: '11px', color: 'var(--text-500)', margin: '2px 0 0' }}>
                  Education, Banking, HR, Corporate, Service
                </p>
              </div>
            </div>
          </div>

          {/* Export Dataset / Report */}
          <div
            onClick={() => exportReport('csv', 'overall')}
            style={{
              background: '#FFFFFF',
              border: '1px solid var(--border)',
              borderRadius: '12px',
              padding: '12px 14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '8px',
                  background: '#475569',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}
              >
                <Download size={18} />
              </div>
              <div>
                <h4 style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-900)', margin: 0 }}>
                  Export Database (CSV / Excel)
                </h4>
                <p style={{ fontSize: '11px', color: 'var(--text-500)', margin: '2px 0 0' }}>
                  Export current dataset and historical records
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. PERIODS & ARCHIVING SUBVIEW (Sections 13 & 14) */}
      {activeTab === 'periods' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <p style={{ fontSize: '12px', color: '#64748B', margin: '0 0 4px', lineHeight: 1.4 }}>
            Historical periods are archived rather than destroyed. Call logs remain attached to historical semesters.
          </p>

          {periods.map(period => (
            <div
              key={period.id}
              style={{
                background: '#FFFFFF',
                border: period.isArchived ? '1px dashed #CBD5E1' : '1.5px solid #BFDBFE',
                borderRadius: '12px',
                padding: '14px',
                opacity: period.isArchived ? 0.75 : 1
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <h4 style={{ fontSize: '14px', fontWeight: 800, color: '#1E293B', margin: 0 }}>
                      {period.departmentOrClass}
                    </h4>
                    <span
                      style={{
                        fontSize: '10px',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        background: period.isArchived ? '#F1F5F9' : '#DCFCE7',
                        color: period.isArchived ? '#64748B' : '#15803D',
                        fontWeight: 700
                      }}
                    >
                      {period.isArchived ? 'Archived' : 'Active'}
                    </span>
                  </div>
                  <span style={{ fontSize: '12px', color: '#475569', display: 'block', marginTop: '2px' }}>
                    {period.year} • {period.semesterOrPeriod}
                  </span>
                </div>

                <span style={{ fontSize: '12px', fontWeight: 700, color: '#2563EB' }}>
                  {period.totalContacts} Contacts
                </span>
              </div>

              <div style={{ fontSize: '11px', color: '#64748B', marginBottom: '10px' }}>
                In-Charge: <strong style={{ color: '#1E293B' }}>{period.assignedCallerName || 'Unassigned'}</strong>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                {period.isArchived ? (
                  <button
                    onClick={() => restorePeriod(period.id)}
                    style={{
                      flex: 1,
                      padding: '6px',
                      borderRadius: '8px',
                      border: '1px solid #2563EB',
                      background: '#EFF6FF',
                      color: '#1D4ED8',
                      fontSize: '11px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '4px'
                    }}
                  >
                    <RotateCcw size={13} />
                    <span>Restore Dataset</span>
                  </button>
                ) : (
                  <button
                    onClick={() => archivePeriod(period.id)}
                    style={{
                      flex: 1,
                      padding: '6px',
                      borderRadius: '8px',
                      border: '1px solid #DC2626',
                      background: '#FEF2F2',
                      color: '#DC2626',
                      fontSize: '11px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '4px'
                    }}
                  >
                    <Archive size={13} />
                    <span>Archive Dataset (End Semester)</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 3. IN-CHARGE REASSIGNMENT VIEW (Sections 15 & 46) */}
      {activeTab === 'reassign' && (
        <div style={{ background: '#FFFFFF', border: '1px solid var(--border)', borderRadius: '14px', padding: '16px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: 800, color: '#1E293B', margin: '0 0 6px' }}>
            Reassign In-Charge (PRD Section 46 & 47)
          </h3>
          <p style={{ fontSize: '12px', color: '#64748B', lineHeight: 1.5, margin: '0 0 16px' }}>
            When a teacher or caller changes, contacts do not need to be recreated. Only the assignment changes. Past call history remains preserved under the previous teacher's record.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                Select Class / Dataset:
              </label>
              <select
                value={selectedPeriodToReassign}
                onChange={e => setSelectedPeriodToReassign(e.target.value)}
                className="sc-input"
                style={{ height: '42px', fontSize: '13px' }}
              >
                {periods.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.departmentOrClass} ({p.year} {p.semesterOrPeriod}) — Current: {p.assignedCallerName}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                Assign To New In-Charge / Caller:
              </label>
              <select
                value={newCallerName}
                onChange={e => setNewCallerName(e.target.value)}
                className="sc-input"
                style={{ height: '42px', fontSize: '13px' }}
              >
                <option value="Dr. Ananya Sharma">Dr. Ananya Sharma (Assistant Professor)</option>
                <option value="Mr. Kumar">Mr. Kumar (Class In-Charge)</option>
                <option value="Mr. Srinivas Rao">Mr. Srinivas Rao (Senior Admin)</option>
                <option value="Sarah Jenkins">Sarah Jenkins (Corporate Caller)</option>
              </select>
            </div>

            <button
              onClick={handleReassign}
              className="btn-primary"
              style={{ height: '44px', fontWeight: 700, marginTop: '8px' }}
            >
              Confirm Reassignment
            </button>
          </div>
        </div>
      )}

      {/* 4. INDUSTRY TEMPLATES SWITCHER (Sections 51 & 52) */}
      {activeTab === 'templates' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <p style={{ fontSize: '12px', color: '#64748B', margin: '0 0 4px', lineHeight: 1.4 }}>
            SmartCall AI is a generic platform. Switch the industry schema below to reconfigure fields, terminology, and workflows:
          </p>

          {(['education', 'banking', 'recruitment', 'corporate', 'service'] as IndustryType[]).map(type => {
            const isCurrent = currentIndustry === type;
            return (
              <div
                key={type}
                onClick={() => setIndustry(type)}
                style={{
                  background: isCurrent ? '#EFF6FF' : '#FFFFFF',
                  border: isCurrent ? '2px solid #2563EB' : '1px solid #E2E8F0',
                  borderRadius: '12px',
                  padding: '12px 14px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <h4 style={{ fontSize: '13px', fontWeight: 800, color: isCurrent ? '#1D4ED8' : '#1E293B', margin: '0 0 2px' }}>
                    {type === 'education' && '🎓 Education (Colleges & Schools)'}
                    {type === 'banking' && '🏦 Banking & Financial Collections'}
                    {type === 'recruitment' && '💼 HR & Talent Recruitment'}
                    {type === 'corporate' && '🏢 Corporate & Team Operations'}
                    {type === 'service' && '📮 Post Office & Public Services'}
                  </h4>
                  <span style={{ fontSize: '11px', color: '#64748B' }}>
                    {type === 'education' && 'ID: Roll No • Metric: Attendance % • Workflow: Absent Follow-up'}
                    {type === 'banking' && 'ID: Customer ID • Metric: EMI Due • Workflow: Recovery Calls'}
                    {type === 'recruitment' && 'ID: Candidate ID • Metric: Stage • Workflow: Interview Confirmation'}
                    {type === 'corporate' && 'ID: Employee ID • Metric: Dept • Workflow: Townhall Check-in'}
                    {type === 'service' && 'ID: Reference ID • Metric: Ticket • Workflow: Delivery Notice'}
                  </span>
                </div>
                {isCurrent && <CheckCircle size={18} color="#2563EB" />}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
