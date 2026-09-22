import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ChevronLeft, Search, Filter, CheckSquare, Square, Phone, AlertCircle, Smartphone } from 'lucide-react';
import { ContactPickerModal } from '../components/common/ContactPickerModal';

export const StudentListScreen: React.FC = () => {
  const {
    contacts,
    selectedContactIds,
    toggleSelectContact,
    selectAbsentOnly,
    selectAllContacts,
    clearContactSelection,
    addContacts,
    setCurrentScreen,
    showToast,
    currentTemplate,
    currentPeriod
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'absent' | 'selected'>('all');
  const [showContactPicker, setShowContactPicker] = useState(false);

  // Filter contacts by period and search query
  const periodContacts = contacts.filter(c => currentPeriod ? (c.periodId === currentPeriod.id || !c.periodId) : true);

  const filteredContacts = periodContacts.filter(c => {
    // Search query match
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = c.name.toLowerCase().includes(q);
      const matchPhone = c.phone.includes(q);
      const matchId = c.externalId.toLowerCase().includes(q);
      if (!matchName && !matchPhone && !matchId) return false;
    }

    // Tab filter
    if (activeFilter === 'absent') {
      return (c.overallAttendance && c.overallAttendance < 75) || c.status === 'absent' || c.priority === 'urgent' || c.priority === 'high';
    }
    if (activeFilter === 'selected') {
      return selectedContactIds.includes(c.id);
    }

    return true;
  });

  const handleProceedReady = () => {
    if (selectedContactIds.length === 0) {
      showToast('Please select at least 1 contact using checkboxes');
      return;
    }
    setCurrentScreen('ready_to_call');
  };

  const isAllVisibleSelected =
    filteredContacts.length > 0 &&
    filteredContacts.every(c => selectedContactIds.includes(c.id));

  const toggleSelectAllVisible = () => {
    if (isAllVisibleSelected) {
      filteredContacts.forEach(c => {
        if (selectedContactIds.includes(c.id)) toggleSelectContact(c.id);
      });
      showToast('Deselected visible contacts');
    } else {
      filteredContacts.forEach(c => {
        if (!selectedContactIds.includes(c.id)) toggleSelectContact(c.id);
      });
      showToast(`Selected ${filteredContacts.length} visible contacts`);
    }
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#FFFFFF', overflow: 'hidden' }}>
      {/* Top Bar with Period & In-Charge */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderBottom: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={() => setCurrentScreen('select_period')}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', color: 'var(--text-700)' }}
          >
            <ChevronLeft size={22} />
          </button>
          <div>
            <h2 style={{ fontSize: '15px', fontWeight: 800, color: 'var(--text-900)', margin: 0 }}>
              {currentPeriod ? `${currentPeriod.departmentOrClass} (${currentPeriod.semesterOrPeriod})` : 'All Contacts'}
            </h2>
            <span style={{ fontSize: '11px', color: '#64748B' }}>
              In-Charge: {currentPeriod ? (currentPeriod.assignedCallerName || 'Admin') : 'Admin'}
            </span>
          </div>
        </div>

        <span style={{ fontSize: '11px', background: '#EFF6FF', color: '#2563EB', padding: '3px 8px', borderRadius: '6px', fontWeight: 700 }}>
          {periodContacts.length} {currentTemplate.entityPluralLabel}
        </span>
      </div>

      {/* Search Input Bar (PRD Section 83) */}
      <div style={{ padding: '8px 14px', background: '#F8FAFC', borderBottom: '1px solid var(--border)' }}>
        <div style={{ position: 'relative' }}>
          <input
            type="text"
            placeholder={`Search ${currentTemplate.entityPluralLabel.toLowerCase()} by name, phone, or ${currentTemplate.idColumnHeader}...`}
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              height: '36px',
              paddingLeft: '32px',
              paddingRight: '12px',
              borderRadius: '8px',
              border: '1px solid #CBD5E1',
              fontSize: '12px',
              outline: 'none',
              background: '#FFFFFF'
            }}
          />
          <Search
            size={15}
            color="#64748B"
            style={{ position: 'absolute', left: '10px', top: '10px', pointerEvents: 'none' }}
          />
        </div>

        {/* Quick Batch Selection Chips (PRD Section 17) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '8px', overflowX: 'auto' }}>
          <button
            onClick={selectAbsentOnly}
            style={{
              padding: '4px 8px',
              borderRadius: '6px',
              border: '1px solid #FECACA',
              background: '#FEF2F2',
              color: '#DC2626',
              fontSize: '11px',
              fontWeight: 700,
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}
          >
            Select Absent ({currentTemplate.type === 'education' ? '<75%' : 'Due'})
          </button>

          <button
            onClick={() => setShowContactPicker(true)}
            style={{
              padding: '4px 8px',
              borderRadius: '6px',
              border: '1px solid #C4B5FD',
              background: '#F5F3FF',
              color: '#6D28D9',
              fontSize: '11px',
              fontWeight: 700,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <Smartphone size={12} />
            <span>Add Phone Contacts</span>
          </button>

          <button
            onClick={selectAllContacts}
            style={{
              padding: '4px 8px',
              borderRadius: '6px',
              border: '1px solid #DBEAFE',
              background: '#EFF6FF',
              color: '#1D4ED8',
              fontSize: '11px',
              fontWeight: 600,
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}
          >
            Select All ({periodContacts.length})
          </button>

          {selectedContactIds.length > 0 && (
            <button
              onClick={clearContactSelection}
              style={{
                padding: '4px 8px',
                borderRadius: '6px',
                border: '1px solid #E2E8F0',
                background: '#FFFFFF',
                color: '#64748B',
                fontSize: '11px',
                fontWeight: 600,
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
            >
              Clear Selection
            </button>
          )}
        </div>
      </div>

      {/* Spreadsheet / Excel Table (PRD Section 16 & 51) */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
          <thead>
            <tr style={{ background: '#F8FAFC', borderBottom: '1px solid var(--border)', color: 'var(--text-700)', position: 'sticky', top: 0, zIndex: 5 }}>
              <th style={{ padding: '8px 10px', width: '36px', textAlign: 'center' }}>
                <input
                  type="checkbox"
                  checked={isAllVisibleSelected}
                  onChange={toggleSelectAllVisible}
                  style={{ width: '15px', height: '15px', cursor: 'pointer' }}
                />
              </th>
              <th style={{ padding: '8px 8px', fontWeight: 700, textAlign: 'left', width: '55px' }}>
                {currentTemplate.idColumnHeader}
              </th>
              <th style={{ padding: '8px 8px', fontWeight: 700, textAlign: 'left' }}>
                {currentTemplate.entityLabel} Name
              </th>
              <th style={{ padding: '8px 8px', fontWeight: 700, textAlign: 'center', width: '80px' }}>
                {currentTemplate.statusColumnHeader}
              </th>
              <th style={{ padding: '8px 12px', fontWeight: 700, textAlign: 'right', width: '90px' }}>
                Phone
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredContacts.map(st => {
              const isChecked = selectedContactIds.includes(st.id);
              const isLowAttendance = st.overallAttendance && st.overallAttendance < 75;

              return (
                <tr
                  key={st.id}
                  onClick={() => toggleSelectContact(st.id)}
                  style={{
                    borderBottom: '1px solid var(--border)',
                    cursor: 'pointer',
                    background: isChecked ? '#EFF6FF' : '#FFFFFF',
                    transition: 'background 0.1s ease'
                  }}
                >
                  <td style={{ padding: '8px 10px', textAlign: 'center' }}>
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => {}}
                      style={{ width: '15px', height: '15px', cursor: 'pointer' }}
                    />
                  </td>
                  <td style={{ padding: '8px 8px', color: 'var(--text-700)', fontWeight: 600 }}>
                    {st.externalId}
                  </td>
                  <td style={{ padding: '8px 8px', color: 'var(--text-900)', fontWeight: 600 }}>
                    <div>{st.name}</div>
                    {st.statusNote && (
                      <span style={{ fontSize: '10px', color: '#64748B' }}>{st.statusNote}</span>
                    )}
                  </td>
                  <td style={{ padding: '8px 8px', textAlign: 'center' }}>
                    {st.overallAttendance !== undefined ? (
                      <span
                        style={{
                          fontSize: '11px',
                          fontWeight: 700,
                          padding: '2px 6px',
                          borderRadius: '4px',
                          background: isLowAttendance ? '#FEE2E2' : '#DCFCE7',
                          color: isLowAttendance ? '#DC2626' : '#15803D'
                        }}
                      >
                        {st.overallAttendance}%
                      </span>
                    ) : (
                      <span style={{ fontSize: '10px', color: '#475569', fontWeight: 600 }}>
                        {st.status || 'Active'}
                      </span>
                    )}
                  </td>
                  <td style={{ padding: '8px 12px', textAlign: 'right', color: 'var(--text-700)', fontSize: '11px' }}>
                    {st.phone.replace('+91 ', '')}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Floating Bottom Selection Bar matching image 8 & PRD Section 18 */}
      <div
        style={{
          borderTop: '1px solid var(--border)',
          background: '#FFFFFF',
          padding: '12px 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: '0 -2px 10px rgba(0,0,0,0.05)'
        }}
      >
        <div>
          <span style={{ fontSize: '14px', fontWeight: 800, color: 'var(--text-900)', display: 'block' }}>
            Selected: {selectedContactIds.length}
          </span>
          <span style={{ fontSize: '10px', color: '#64748B' }}>
            {selectedContactIds.length > 0 ? 'Ready for calling queue' : 'Select using checkboxes'}
          </span>
        </div>

        <button
          onClick={handleProceedReady}
          disabled={selectedContactIds.length === 0}
          className="btn-primary"
          style={{
            height: '42px',
            padding: '0 20px',
            fontSize: '13px',
            fontWeight: 700,
            opacity: selectedContactIds.length === 0 ? 0.6 : 1,
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <Phone size={16} />
          <span>READY TO CALL ({selectedContactIds.length})</span>
        </button>
      </div>

      {/* Local Contact Picker Modal */}
      <ContactPickerModal
        isOpen={showContactPicker}
        onClose={() => setShowContactPicker(false)}
        onImportContacts={imported => {
          addContacts(imported);
        }}
      />
    </div>
  );
};
