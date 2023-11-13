import http from 'http';
import dotenv from 'dotenv';

import app from './app.js';
import { mongoConnect } from './config/db.js';

dotenv.config();

const start = async () => {
  try {
    const PORT = process.env.NODE_PORT || 4001;

    const server = http.createServer(app);

    await mongoConnect();

    server.listen(PORT, () => {
      console.log(`Listening on port ${PORT}...`);
    });
  } catch (err) {
    console.error({ err });
  }
};
start();
