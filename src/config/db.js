import mongoose from 'mongoose';
import pkg from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const { MongoClient } = pkg;

mongoose.connection.once('open', () => {
  console.log('MongoDB connection ready!');
});

mongoose.connection.on('error', (err) => {
  console.error(err);
});

async function mongoConnect() {
  const username = process.env.DB_USER;
  const password = process.env.DB_PASSWORD;
  const database = process.env.DB_NAME;
  const host = process.env.DB_HOST;
  const port = process.env.DB_PORT;

  console.log({ username, password, database });

  const mongoURL = `mongodb://${username}:${password}@${host}:${port}/${database}?authSource=admin`;

  console.log({ mongoURL });

  try {
    await mongoose.connect(mongoURL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    mongoose.connection.on('connected', () => {
      console.log('Mongoose connected to db...');
    });

    mongoose.connection.on('error', (err) => {
      console.log(err.message);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('Mongoose connection is disconnected...');
    });

    process.on('SIGINT', () => {
      mongoose.connection.close(() => {
        console.log(
          'Mongoose connection is disconnected due to app termination...'
        );
        process.exit(0);
      });
    });
  } catch (err) {
    console.error('Error connecting to the database ============> ', err);
  }
}

// async function mongoDisconnect() {
//   await mongoose.disconnect();
// }

export { mongoConnect };
