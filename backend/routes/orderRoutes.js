import express from 'express';
import Order from '../models/Order.js';

const router = express.Router();

// GET Order Return & Refund status
router.get('/:orderId', async (req, res) => {
  const { orderId } = req.params;

  if (!orderId || orderId.trim() === '') {
    return res.status(400).json({ 
      success: false, 
      message: 'Order ID is required.' 
    });
  }

  // Regex validation: Start with "NS" and followed by exactly 4 digits
  const orderIdRegex = /^NS\d{4}$/i;
  if (!orderIdRegex.test(orderId)) {
    return res.status(400).json({ 
      success: false, 
      message: "Invalid Order ID format. It must start with 'NS' followed by 4 digits (e.g., NS1001)." 
    });
  }

  try {
    const order = await Order.findOne({ orderId: orderId.toUpperCase() });

    if (!order) {
      return res.status(404).json({ 
        success: false, 
        message: `Unknown order: ${orderId.toUpperCase()} was not found in our database.` 
      });
    }

    return res.json({
      success: true,
      order: {
        orderId: order.orderId,
        customerName: order.customerName,
        customerEmail: order.customerEmail,
        orderStatus: order.orderStatus,
        eligibleForReturn: order.eligibleForReturn,
        returnStatus: order.returnStatus,
        refundStatus: order.refundStatus,
        items: order.items,
        orderDate: order.orderDate
      }
    });
  } catch (error) {
    console.error(`Error in GET /api/orders/${orderId}:`, error);
    return res.status(500).json({ 
      success: false, 
      message: 'Internal server error while fetching order status.' 
    });
  }
});

// POST Submit a return request for eligible order
router.post('/:orderId/return', async (req, res) => {
  const { orderId } = req.params;

  try {
    const order = await Order.findOne({ orderId: orderId.toUpperCase() });

    if (!order) {
      return res.status(404).json({ 
        success: false, 
        message: `Order ${orderId.toUpperCase()} not found.` 
      });
    }

    if (!order.eligibleForReturn) {
      return res.status(400).json({ 
        success: false, 
        message: 'This order is not eligible for return (final sale or return period expired).' 
      });
    }

    if (order.returnStatus !== 'None' && order.returnStatus !== 'Rejected') {
      return res.status(400).json({ 
        success: false, 
        message: `A return has already been processed for this order. Status: ${order.returnStatus}` 
      });
    }

    // Update return status to Pending
    order.returnStatus = 'Pending';
    order.refundStatus = 'Pending';
    await order.save();

    return res.json({
      success: true,
      message: 'Return request submitted successfully.',
      order: {
        orderId: order.orderId,
        returnStatus: order.returnStatus,
        refundStatus: order.refundStatus
      }
    });
  } catch (error) {
    console.error(`Error in POST /api/orders/${orderId}/return:`, error);
    return res.status(500).json({ 
      success: false, 
      message: 'Internal server error while processing return request.' 
    });
  }
});

export default router;
