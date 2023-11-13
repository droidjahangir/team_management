import path from 'path';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';

import api from './routes/api.js';

const app = express();

// app.use(
//   cors({
//     origin: 'http://localhost:3000',
//   })
// );

const limiter = rateLimit({
  windowMs: process.env.REQUEST_TIME || 15 * 60 * 1000, // 15 minutes
  max: process.env.REQUEST_LIMIT || 1000, // limit each IP to 1000 requests per windowMs
  message: 'Too many request from this IP, please try again after an hour',
});

const __dirname = path.dirname(new URL(import.meta.url).pathname);

// Allow Cross-Origin requests
app.use(cors());

// Set security HTTP headers
app.use(helmet());

// Limit request from the same API
app.use(limiter);

app.use(express.json());
app.use(morgan('combined'));
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));
app.use('/v1', api);

export default app;
