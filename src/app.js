import path from 'path';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';

import api from './routes/api.js';

const app = express();

// app.use(
//   cors({
//     origin: 'http://localhost:3000',
//   })
// );

const __dirname = path.dirname(new URL(import.meta.url).pathname);

app.use(morgan('combined'));
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));
app.use('/v1', api);

export default app;
