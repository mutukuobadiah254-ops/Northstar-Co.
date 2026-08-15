import React from 'react';

const Hero = ({ activeTab, setActiveTab }) => {
  return (
    <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
      <h1 style={{ 
        fontSize: '2.75rem', 
        marginBottom: '1.25rem', 
        lineHeight: '1.2',
        background: 'linear-gradient(135deg, #FFF 40%, hsl(var(--text-secondary)) 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent'
      }}>
        How can we help you today?
      </h1>
      <p style={{ 
        color: 'hsl(var(--text-secondary))', 
        fontSize: '1.1rem',
        maxWidth: '650px', 
        margin: '0 auto 2.5rem auto' 
      }}>
        Select a support topic below. Our deflection system coordinates directly with active logistics and fulfillment tracking databases to help you instantly.
      </p>
      
      <div className="tab-container" style={{ gridTemplateColumns: '1fr 1fr 1fr' }}>
        <button 
          className={`tab-btn ${activeTab === 'order-status' ? 'active' : ''}`}
          onClick={() => setActiveTab('order-status')}
        >
          🧭 Order Status
        </button>
        <button 
          className={`tab-btn ${activeTab === 'returns' ? 'active' : ''}`}
          onClick={() => setActiveTab('returns')}
        >
          🔄 Returns &amp; Refunds
        </button>
        <button 
          className={`tab-btn ${activeTab === 'stock' ? 'active' : ''}`}
          onClick={() => setActiveTab('stock')}
        >
          📦 Stock Availability
        </button>
      </div>
    </div>
  );
};

export default Hero;
