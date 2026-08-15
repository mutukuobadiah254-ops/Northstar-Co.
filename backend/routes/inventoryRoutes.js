import express from 'express';
import Product from '../models/Product.js';

const router = express.Router();

// GET all products (helpful for search dropdown lists)
router.get('/', async (req, res) => {
  try {
    const products = await Product.find({});
    return res.json({ success: true, products });
  } catch (error) {
    console.error('Error fetching all products:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Internal server error while fetching product list.' 
    });
  }
});

// GET stock for specific product by product ID
router.get('/:productId', async (req, res) => {
  const { productId } = req.params;

  if (!productId || productId.trim() === '') {
    return res.status(400).json({ 
      success: false, 
      message: 'Product ID is required.' 
    });
  }

  // Regex validation: Start with "P" and followed by exactly 4 digits
  const productIdRegex = /^P\d{4}$/i;
  if (!productIdRegex.test(productId)) {
    return res.status(400).json({ 
      success: false, 
      message: "Invalid Product ID format. It must start with 'P' followed by 4 digits (e.g., P1001)." 
    });
  }

  try {
    const product = await Product.findOne({ productId: productId.toUpperCase() });

    if (!product) {
      return res.status(404).json({ 
        success: false, 
        message: `Unknown product: ID ${productId.toUpperCase()} was not found in our database.` 
      });
    }

    return res.json({
      success: true,
      product: {
        productId: product.productId,
        name: product.name,
        description: product.description,
        variants: product.variants
      }
    });
  } catch (error) {
    console.error(`Error in GET /api/inventory/${productId}:`, error);
    return res.status(500).json({ 
      success: false, 
      message: 'Internal server error while checking stock.' 
    });
  }
});

export default router;
