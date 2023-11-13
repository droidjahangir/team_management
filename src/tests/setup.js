import mongoose from 'mongoose';
import request from 'supertest';
import server from '../app.js';

mongoose.promise = global.Promise;

async function removeAllCollections() {
  const collections = Object.keys(mongoose.connection.collections);
  for (const collectionName of collections) {
    const collection = mongoose.connection.collections[collectionName];
    await collection.deleteMany();
  }
}

async function dropAllCollections() {
  const collections = Object.keys(mongoose.connection.collections);
  for (const collectionName of collections) {
    const collection = mongoose.connection.collections[collectionName];
    try {
      await collection.drop();
    } catch (error) {
      if (error.message === 'ns not found') return;
      if (error.message.includes('a background operation is currently running'))
        return;
      console.log(error.message);
    }
  }
}

export const setupDB = async () => {
  // Connect to Mongoose
  const url = process.env.MONGO_TEST_URL;
  await mongoose.connect(url, { useNewUrlParser: true });

  // Cleans up database between each test
  after(async () => {
    await removeAllCollections();
  });

  // Disconnect Mongoose
  after(async () => {
    await dropAllCollections();
    await mongoose.connection.close();
    console.log('database connection close');
  });
};

export const requestInstance = request(server);
