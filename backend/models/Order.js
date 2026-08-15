import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true }
});

const orderSchema = new mongoose.Schema({
  orderId: { 
    type: String, 
    required: true, 
    unique: true,
    trim: true,
    index: true
  },
  customerName: { type: String, required: true },
  customerEmail: { type: String, required: true },
  orderStatus: { 
    type: String, 
    enum: ['Processing', 'Shipped', 'Delivered', 'Cancelled'], 
    default: 'Processing' 
  },
  eligibleForReturn: { type: Boolean, default: true },
  returnStatus: { 
    type: String, 
    enum: ['None', 'Approved', 'Pending', 'Rejected'], 
    default: 'None' 
  },
  refundStatus: { 
    type: String, 
    enum: ['None', 'Pending', 'Completed'], 
    default: 'None' 
  },
  items: [orderItemSchema],
  orderDate: { type: Date, default: Date.now }
}, {
  timestamps: true
});

const Order = mongoose.model('Order', orderSchema);

export default Order;
