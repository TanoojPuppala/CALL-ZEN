import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Smartphone, UserPlus, PhoneCall, ShieldCheck } from 'lucide-react';
import { Contact } from '../../types';

interface ContactPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportContacts: (imported: Contact[]) => void;
}

export const ContactPickerModal: React.FC<ContactPickerModalProps> = ({
  isOpen,
  onClose,
  onImportContacts
}) => {
  const { currentOrg, currentPeriod, showToast } = useApp();
  const [manualName, setManualName] = useState('');
  const [manualPhone, setManualPhone] = useState('');
  const [manualId, setManualId] = useState('');
  const [isLoadingNative, setIsLoadingNative] = useState(false);

  if (!isOpen) return null;

  // Launch Android Native Contact Picker API
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
            const contactPhone = Array.isArray(c.tel) ? c.tel[0] : (c.tel || '');
            return {
              id: `native-contact-${Date.now()}-${index}`,
              organizationId: currentOrg ? currentOrg.id : 'org-default',
              periodId: currentPeriod ? currentPeriod.id : 'period-default',
              externalId: `MOB-${(index + 1).toString().padStart(2, '0')}`,
              name: contactName,
              phone: contactPhone.startsWith('+') ? contactPhone : `+91 ${contactPhone}`,
              department: currentPeriod ? currentPeriod.departmentOrClass : 'General',
              category: 'Regular',
              overallAttendance: 100,
              status: 'present',
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
      showToast('Native Contact Picker API requires supporting browser/device permissions.');
    }
  };

  const handleAddManualContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualName.trim() || !manualPhone.trim()) {
      showToast('Please enter both Name and Phone number.');
      return;
    }

    const newContact: Contact = {
      id: `manual-contact-${Date.now()}`,
      organizationId: currentOrg ? currentOrg.id : 'org-default',
      periodId: currentPeriod ? currentPeriod.id : 'period-default',
      externalId: manualId.trim() || `ID-${Math.floor(100 + Math.random() * 900)}`,
      name: manualName.trim(),
      phone: manualPhone.trim().startsWith('+') ? manualPhone.trim() : `+91 ${manualPhone.trim()}`,
      department: currentPeriod ? currentPeriod.departmentOrClass : 'General',
      category: 'Regular',
      overallAttendance: 100,
      status: 'present',
      createdAt: new Date().toISOString()
    };

    onImportContacts([newContact]);
    setManualName('');
    setManualPhone('');
    setManualId('');
    showToast(`Added ${newContact.name} to contacts`);
    onClose();
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        background: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px'
      }}
    >
      <div
        style={{
          background: '#FFFFFF',
          borderRadius: '16px',
          width: '100%',
          maxWidth: '420px',
          padding: '20px',
          boxShadow: '0 20px 25px -5px rgba(0,0,0,0.2)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <UserPlus size={20} color="#2563EB" />
            <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0F172A', margin: 0 }}>Add Contact</h3>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}>
            <X size={20} />
          </button>
        </div>

        <button
          type="button"
          onClick={handleLaunchNativePicker}
          disabled={isLoadingNative}
          style={{
            width: '100%',
            height: '44px',
            background: '#EFF6FF',
            border: '1px solid #BFDBFE',
            color: '#1D4ED8',
            borderRadius: '10px',
            fontSize: '13px',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            cursor: 'pointer',
            marginBottom: '16px'
          }}
        >
          <Smartphone size={18} />
          <span>{isLoadingNative ? 'Opening Contacts...' : 'Import from Device Address Book'}</span>
        </button>

        <div style={{ textAlign: 'center', color: '#94A3B8', fontSize: '11px', fontWeight: 600, margin: '12px 0' }}>
          — OR ENTER MANUALLY —
        </div>

        <form onSubmit={handleAddManualContact} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div>
            <label style={{ fontSize: '11px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>
              Contact Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. John Doe"
              value={manualName}
              onChange={e => setManualName(e.target.value)}
              style={{ width: '100%', height: '38px', padding: '0 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13px' }}
            />
          </div>

          <div>
            <label style={{ fontSize: '11px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>
              Phone Number *
            </label>
            <input
              type="tel"
              required
              placeholder="e.g. +91 9876543210"
              value={manualPhone}
              onChange={e => setManualPhone(e.target.value)}
              style={{ width: '100%', height: '38px', padding: '0 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13px' }}
            />
          </div>

          <div>
            <label style={{ fontSize: '11px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>
              ID / Roll No (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. 01 or CUST-101"
              value={manualId}
              onChange={e => setManualId(e.target.value)}
              style={{ width: '100%', height: '38px', padding: '0 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13px' }}
            />
          </div>

          <button
            type="submit"
            className="btn-primary"
            style={{ height: '42px', fontSize: '13px', fontWeight: 700, borderRadius: '10px', marginTop: '8px' }}
          >
            Save Contact
          </button>
        </form>
      </div>
    </div>
  );
};
