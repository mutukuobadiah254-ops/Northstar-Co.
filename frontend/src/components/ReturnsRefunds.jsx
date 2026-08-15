import React, { useState } from 'react';

const ReturnsRefunds = () => {
  const [orderIdInput, setOrderIdInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [order, setOrder] = useState(null);
  
  const [submittingReturn, setSubmittingReturn] = useState(false);
  const [returnSuccessMsg, setReturnSuccessMsg] = useState('');

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
    setReturnSuccessMsg('');
    setOrder(null);

    try {
      const response = await fetch(`/api/orders/${formattedId}`);
      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'An error occurred while fetching order status.');
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

  const handleInitiateReturn = async () => {
    if (!order) return;
    
    setSubmittingReturn(true);
    setError('');
    setReturnSuccessMsg('');

    try {
      const response = await fetch(`/api/orders/${order.orderId}/return`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Failed to submit return request.');
      } else {
        setReturnSuccessMsg('Return request successfully submitted!');
        // Update local state with new order statuses
        setOrder(prev => ({
          ...prev,
          returnStatus: data.order.returnStatus,
          refundStatus: data.order.refundStatus
        }));
      }
    } catch (err) {
      console.error(err);
      setError('Connection error while submitting return request.');
    } finally {
      setSubmittingReturn(false);
    }
  };

  // Helper to determine return badge style class
  const getReturnBadge = (status) => {
    switch (status) {
      case 'Approved': return 'badge-success';
      case 'Pending': return 'badge-warning';
      case 'Rejected': return 'badge-danger';
      default: return 'badge-info';
    }
  };

  // Helper to determine refund badge style class
  const getRefundBadge = (status) => {
    switch (status) {
      case 'Completed': return 'badge-success';
      case 'Pending': return 'badge-warning';
      default: return 'badge-info';
    }
  };

  // Helper to determine width of tracker line fill
  const getTrackerProgressWidth = () => {
    if (!order) return '0%';
    if (order.returnStatus === 'None') return '0%';
    if (order.returnStatus === 'Rejected') return '66%';
    if (order.refundStatus === 'Completed') return '100%';
    if (order.returnStatus === 'Approved') return '66%';
    if (order.returnStatus === 'Pending') return '33%';
    return '0%';
  };

  return (
    <div>
      <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <span>🔄</span> Returns &amp; Refunds Support
      </h2>

      <form onSubmit={handleSearch} style={{ marginBottom: '2rem' }}>
        <div className="form-group">
          <label className="form-label" htmlFor="order-id-input">
            Enter your Order ID (starts with NS, e.g. NS1001)
          </label>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <input
              id="order-id-input"
              type="text"
              className="input-control"
              placeholder="e.g. NS1001"
              value={orderIdInput}
              onChange={(e) => setOrderIdInput(e.target.value)}
              disabled={loading || submittingReturn}
              style={{ textTransform: 'uppercase' }}
            />
            <button 
              type="submit" 
              className="btn btn-primary" 
              disabled={loading || submittingReturn}
              style={{ width: 'auto', paddingLeft: '2rem', paddingRight: '2rem' }}
            >
              {loading ? <div className="loading-spinner"></div> : 'Check Status'}
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

      {returnSuccessMsg && (
        <div className="alert alert-warning" style={{ backgroundColor: 'hsla(142, 70%, 45%, 0.12)', color: '#a3f3b9', borderColor: 'hsla(142, 70%, 45%, 0.25)' }}>
          <span style={{ fontSize: '1.2rem' }}>✅</span>
          <div>
            <strong>Success:</strong> {returnSuccessMsg}
          </div>
        </div>
      )}

      {order && (
        <div className="result-box">
          <div className="result-header">
            <h3 className="result-title">Order {order.orderId}</h3>
            <span className={`badge ${order.eligibleForReturn ? 'badge-success' : 'badge-danger'}`}>
              {order.eligibleForReturn ? 'Return Eligible' : 'Not Return Eligible'}
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

          {/* Workflow Status Info */}
          <div style={{ borderTop: '1px solid hsla(var(--border), 0.3)', paddingTop: '1rem' }}>
            <div className="result-row">
              <span>Return Status</span>
              <span className={`badge ${getReturnBadge(order.returnStatus)}`}>
                {order.returnStatus === 'None' ? 'Not Initiated' : order.returnStatus}
              </span>
            </div>
            <div className="result-row">
              <span>Refund Status</span>
              <span className={`badge ${getRefundBadge(order.refundStatus)}`}>
                {order.refundStatus === 'None' ? 'No Refund Processed' : order.refundStatus}
              </span>
            </div>
          </div>

          {/* Visual Progress Timeline */}
          {order.returnStatus !== 'None' && (
            <div style={{ marginTop: '2rem', borderTop: '1px solid hsla(var(--border), 0.3)', paddingTop: '1.5rem' }}>
              <div style={{ fontSize: '0.85rem', color: 'hsl(var(--text-secondary))', textAlign: 'center', marginBottom: '1rem' }}>
                Visual Return Progress Timeline
              </div>
              <div className="status-tracker">
                <div className="tracker-line-fill" style={{ width: getTrackerProgressWidth() }}></div>
                
                <div className="tracker-step completed">
                  <div className="tracker-node">1</div>
                  <div className="tracker-label">Order Placed</div>
                </div>

                <div className={`tracker-step ${order.returnStatus !== 'None' ? 'completed' : ''}`}>
                  <div className="tracker-node">2</div>
                  <div className="tracker-label">Return Requested</div>
                </div>

                <div className={`tracker-step ${
                  order.returnStatus === 'Approved' || order.returnStatus === 'Rejected' ? 'completed' : 
                  order.returnStatus === 'Pending' ? 'active' : ''
                }`}>
                  <div className="tracker-node" style={order.returnStatus === 'Rejected' ? { backgroundColor: 'hsl(var(--danger))', borderColor: 'hsl(var(--danger))' } : {}}>
                    {order.returnStatus === 'Rejected' ? '✗' : '3'}
                  </div>
                  <div className="tracker-label">
                    {order.returnStatus === 'Rejected' ? 'Rejected' : 'Inspected'}
                  </div>
                </div>

                <div className={`tracker-step ${
                  order.refundStatus === 'Completed' ? 'completed' : 
                  order.refundStatus === 'Pending' ? 'active' : ''
                }`}>
                  <div className="tracker-node">4</div>
                  <div className="tracker-label">Refund Done</div>
                </div>
              </div>
            </div>
          )}

          {/* Conditional Workflows & Deflection Actions */}
          {order.eligibleForReturn && order.returnStatus === 'None' && (
            <div style={{ marginTop: '2rem', borderTop: '1px solid hsla(var(--border), 0.3)', paddingTop: '1.5rem', textAlign: 'center' }}>
              <p style={{ color: 'hsl(var(--text-secondary))', marginBottom: '1rem', fontSize: '0.95rem' }}>
                Your order is eligible for return. You can initiate the process automatically below.
              </p>
              <button 
                type="button" 
                className="btn btn-primary" 
                onClick={handleInitiateReturn}
                disabled={submittingReturn}
              >
                {submittingReturn ? <div className="loading-spinner"></div> : '🚀 Initiate Return & Refund Request'}
              </button>
            </div>
          )}

          {!order.eligibleForReturn && (
            <div className="alert alert-warning" style={{ marginTop: '1.5rem', marginBottom: 0 }}>
              <span style={{ fontSize: '1.2rem' }}>⚠️</span>
              <div>
                <strong>Return Window Closed:</strong> This order was purchased past the 30-day return eligibility period or contains final-sale items. As a result, it cannot be automatically returned.
              </div>
            </div>
          )}

          {order.returnStatus === 'Rejected' && (
            <div className="alert alert-danger" style={{ marginTop: '1.5rem', marginBottom: 0 }}>
              <span style={{ fontSize: '1.2rem' }}>❌</span>
              <div>
                <strong>Return Request Rejected:</strong> Our inspection team rejected the return items for Order {order.orderId} as they did not meet our standard quality conditions (e.g. worn/missing tags). If you believe this is an error, please contact a live representative.
              </div>
            </div>
          )}

          {order.refundStatus === 'Completed' && (
            <div className="alert alert-warning" style={{ marginTop: '1.5rem', marginBottom: 0, backgroundColor: 'hsla(142, 70%, 45%, 0.12)', color: '#a3f3b9', borderColor: 'hsla(142, 70%, 45%, 0.25)' }}>
              <span style={{ fontSize: '1.2rem' }}>💰</span>
              <div>
                <strong>Refund Completed:</strong> The refund for this order has been fully processed and credited back to your original payment method. Funds usually appear in your account in 3-5 business days.
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ReturnsRefunds;
