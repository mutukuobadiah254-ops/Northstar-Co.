import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';
import { connectDB, disconnectDB } from './config/db.js';
import { seedDatabase } from './utils/seeder.js';
import orderRoutes from './routes/orderRoutes.js';
import inventoryRoutes from './routes/inventoryRoutes.js';

// Load environment variables relative to this file's location
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS
app.use(cors());

// Parse JSON request body
app.use(express.json());

// API Routes
app.use('/api/orders', orderRoutes);
app.use('/api/inventory', inventoryRoutes);

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date() });
});

// Database Seed / Reset Endpoint for manual demo trigger
app.post('/api/seed', async (req, res) => {
  try {
    console.log('Manual reset and database seed requested...');
    // Clear collections first
    const collections = mongoose.connection.collections;
    for (const key in collections) {
      await collections[key].deleteMany({});
    }
    await seedDatabase();
    res.json({ success: true, message: 'Database reset and seeded successfully.' });
  } catch (error) {
    console.error('Error during manual database seeding:', error);
    res.status(500).json({ success: false, message: 'Seeding failed.' });
  }
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Express Unhandled Error:', err);
  res.status(500).json({ 
    success: false, 
    message: 'An unexpected error occurred on the server.' 
  });
});

// Connect to Database and start server
const startServer = async () => {
  await connectDB();
  
  // Seed the database with sample orders/inventory
  await seedDatabase();

  const server = app.listen(PORT, () => {
    console.log(`==================================================`);
    console.log(`Northstar support deflection backend running!`);
    console.log(`Port: ${PORT}`);
    console.log(`Mode: MERN REST API`);
    console.log(`==================================================`);
  });

  // Graceful Shutdown
  const handleShutdown = async () => {
    console.log('\nShutting down backend server...');
    server.close(async () => {
      console.log('HTTP server closed.');
      await disconnectDB();
      process.exit(0);
    });
  };

  process.on('SIGINT', handleShutdown);
  process.on('SIGTERM', handleShutdown);
};

startServer();
