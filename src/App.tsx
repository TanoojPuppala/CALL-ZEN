import React from 'react';
import { AppProvider } from './context/AppContext';
import { AppShell } from './components/common/AppShell';
import './styles/theme.css';

export const App: React.FC = () => {
  return (
    <AppProvider>
      <AppShell />
    </AppProvider>
  );
};

export default App;
