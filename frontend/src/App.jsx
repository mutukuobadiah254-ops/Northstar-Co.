import React, { useState } from 'react';
import Hero from './components/Hero';
import OrderStatus from './components/OrderStatus';
import ReturnsRefunds from './components/ReturnsRefunds';
import StockAvailability from './components/StockAvailability';

function App() {
  const [activeTab, setActiveTab] = useState('order-status');
  const [resetLoading, setResetLoading] = useState(false);
  const [resetMessage, setResetMessage] = useState('');

  const handleResetDatabase = async () => {
    setResetLoading(true);
    setResetMessage('');
    try {
      const response = await fetch('/api/seed', { method: 'POST' });
      const data = await response.json();
      if (response.ok && data.success) {
        setResetMessage('Database successfully reset and seeded!');
        // Refresh page after a short delay to reload components
        setTimeout(() => {
          window.location.reload();
        }, 1200);
      } else {
        setResetMessage('Failed to reset database.');
      }
    } catch (err) {
      console.error(err);
      setResetMessage('Error connecting to seed API.');
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div className="container">
      {/* Branding Header */}
      <header>
        <div className="logo">
          <span>🧭</span> Northstar <span>Support</span>
        </div>
        <span className="badge badge-info" style={{ fontFamily: 'Outfit, sans-serif' }}>
          Deflection MVP v1.0.0
        </span>
      </header>

      {/* Hero Welcome & Category Tabs Switcher */}
      <Hero activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Glassmorphism Portal Card */}
      <main className="card">
        {activeTab === 'order-status' ? (
          <OrderStatus />
        ) : activeTab === 'returns' ? (
          <ReturnsRefunds />
        ) : (
          <StockAvailability />
        )}
      </main>

      {/* Database Seeder Seeding Tool for Demos */}
      <div style={{ marginTop: '3.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <button
          onClick={handleResetDatabase}
          className="btn"
          disabled={resetLoading}
          style={{
            width: 'auto',
            background: 'hsla(var(--border), 0.5)',
            border: '1px dashed hsla(var(--text-muted), 0.4)',
            color: 'hsl(var(--text-secondary))',
            fontSize: '0.85rem',
            padding: '0.5rem 1.25rem',
            borderRadius: '8px'
          }}
        >
          {resetLoading ? 'Resetting...' : '🔄 Reset Demo Database'}
        </button>
        {resetMessage && (
          <div style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: 'hsl(var(--success))' }}>
            {resetMessage}
          </div>
        )}
      </div>

      {/* Footer credits */}
      <footer>
        <p>© 2026 Northstar Support Deflection MVP. Designed for Northstar Retail Co.</p>
        <p style={{ marginTop: '0.25rem', fontSize: '0.75rem', opacity: 0.6 }}>
          MERN Sprint Stack: MongoDB + Mongoose • Express • React (Vite) • Node.js
        </p>
      </footer>
    </div>
  );
}

export default App;
