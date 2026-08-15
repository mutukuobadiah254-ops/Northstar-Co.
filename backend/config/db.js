import mongoose from 'mongoose';

let mongoServer = null;

export const connectDB = async () => {
  try {
    let dbUri = process.env.MONGODB_URI;

    if (!dbUri) {
      console.log('No MONGODB_URI detected in .env.');
      console.log('Spawning an in-memory MongoDB Server for zero-dependency local run...');
      
      // Set the startup timeout environment variable before loading the library
      process.env.MONGOMS_STARTUP_TIMEOUT_MS = '60000';
      const { MongoMemoryServer } = await import('mongodb-memory-server');

      mongoServer = await MongoMemoryServer.create({
        binary: {
          version: '7.0.14'
        }
      });
      dbUri = mongoServer.getUri();
      console.log(`In-memory MongoDB started successfully at: ${dbUri}`);
    }

    await mongoose.connect(dbUri);
    console.log(`Connected to MongoDB: ${mongoose.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

export const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    if (mongoServer) {
      await mongoServer.stop();
      console.log('In-memory MongoDB Server stopped.');
    }
  } catch (error) {
    console.error(`MongoDB Disconnection Error: ${error.message}`);
  }
};
