import Order from '../models/Order.js';
import Product from '../models/Product.js';

export const seedDatabase = async () => {
  try {
    // 1. Seed Orders
    const orderCount = await Order.countDocuments();
    if (orderCount === 0) {
      console.log('Seeding mock orders data...');
      const mockOrders = [
        {
          orderId: 'NS1001',
          customerName: 'John Doe',
          customerEmail: 'john@example.com',
          orderStatus: 'Delivered',
          eligibleForReturn: true,
          returnStatus: 'Approved',
          refundStatus: 'Pending',
          items: [{ name: 'Northstar Apex Running Shoes', quantity: 1, price: 120.00 }]
        },
        {
          orderId: 'NS1002',
          customerName: 'Jane Smith',
          customerEmail: 'jane@example.com',
          orderStatus: 'Delivered',
          eligibleForReturn: true,
          returnStatus: 'None',
          refundStatus: 'None',
          items: [{ name: 'Northstar Classic Hoodie', quantity: 2, price: 45.00 }]
        },
        {
          orderId: 'NS1003',
          customerName: 'Bob Johnson',
          customerEmail: 'bob@example.com',
          orderStatus: 'Delivered',
          eligibleForReturn: false,
          returnStatus: 'None',
          refundStatus: 'None',
          items: [{ name: 'Northstar Performance Socks', quantity: 5, price: 10.00 }]
        },
        {
          orderId: 'NS1004',
          customerName: 'Alice Williams',
          customerEmail: 'alice@example.com',
          orderStatus: 'Delivered',
          eligibleForReturn: true,
          returnStatus: 'Rejected',
          refundStatus: 'None',
          items: [{ name: 'Northstar Classic Hoodie', quantity: 1, price: 45.00 }]
        },
        {
          orderId: 'NS1005',
          customerName: 'Charlie Brown',
          customerEmail: 'charlie@example.com',
          orderStatus: 'Delivered',
          eligibleForReturn: true,
          returnStatus: 'Approved',
          refundStatus: 'Completed',
          items: [{ name: 'Northstar Apex Running Shoes', quantity: 1, price: 120.00 }]
        },
        {
          orderId: 'NS1006',
          customerName: 'Emma Stone',
          customerEmail: 'emma@example.com',
          orderStatus: 'Processing',
          eligibleForReturn: false,
          returnStatus: 'None',
          refundStatus: 'None',
          items: [{ name: 'Northstar Classic Hoodie', quantity: 1, price: 45.00 }]
        },
        {
          orderId: 'NS1007',
          customerName: 'Ryan Gosling',
          customerEmail: 'ryan@example.com',
          orderStatus: 'Shipped',
          eligibleForReturn: false,
          returnStatus: 'None',
          refundStatus: 'None',
          items: [{ name: 'Northstar Apex Running Shoes', quantity: 1, price: 120.00 }]
        },
        {
          orderId: 'NS1008',
          customerName: 'Tom Hardy',
          customerEmail: 'tom@example.com',
          orderStatus: 'Cancelled',
          eligibleForReturn: false,
          returnStatus: 'None',
          refundStatus: 'None',
          items: [{ name: 'Northstar Performance Socks', quantity: 3, price: 10.00 }]
        }
      ];

      await Order.insertMany(mockOrders);
      console.log(`Successfully seeded ${mockOrders.length} mock orders.`);
    } else {
      console.log('Orders database already has records. Seeding skipped.');
    }

    // 2. Seed Products
    const productCount = await Product.countDocuments();
    if (productCount === 0) {
      console.log('Seeding mock products/inventory data...');
      const mockProducts = [
        {
          productId: 'P1001',
          name: 'Northstar Apex Running Shoes',
          description: 'Lightweight, breathable, high-performance running shoes.',
          variants: [
            { name: 'Size 42', stock: 6 },
            { name: 'Size 43', stock: 15 },
            { name: 'Size 44', stock: 0 }
          ]
        },
        {
          productId: 'P1002',
          name: 'Northstar Classic Hoodie',
          description: 'Ultra-soft cotton blend hoodie perfect for daily wear.',
          variants: [
            { name: 'Color Black / Size L', stock: 20 },
            { name: 'Color Blue / Size M', stock: 0 }
          ]
        },
        {
          productId: 'P1003',
          name: 'Northstar Active Gym Bag',
          description: 'Water-resistant gym bag with shoe compartment.',
          variants: [
            { name: 'Standard / Size OS', stock: 8 }
          ]
        }
      ];

      await Product.insertMany(mockProducts);
      console.log('Successfully seeded 3 mock products with variants.');
    } else {
      console.log('Products database already has records. Seeding skipped.');
    }
  } catch (error) {
    console.error(`Error seeding database: ${error.message}`);
  }
};
