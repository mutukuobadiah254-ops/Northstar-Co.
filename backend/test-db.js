process.env.MONGOMS_STARTUP_TIMEOUT_MS = '60000';
process.env.MONGOMS_DEBUG = '1';

import { MongoMemoryServer } from 'mongodb-memory-server';

console.log('Starting MongoMemoryServer test run with MONGOMS_STARTUP_TIMEOUT_MS = 60000...');
try {
  const mongoServer = await MongoMemoryServer.create({
    binary: {
      version: '4.4.24'
    }
  });
  console.log('SUCCESS: MongoMemoryServer is running.');
  console.log('URI:', mongoServer.getUri());
  await mongoServer.stop();
  console.log('Stopped successfully.');
} catch (error) {
  console.error('FAILED to start MongoMemoryServer:', error);
}
