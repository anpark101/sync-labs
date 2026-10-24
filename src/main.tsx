import React from 'react';
import { createRoot } from 'react-dom/client';
import { StoreProvider } from './store';
import App from './components/App';
import './styles.css';
import './mocks.css';

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <StoreProvider>
      <App />
    </StoreProvider>
  </React.StrictMode>
);
