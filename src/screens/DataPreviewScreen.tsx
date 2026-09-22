import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ChevronLeft, Edit2, Check, AlertCircle, Save } from 'lucide-react';
import { Contact } from '../types';

export const DataPreviewScreen: React.FC = () => {
  const {
    setCurrentScreen,
    showToast,
    uploadedPreviewData,
    addContacts,
    currentTemplate,
    currentPeriod
  } = useApp();

  const [isEditing, setIsEditing] = useState(false);

  const [records, setRecords] = useState<Contact[]>(uploadedPreviewData);

  if (records.length === 0) {
    return (
      <div style={{ flex: 1, padding: '24px 16px', textAlign: 'center', background: '#FFFFFF' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#1E293B', margin: '0 0 8px' }}>No Data Selected for Preview</h3>
        <p style={{ fontSize: '12px', color: '#64748B', margin: '0 0 16px' }}>Please upload or select a CSV/Excel file to extract contacts.</p>
        <button
          type="button"
          onClick={() => setCurrentScreen('upload_data')}
          className="btn-primary"
          style={{ height: '40px', padding: '0 20px', borderRadius: '8px', fontSize: '13px', fontWeight: 700 }}
        >
          Go to Upload Data
        </button>
      </div>
    );
  }

  const handleSave = () => {
    addContacts(records);
    showToast(`Saved ${records.length} validated records to ${currentPeriod ? currentPeriod.departmentOrClass : 'Dataset'}`);
    setCurrentScreen('student_list');
  };

  const handleFieldChange = (idx: number, field: keyof Contact, val: string) => {
    setRecords(prev => {
      const copy = [...prev];
      copy[idx] = { ...copy[idx], [field]: val };
      return copy;
    });
  };

  return (
    <div
      style={{
        flex: 1,
        padding: '16px 16px 20px',
        overflowY: 'auto',
        background: '#FFFFFF',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between'
      }}
    >
      <div>
        {/* Top Bar matching image 6 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
          <button
            onClick={() => setCurrentScreen('upload_data')}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', color: 'var(--text-700)' }}
          >
            <ChevronLeft size={22} />
          </button>
          <h2 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-900)', margin: 0 }}>
            Preview Extracted Data (PRD Section 12)
          </h2>
        </div>

        {/* Validation Notice Box */}
        <div
          style={{
            background: '#F0FDF4',
            border: '1px solid #BBF7D0',
            borderRadius: '10px',
            padding: '10px 12px',
            marginBottom: '14px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <AlertCircle size={16} color="#16A34A" />
          <span style={{ fontSize: '11px', color: '#15803D', fontWeight: 600 }}>
            {records.length} records extracted and schema-validated. Admin review required.
          </span>
        </div>

        {/* Clean Table matching image 6 with configurable column headers */}
        <div style={{ border: '1px solid var(--border)', borderRadius: '10px', overflow: 'hidden', marginBottom: '16px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
            <thead>
              <tr style={{ background: '#F8FAFC', borderBottom: '1px solid var(--border)', color: 'var(--text-700)' }}>
                <th style={{ padding: '8px 10px', fontWeight: 700, textAlign: 'left', width: '55px' }}>
                  {currentTemplate.idColumnHeader}
                </th>
                <th style={{ padding: '8px 10px', fontWeight: 700, textAlign: 'left' }}>
                  {currentTemplate.entityLabel} Name
                </th>
                <th style={{ padding: '8px 10px', fontWeight: 700, textAlign: 'right' }}>Phone Number</th>
              </tr>
            </thead>
            <tbody>
              {records.map((st, idx) => (
                <tr key={st.id || idx} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '8px 10px', color: 'var(--text-700)', fontWeight: 600 }}>
                    {isEditing ? (
                      <input
                        type="text"
                        value={st.externalId}
                        onChange={e => handleFieldChange(idx, 'externalId', e.target.value)}
                        style={{ border: '1px solid #BFDBFE', padding: '2px 4px', borderRadius: '4px', width: '40px' }}
                      />
                    ) : (
                      st.externalId
                    )}
                  </td>
                  <td style={{ padding: '8px 10px', color: 'var(--text-900)', fontWeight: 600 }}>
                    {isEditing ? (
                      <input
                        type="text"
                        value={st.name}
                        onChange={e => handleFieldChange(idx, 'name', e.target.value)}
                        style={{ border: '1px solid #BFDBFE', padding: '2px 6px', borderRadius: '4px', width: '100%' }}
                      />
                    ) : (
                      st.name
                    )}
                  </td>
                  <td style={{ padding: '8px 10px', textAlign: 'right', color: 'var(--text-700)' }}>
                    {isEditing ? (
                      <input
                        type="text"
                        value={st.phone}
                        onChange={e => handleFieldChange(idx, 'phone', e.target.value)}
                        style={{ border: '1px solid #BFDBFE', padding: '2px 4px', borderRadius: '4px', width: '110px', textAlign: 'right' }}
                      />
                    ) : (
                      st.phone
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Action Buttons matching image 6 (Edit & Save Data) */}
      <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
        <button
          type="button"
          onClick={() => {
            setIsEditing(!isEditing);
            showToast(isEditing ? 'Editing mode saved' : 'Click fields to modify extracted data');
          }}
          className="btn-secondary"
          style={{
            flex: 1,
            height: '42px',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px'
          }}
        >
          {isEditing ? <Check size={16} /> : <Edit2 size={16} />}
          <span>{isEditing ? 'Done' : 'Edit'}</span>
        </button>

        <button
          type="button"
          onClick={handleSave}
          className="btn-primary"
          style={{
            flex: 2,
            height: '42px',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px'
          }}
        >
          <Save size={16} />
          <span>Confirm & Save</span>
        </button>
      </div>
    </div>
  );
};
