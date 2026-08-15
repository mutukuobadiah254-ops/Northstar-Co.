import mongoose from 'mongoose';

const variantSchema = new mongoose.Schema({
  name: { type: String, required: true }, // e.g. "Size 42", "Color Black / Size L"
  stock: { type: Number, required: true, default: 0 }
});

const productSchema = new mongoose.Schema({
  productId: { 
    type: String, 
    required: true, 
    unique: true, 
    trim: true,
    index: true
  },
  name: { type: String, required: true },
  description: { type: String },
  variants: [variantSchema]
}, {
  timestamps: true
});

const Product = mongoose.model('Product', productSchema);

export default Product;
