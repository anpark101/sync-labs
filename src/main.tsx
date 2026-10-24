import React from 'react';
import { createRoot } from 'react-dom/client';
import { StoreProvider } from './store';
import App from './components/App';
import './styles.css';
import './mocks.css';

class BootErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { error: Error | null }
> {
  state = { error: null as Error | null };
  static getDerivedStateFromError(error: Error) {
    return { error };
  }
  render() {
    if (this.state.error) {
      return (
        <div className="boot" style={{ textAlign: 'center', padding: 24 }}>
          <div className="boot-logo">AU</div>
          <div style={{ color: 'var(--text)', fontWeight: 700, fontSize: 17 }}>Something went wrong</div>
          <div style={{ fontSize: 13.5, maxWidth: 320, lineHeight: 1.5 }}>
            The app hit an unexpected error. Your saved data is safe on this device. Reload to try again.
          </div>
          <button
            className="btn primary"
            style={{ maxWidth: 200, marginTop: 14 }}
            onClick={() => window.location.reload()}
          >
            Reload app
          </button>
          <div style={{ fontSize: 11, opacity: 0.6, marginTop: 10, wordBreak: 'break-all' }}>
            {String(this.state.error?.message || this.state.error)}
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BootErrorBoundary>
      <StoreProvider>
        <App />
      </StoreProvider>
    </BootErrorBoundary>
  </React.StrictMode>
);
