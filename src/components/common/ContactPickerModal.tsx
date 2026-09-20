import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Search, Check, Smartphone, UserPlus, PhoneCall, ShieldCheck } from 'lucide-react';
import { Contact } from '../../types';

interface ContactPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportContacts: (imported: Contact[]) => void;
}

// Simulated device contacts when native picker API is not available
const deviceMockContacts = [
  { name: 'Amitabh Verma', phone: '+91 9820112233', category: 'Personal Contact' },
  { name: 'Bhavna Chawla', phone: '+91 9833445566', category: 'Mobile Contacts' },
  { name: 'Chirag Desai', phone: '+91 9876543210', category: 'SIM Contact' },
  { name: 'Deepika Rao', phone: '+91 9920123456', category: 'Mobile Contacts' },
  { name: 'Eshwar Murthy', phone: '+91 9845012345', category: 'Office' },
  { name: 'Farhan Akhtar', phone: '+91 9811223344', category: 'Mobile Contacts' },
  { name: 'Geeta Subramanian', phone: '+91 9871234567', category: 'Client' },
  { name: 'Harish Nair', phone: '+91 9884012345', category: 'Mobile Contacts' },
  { name: 'Ishita Roy', phone: '+91 9830112233', category: 'SIM Contact' },
  { name: 'Jatin Malhotra', phone: '+91 9810987654', category: 'Mobile Contacts' }
];

export const ContactPickerModal: React.FC<ContactPickerModalProps> = ({
  isOpen,
  onClose,
  onImportContacts
}) => {
  const { currentOrg, currentPeriod, showToast } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndices, setSelectedIndices] = useState<number[]>([0, 1, 2]);
  const [isLoadingNative, setIsLoadingNative] = useState(false);

  if (!isOpen) return null;

  // Try Android Chrome Native Contact Picker API
  const handleLaunchNativePicker = async () => {
    if ('contacts' in navigator && 'ContactsManager' in window) {
      try {
        setIsLoadingNative(true);
        const props = ['name', 'tel'];
        const opts = { multiple: true };
        const contacts = await (navigator as any).contacts.select(props, opts);

        if (contacts && contacts.length > 0) {
          const imported: Contact[] = contacts.map((c: any, index: number) => {
            const contactName = Array.isArray(c.name) ? c.name[0] : (c.name || `Mobile Contact ${index + 1}`);
            const contactPhone = Array.isArray(c.tel) ? c.tel[0] : (c.tel || '+91 9800000000');
            return {
              id: `native-contact-${Date.now()}-${index}`,
              organizationId: currentOrg.id,
              periodId: currentPeriod.id,
              externalId: `MOB-${(index + 1).toString().padStart(2, '0')}`,
              name: contactName,
              phone: contactPhone.startsWith('+') ? contactPhone : `+91 ${contactPhone}`,
              department: currentPeriod.departmentOrClass,
              category: 'Needs Follow-up',
              overallAttendance: 65,
              status: 'absent',
              createdAt: new Date().toISOString()
            };
          });

          onImportContacts(imported);
          showToast(`Imported ${imported.length} contacts directly from phone!`);
          onClose();
          return;
        }
      } catch (err: any) {
        console.warn('Native contact picker cancelled or unavailable:', err);
      } finally {
        setIsLoadingNative(false);
      }
    } else {
      showToast('Opening mobile contacts directory...');
    }
  };

  const filtered = deviceMockContacts.filter(
    c => c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.phone.includes(searchQuery)
  );

  const toggleSelect = (index: number) => {
    if (selectedIndices.includes(index)) {
      setSelectedIndices(selectedIndices.filter(i => i !== index));
    } else {
      setSelectedIndices([...selectedIndices, index]);
    }
  };

  const handleSelectAll = () => {
    if (selectedIndices.length === filtered.length) {
      setSelectedIndices([]);
    } else {
      setSelectedIndices(filtered.map((_, i) => i));
    }
  };

  const handleConfirmImport = () => {
    if (selectedIndices.length === 0) {
      showToast('Please select at least one contact to import');
      return;
    }

    const imported: Contact[] = selectedIndices.map(idx => {
      const c = deviceMockContacts[idx];
      return {
        id: `phone-contact-${Date.now()}-${idx}`,
        organizationId: currentOrg.id,
        periodId: currentPeriod.id,
        externalId: `MOB-${(idx + 1).toString().padStart(2, '0')}`,
        name: c.name,
        phone: c.phone,
        department: currentPeriod.departmentOrClass,
        category: 'Needs Follow-up',
        overallAttendance: 68,
        status: 'absent',
        createdAt: new Date().toISOString()
      };
    });

    onImportContacts(imported);
    showToast(`Imported ${imported.length} contacts into SmartCall AI!`);
    onClose();
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(15, 23, 42, 0.8)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 140,
        padding: '16px'
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: '#FFFFFF',
          borderRadius: '20px',
          width: '100%',
          maxWidth: '440px',
          maxHeight: '86vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 20px 40px rgba(0,0,0,0.35)',
          overflow: 'hidden'
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: '16px 18px 12px',
            borderBottom: '1px solid #E2E8F0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: '#EFF6FF',
                color: '#2563EB',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Smartphone size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#1E293B', margin: 0 }}>
                Select Local Mobile Contacts
              </h3>
              <span style={{ fontSize: '11px', color: '#64748B' }}>Device Phonebook Integration</span>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Action Button: Android System Contact Picker */}
        <div style={{ padding: '12px 18px 8px' }}>
          <button
            type="button"
            onClick={handleLaunchNativePicker}
            disabled={isLoadingNative}
            style={{
              width: '100%',
              padding: '10px 14px',
              borderRadius: '10px',
              border: '1.5px dashed #3B82F6',
              background: '#EFF6FF',
              color: '#1D4ED8',
              fontWeight: 700,
              fontSize: '12px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            <PhoneCall size={16} />
            {isLoadingNative ? 'Opening Phonebook...' : 'Open Native Android Contact Sheet'}
          </button>
        </div>

        {/* Search Bar */}
        <div style={{ padding: '4px 18px 10px' }}>
          <div style={{ position: 'relative' }}>
            <Search size={15} color="#94A3B8" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search phone contacts by name or number..."
              style={{
                width: '100%',
                padding: '8px 12px 8px 32px',
                borderRadius: '8px',
                border: '1px solid #CBD5E1',
                fontSize: '12px',
                outline: 'none',
                background: '#F8FAFC'
              }}
            />
          </div>
        </div>

        {/* Contact List */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '0 18px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '11px', fontWeight: 600, color: '#64748B' }}>
              Select Contacts ({selectedIndices.length} selected)
            </span>
            <button
              onClick={handleSelectAll}
              style={{ background: 'none', border: 'none', color: '#2563EB', fontSize: '11px', fontWeight: 700, cursor: 'pointer' }}
            >
              {selectedIndices.length === filtered.length ? 'Deselect All' : 'Select All'}
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {filtered.map((contact, idx) => {
              const isSelected = selectedIndices.includes(idx);
              return (
                <div
                  key={idx}
                  onClick={() => toggleSelect(idx)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 12px',
                    borderRadius: '10px',
                    background: isSelected ? '#EFF6FF' : '#F8FAFC',
                    border: isSelected ? '1.5px solid #3B82F6' : '1px solid #E2E8F0',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        background: isSelected ? '#2563EB' : '#E2E8F0',
                        color: isSelected ? '#FFFFFF' : '#475569',
                        fontWeight: 700,
                        fontSize: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      {contact.name.charAt(0)}
                    </div>
                    <div>
                      <strong style={{ fontSize: '12px', color: '#1E293B', display: 'block' }}>
                        {contact.name}
                      </strong>
                      <span style={{ fontSize: '10px', color: '#64748B' }}>{contact.phone}</span>
                    </div>
                  </div>

                  <div
                    style={{
                      width: '20px',
                      height: '20px',
                      borderRadius: '5px',
                      border: isSelected ? '2px solid #2563EB' : '1.5px solid #CBD5E1',
                      background: isSelected ? '#2563EB' : '#FFFFFF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#FFFFFF'
                    }}
                  >
                    {isSelected && <Check size={14} />}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer Actions */}
        <div
          style={{
            padding: '12px 18px',
            borderTop: '1px solid #E2E8F0',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}
        >
          <button
            onClick={onClose}
            style={{
              flex: 1,
              height: '38px',
              borderRadius: '10px',
              border: '1px solid #CBD5E1',
              background: '#FFFFFF',
              color: '#475569',
              fontWeight: 600,
              fontSize: '12px',
              cursor: 'pointer'
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleConfirmImport}
            className="btn-primary"
            style={{
              flex: 2,
              height: '38px',
              borderRadius: '10px',
              fontSize: '12px',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            <UserPlus size={15} />
            Import {selectedIndices.length} Contacts
          </button>
        </div>
      </div>
    </div>
  );
};
