import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle, Info } from 'lucide-react';

export const Toast: React.FC = () => {
  const { toastMessage } = useApp();

  if (!toastMessage) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        backgroundColor: '#1E293B',
        color: '#FFFFFF',
        padding: '10px 18px',
        borderRadius: 'var(--radius-full)',
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.25)',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        fontSize: '13px',
        fontWeight: 500,
        zIndex: 200,
        pointerEvents: 'none',
        animation: 'fadeIn 0.2s ease-out'
      }}
    >
      <Info size={16} color="var(--primary-500)" />
      <span>{toastMessage}</span>
    </div>
  );
};
