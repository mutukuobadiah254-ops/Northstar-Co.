import React, { useState, useEffect } from 'react';

const StockAvailability = () => {
  // Available seeded products list fetched on mount
  const [seededProducts, setSeededProducts] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState('');
  
  // Custom typing input mode state
  const [useCustomInput, setUseCustomInput] = useState(false);
  const [customProductIdInput, setCustomProductIdInput] = useState('');
  
  // Custom variant text input (to test unavailable variants)
  const [selectedVariant, setSelectedVariant] = useState('');
  const [customVariantText, setCustomVariantText] = useState('');
  const [useCustomVariant, setUseCustomVariant] = useState(false);

  // Core fetch states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Fetched product details
  const [fetchedProduct, setFetchedProduct] = useState(null);
  
  // Search result display state
  const [result, setResult] = useState(null);

  // Fetch product list on mount
  useEffect(() => {
    const fetchSeededProducts = async () => {
      try {
        const response = await fetch('/api/inventory');
        const data = await response.json();
        if (response.ok && data.success) {
          setSeededProducts(data.products);
          if (data.products.length > 0) {
            setSelectedProductId(data.products[0].productId);
          }
        }
      } catch (err) {
        console.error('Error fetching seeded product list:', err);
      }
    };
    fetchSeededProducts();
  }, []);

  // Sync selected variant when product changes
  useEffect(() => {
    if (!useCustomInput && selectedProductId) {
      const prod = seededProducts.find(p => p.productId === selectedProductId);
      if (prod && prod.variants && prod.variants.length > 0) {
        setSelectedVariant(prod.variants[0].name);
        setFetchedProduct(prod);
      }
    } else {
      setFetchedProduct(null);
      setSelectedVariant('');
    }
    setResult(null);
  }, [selectedProductId, seededProducts, useCustomInput]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setResult(null);
    setError('');

    // Determine target product ID
    let targetProductId = useCustomInput ? customProductIdInput.trim() : selectedProductId;

    if (!targetProductId) {
      setError('Product ID is required.');
      return;
    }

    // Regex validation: Start with "P" and followed by exactly 4 digits
    const productIdRegex = /^P\d{4}$/i;
    if (!productIdRegex.test(targetProductId)) {
      setError("Invalid Product ID format. It must start with 'P' followed by 4 digits (e.g., P1001).");
      return;
    }

    // Determine target variant name
    let targetVariantName = useCustomVariant ? customVariantText.trim() : selectedVariant;
    if (!targetVariantName) {
      setError('Please select or enter a variant (e.g., Size 42).');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`/api/inventory/${targetProductId.toUpperCase()}`);
      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'An error occurred while fetching inventory details.');
      } else {
        const product = data.product;
        // Search for matching variant (case-insensitive search)
        const matchedVariant = product.variants.find(
          v => v.name.toLowerCase() === targetVariantName.toLowerCase()
        );

        if (!matchedVariant) {
          // Case 4: Variant not available/unknown
          setResult({
            productName: product.name,
            productId: product.productId,
            variant: targetVariantName,
            status: 'Unavailable Variant',
            quantity: 0,
            message: `Variant '${targetVariantName}' is not a valid option for this product.`
          });
        } else if (matchedVariant.stock > 0) {
          // Case 1: Variant available
          setResult({
            productName: product.name,
            productId: product.productId,
            variant: matchedVariant.name,
            status: 'Available',
            quantity: matchedVariant.stock,
            message: `Available — ${matchedVariant.stock} units in stock.`
          });
        } else {
          // Case 2: Variant out of stock
          setResult({
            productName: product.name,
            productId: product.productId,
            variant: matchedVariant.name,
            status: 'Out of Stock',
            quantity: 0,
            message: 'Out of Stock — 0 units available.'
          });
        }
      }
    } catch (err) {
      console.error(err);
      setError('Failed to fetch inventory information. Please check if server is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <span>📦</span> Stock Availability Support
      </h2>

      <form onSubmit={handleSubmit} style={{ marginBottom: '2rem' }}>
        
        {/* Toggle between Dropdown list and Manual Product ID Input */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '0.75rem' }}>
          <button
            type="button"
            onClick={() => {
              setUseCustomInput(!useCustomInput);
              setError('');
              setResult(null);
            }}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'hsl(var(--accent))',
              cursor: 'pointer',
              fontSize: '0.85rem',
              fontWeight: '600',
              textDecoration: 'underline'
            }}
          >
            {useCustomInput ? 'Select from catalog instead' : 'Type custom Product ID manually'}
          </button>
        </div>

        {/* Product selector/input */}
        <div className="form-group">
          <label className="form-label" htmlFor="product-id-select">
            {useCustomInput ? 'Product ID (starts with P, e.g. P1001)' : 'Select Product'}
          </label>
          {useCustomInput ? (
            <input
              id="product-id-select"
              type="text"
              className="input-control"
              placeholder="e.g. P1001"
              value={customProductIdInput}
              onChange={(e) => setCustomProductIdInput(e.target.value)}
              style={{ textTransform: 'uppercase' }}
              disabled={loading}
            />
          ) : (
            <select
              id="product-id-select"
              className="input-control"
              value={selectedProductId}
              onChange={(e) => setSelectedProductId(e.target.value)}
              disabled={loading}
            >
              {seededProducts.map(p => (
                <option key={p.productId} value={p.productId}>
                  {p.name} ({p.productId})
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Variant selector/input */}
        <div className="form-group" style={{ position: 'relative' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
            <label className="form-label" htmlFor="variant-select" style={{ margin: 0 }}>
              Variant Selection
            </label>
            {fetchedProduct && (
              <button
                type="button"
                onClick={() => {
                  setUseCustomVariant(!useCustomVariant);
                  setError('');
                  setResult(null);
                }}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'hsl(var(--accent))',
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                  fontWeight: '600',
                  textDecoration: 'underline'
                }}
              >
                {useCustomVariant ? 'Choose from list' : 'Type custom variant'}
              </button>
            )}
          </div>

          {useCustomVariant || !fetchedProduct ? (
            <input
              id="variant-select"
              type="text"
              className="input-control"
              placeholder="e.g. Size 42, Color Blue / Size M"
              value={customVariantText}
              onChange={(e) => setCustomVariantText(e.target.value)}
              disabled={loading}
            />
          ) : (
            <select
              id="variant-select"
              className="input-control"
              value={selectedVariant}
              onChange={(e) => setSelectedVariant(e.target.value)}
              disabled={loading}
            >
              {fetchedProduct.variants.map((v, idx) => (
                <option key={idx} value={v.name}>
                  {v.name}
                </option>
              ))}
            </select>
          )}
        </div>

        <button type="submit" className="btn btn-primary" disabled={loading} style={{ marginTop: '0.5rem' }}>
          {loading ? <div className="loading-spinner"></div> : '🔍 Check Stock & Availability'}
        </button>
      </form>

      {error && (
        <div className="alert alert-danger">
          <span style={{ fontSize: '1.2rem' }}>⚠️</span>
          <div>
            <strong>Error:</strong> {error}
          </div>
        </div>
      )}

      {result && (
        <div className="result-box">
          <div className="result-header">
            <h3 className="result-title">{result.productName || 'Product Enquiry'}</h3>
            <span className={`badge ${
              result.status === 'Available' ? 'badge-success' : 
              result.status === 'Out of Stock' ? 'badge-danger' : 
              'badge-warning'
            }`}>
              {result.status}
            </span>
          </div>

          <div className="result-row">
            <span>Product ID</span>
            <span>{result.productId}</span>
          </div>
          <div className="result-row">
            <span>Requested Variant</span>
            <span>{result.variant}</span>
          </div>
          <div className="result-row">
            <span>Stock Count</span>
            <span>{result.quantity} units</span>
          </div>

          {/* User deflecting response box */}
          <div style={{ marginTop: '1.5rem', borderTop: '1px solid hsla(var(--border), 0.3)', paddingTop: '1rem' }}>
            {result.status === 'Available' && (
              <div className="alert alert-warning" style={{ backgroundColor: 'hsla(142, 70%, 45%, 0.12)', color: '#a3f3b9', borderColor: 'hsla(142, 70%, 45%, 0.25)', marginBottom: 0 }}>
                <span style={{ fontSize: '1.2rem' }}>✅</span>
                <div>
                  <strong>In Stock:</strong> {result.message} You can add this variant to your cart and place an order.
                </div>
              </div>
            )}

            {result.status === 'Out of Stock' && (
              <div className="alert alert-danger" style={{ marginBottom: 0 }}>
                <span style={{ fontSize: '1.2rem' }}>❌</span>
                <div>
                  <strong>Temporarily Out of Stock:</strong> We are currently sold out of this variant. Select a different variant, or click to register for notifications when it is replenished.
                </div>
              </div>
            )}

            {result.status === 'Unavailable Variant' && (
              <div className="alert alert-warning" style={{ marginBottom: 0 }}>
                <span style={{ fontSize: '1.2rem' }}>⚠️</span>
                <div>
                  <strong>Unavailable Option:</strong> {result.message} Please check the variants we offer in our catalog.
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default StockAvailability;
