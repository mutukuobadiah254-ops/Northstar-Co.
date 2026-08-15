import React, { useState } from 'react';

const OrderStatus = () => {
  const [orderIdInput, setOrderIdInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [order, setOrder] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    const formattedId = orderIdInput.trim();

    if (!formattedId) {
      setError('Please enter an Order ID.');
      setOrder(null);
      return;
    }

    // Client-side validation: match "NS" followed by exactly 4 digits
    const orderIdRegex = /^NS\d{4}$/i;
    if (!orderIdRegex.test(formattedId)) {
      setError("Invalid Order ID format. It must start with 'NS' followed by 4 digits (e.g., NS1001).");
      setOrder(null);
      return;
    }

    setLoading(true);
    setError('');
    setOrder(null);

    try {
      const response = await fetch(`/api/orders/${formattedId}`);
      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'An error occurred while fetching order details.');
      } else {
        setOrder(data.order);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to connect to the server. Please check if the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  // Helper to determine status badge style class
  const getStatusBadge = (status) => {
    switch (status) {
      case 'Delivered': return 'badge-success';
      case 'Shipped': return 'badge-info';
      case 'Processing': return 'badge-warning';
      case 'Cancelled': return 'badge-danger';
      default: return 'badge-info';
    }
  };

  // Helper to determine progress width of the fulfillment timeline
  const getFulfillmentProgressWidth = () => {
    if (!order) return '0%';
    if (order.orderStatus === 'Processing') return '0%';
    if (order.orderStatus === 'Shipped') return '50%';
    if (order.orderStatus === 'Delivered') return '100%';
    return '0%';
  };

  return (
    <div>
      <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <span>🧭</span> Order Tracking &amp; Status
      </h2>

      <form onSubmit={handleSearch} style={{ marginBottom: '2rem' }}>
        <div className="form-group">
          <label className="form-label" htmlFor="order-status-input">
            Enter your Order ID (starts with NS, e.g. NS1006)
          </label>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <input
              id="order-status-input"
              type="text"
              className="input-control"
              placeholder="e.g. NS1006"
              value={orderIdInput}
              onChange={(e) => setOrderIdInput(e.target.value)}
              disabled={loading}
              style={{ textTransform: 'uppercase' }}
            />
            <button 
              type="submit" 
              className="btn btn-primary" 
              disabled={loading}
              style={{ width: 'auto', paddingLeft: '2rem', paddingRight: '2rem' }}
            >
              {loading ? <div className="loading-spinner"></div> : 'Track Order'}
            </button>
          </div>
        </div>
      </form>

      {error && (
        <div className="alert alert-danger">
          <span style={{ fontSize: '1.2rem' }}>⚠️</span>
          <div>
            <strong>Error:</strong> {error}
          </div>
        </div>
      )}

      {order && (
        <div className="result-box">
          <div className="result-header">
            <h3 className="result-title">Order {order.orderId}</h3>
            <span className={`badge ${getStatusBadge(order.orderStatus)}`}>
              {order.orderStatus}
            </span>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ fontSize: '0.85rem', color: 'hsl(var(--text-secondary))', marginBottom: '0.5rem' }}>
              Customer Details
            </div>
            <div style={{ fontWeight: '600', fontSize: '1.05rem' }}>{order.customerName}</div>
            <div style={{ fontSize: '0.9rem', color: 'hsl(var(--text-muted))' }}>{order.customerEmail}</div>
          </div>

          <div style={{ marginBottom: '1.5rem', borderTop: '1px solid hsla(var(--border), 0.3)', paddingTop: '1rem' }}>
            <div style={{ fontSize: '0.85rem', color: 'hsl(var(--text-secondary))', marginBottom: '0.5rem' }}>
              Ordered Items
            </div>
            {order.items.map((item, idx) => (
              <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem', margin: '0.35rem 0' }}>
                <div>
                  <span style={{ color: 'hsl(var(--text-secondary))' }}>{item.quantity}x</span> {item.name}
                </div>
                <div style={{ fontWeight: '500' }}>${(item.price * item.quantity).toFixed(2)}</div>
              </div>
            ))}
          </div>

          {/* Fulfillment Stepper */}
          {order.orderStatus !== 'Cancelled' ? (
            <div style={{ marginTop: '2.5rem', borderTop: '1px solid hsla(var(--border), 0.3)', paddingTop: '1.5rem' }}>
              <div style={{ fontSize: '0.85rem', color: 'hsl(var(--text-secondary))', textAlign: 'center', marginBottom: '1.25rem' }}>
                Fulfillment Stage progress
              </div>
              <div className="status-tracker">
                <div className="tracker-line-fill" style={{ width: getFulfillmentProgressWidth() }}></div>
                
                <div className="tracker-step completed">
                  <div className="tracker-node">1</div>
                  <div className="tracker-label">Processing</div>
                </div>

                <div className={`tracker-step ${
                  order.orderStatus === 'Shipped' || order.orderStatus === 'Delivered' ? 'completed' : 'active'
                }`}>
                  <div className="tracker-node">2</div>
                  <div className="tracker-label">Shipped</div>
                </div>

                <div className={`tracker-step ${order.orderStatus === 'Delivered' ? 'completed' : ''}`}>
                  <div className="tracker-node">3</div>
                  <div className="tracker-label">Delivered</div>
                </div>
              </div>
            </div>
          ) : (
            <div className="alert alert-danger" style={{ marginTop: '1.5rem', marginBottom: 0 }}>
              <span style={{ fontSize: '1.2rem' }}>❌</span>
              <div>
                <strong>Order Cancelled:</strong> This order has been cancelled and will not be shipped. If you have already been charged, a refund has been issued automatically to your payment method.
              </div>
            </div>
          )}

          {/* Status descriptive cards */}
          {order.orderStatus === 'Processing' && (
            <div className="alert alert-warning" style={{ marginTop: '1.5rem', marginBottom: 0, backgroundColor: 'hsla(38, 92%, 50%, 0.12)', color: '#ffeca3', borderColor: 'hsla(38, 92%, 50%, 0.25)' }}>
              <span style={{ fontSize: '1.2rem' }}>⚙️</span>
              <div>
                <strong>Fulfillment Processing:</strong> We are currently packing and preparing your order for shipment. You will receive an email tracking link as soon as it leaves our warehouse.
              </div>
            </div>
          )}

          {order.orderStatus === 'Shipped' && (
            <div className="alert alert-warning" style={{ marginTop: '1.5rem', marginBottom: 0, backgroundColor: 'hsla(200, 80%, 50%, 0.12)', color: '#a3d9ff', borderColor: 'hsla(200, 80%, 50%, 0.25)' }}>
              <span style={{ fontSize: '1.2rem' }}>🚚</span>
              <div>
                <strong>In Transit:</strong> Your order has shipped and is currently in transit with our logistics partner. Estimated delivery is within 2-3 business days.
              </div>
            </div>
          )}

          {order.orderStatus === 'Delivered' && (
            <div className="alert alert-warning" style={{ marginTop: '1.5rem', marginBottom: 0, backgroundColor: 'hsla(142, 70%, 45%, 0.12)', color: '#a3f3b9', borderColor: 'hsla(142, 70%, 45%, 0.25)' }}>
              <span style={{ fontSize: '1.2rem' }}>🏠</span>
              <div>
                <strong>Delivered:</strong> This package was delivered to your address. If you cannot find the package, please check with neighbors or look around your building entrance before contacting support.
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default OrderStatus;
