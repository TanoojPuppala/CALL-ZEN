import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ChevronLeft, ChevronDown, User, Calendar, Database } from 'lucide-react';

export const SelectPeriodScreen: React.FC = () => {
  const { periods, currentPeriod, setCurrentPeriod, setCurrentScreen, showToast, currentTemplate } = useApp();

  const [selectedPeriodId, setSelectedPeriodId] = useState(currentPeriod.id);

  const activePeriods = periods.filter(p => !p.isArchived);
  const selectedPeriod = periods.find(p => p.id === selectedPeriodId) || periods[0];

  const handleLoadData = () => {
    setCurrentPeriod(selectedPeriod);
    showToast(`Loaded ${selectedPeriod.departmentOrClass} (${selectedPeriod.year} • ${selectedPeriod.semesterOrPeriod})`);
    setCurrentScreen('student_list');
  };

  return (
    <div
      style={{
        flex: 1,
        padding: '16px 16px 24px',
        overflowY: 'auto',
        background: '#FFFFFF',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between'
      }}
    >
      <div>
        {/* Top Bar matching image 7 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
          <button
            onClick={() => setCurrentScreen('dashboard')}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', color: 'var(--text-700)' }}
          >
            <ChevronLeft size={22} />
          </button>
          <h2 style={{ fontSize: '17px', fontWeight: 800, color: 'var(--text-900)', margin: 0 }}>
            Select Class / Period (PRD Section 13)
          </h2>
        </div>

        {/* Dropdowns matching image 7 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
          {/* Active Period Selector */}
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-700)', marginBottom: '6px' }}>
              Select Active Batch / Class
            </label>
            <div style={{ position: 'relative' }}>
              <select
                value={selectedPeriodId}
                onChange={e => setSelectedPeriodId(e.target.value)}
                className="sc-input"
                style={{ appearance: 'none', paddingRight: '36px', height: '46px', fontSize: '13px', fontWeight: 600 }}
              >
                {activePeriods.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.departmentOrClass} — {p.year} ({p.semesterOrPeriod})
                  </option>
                ))}
              </select>
              <ChevronDown
                size={18}
                color="var(--text-500)"
                style={{ position: 'absolute', right: '12px', top: '14px', pointerEvents: 'none' }}
              />
            </div>
          </div>

          {/* Dataset Metadata Card (PRD Section 50) */}
          <div
            style={{
              background: '#F8FAFC',
              border: '1px solid #E2E8F0',
              borderRadius: '12px',
              padding: '14px',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              fontSize: '12px'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#64748B' }}>Academic / Business Year:</span>
              <strong style={{ color: '#1E293B' }}>{selectedPeriod.year}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#64748B' }}>Semester / Period:</span>
              <strong style={{ color: '#1E293B' }}>{selectedPeriod.semesterOrPeriod}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#64748B' }}>Department / Group:</span>
              <strong style={{ color: '#1E293B' }}>{selectedPeriod.departmentOrClass}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#64748B' }}>In-Charge Caller:</span>
              <strong style={{ color: '#2563EB' }}>{selectedPeriod.assignedCallerName || 'Mr. Kumar'}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#64748B' }}>Uploaded By:</span>
              <span style={{ color: '#334155' }}>{selectedPeriod.uploadedBy || 'Admin'}</span>
            </div>
          </div>

          {/* Total Summary matching image 7 */}
          <div>
            <span style={{ fontSize: '13px', color: 'var(--text-700)', display: 'block', marginBottom: '2px', fontWeight: 600 }}>
              Total {currentTemplate.entityPluralLabel} in Dataset
            </span>
            <span style={{ fontSize: '32px', fontWeight: 900, color: 'var(--text-900)' }}>
              {selectedPeriod.totalContacts}
            </span>
          </div>
        </div>
      </div>

      {/* Primary Load Data Button matching image 7 */}
      <button
        type="button"
        onClick={handleLoadData}
        className="btn-primary"
        style={{ width: '100%', height: '46px', fontSize: '15px', fontWeight: 700 }}
      >
        Load Dataset
      </button>
    </div>
  );
};
