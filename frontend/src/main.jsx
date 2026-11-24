import React, { Component } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('NIKK AURA Runtime Boundary Caught:', error, errorInfo);
  }

  handleReload = () => {
    try {
      localStorage.clear();
      sessionStorage.clear();
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistrations().then(regs => {
          for (const reg of regs) reg.unregister();
        });
      }
    } catch (e) {}
    window.location.href = window.location.origin + window.location.pathname + '?reset=' + Date.now();
  };

  handleContinueGuest = () => {
    try {
      localStorage.removeItem('aura_token');
      localStorage.removeItem('aura_mock_user');
    } catch (e) {}
    this.setState({ hasError: false, error: null });
    window.location.href = window.location.origin + window.location.pathname + '?guest=true';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-zinc-950 text-white flex flex-col items-center justify-center p-6 text-center">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-400/30 flex items-center justify-center text-amber-400 font-serif font-black text-2xl mb-4 shadow-[0_0_40px_rgba(245,158,11,0.2)]">
            NA
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold tracking-tight mb-2">
            NIKK <span className="text-amber-400 font-light italic">AURA</span>
          </h1>
          <p className="text-xs text-zinc-400 uppercase tracking-widest mb-6">
            Luxury Living & Essentials • Recovery Portal
          </p>
          <div className="max-w-md p-4 bg-zinc-900 border border-zinc-800 rounded-2xl text-xs text-zinc-400 mb-6 font-mono text-left overflow-auto max-h-32">
            {String(this.state.error?.message || this.state.error || 'Fresh catalog sync initialized')}
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={this.handleReload}
              className="px-6 py-3 bg-gradient-to-r from-amber-400 to-amber-500 text-zinc-950 font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-amber-500/20 hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              Clear Cache & Refresh Store &rarr;
            </button>
            <button
              onClick={this.handleContinueGuest}
              className="px-6 py-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-bold text-xs uppercase tracking-wider rounded-xl border border-zinc-700 hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              Continue as Guest &rarr;
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);
