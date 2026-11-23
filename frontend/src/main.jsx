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
      localStorage.removeItem('aura_cart');
    } catch (e) {}
    window.location.reload();
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
            Connecting to Live Luxury Catalog...
          </p>
          <div className="max-w-md p-4 bg-zinc-900 border border-zinc-800 rounded-2xl text-xs text-zinc-400 mb-6 font-mono text-left overflow-auto max-h-32">
            {this.state.error?.message || 'Component loading refresh needed'}
          </div>
          <button
            onClick={this.handleReload}
            className="px-6 py-3 bg-gradient-to-r from-amber-400 to-amber-500 text-zinc-950 font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-amber-500/20 hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            Reload Store & Refresh Cache &rarr;
          </button>
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
