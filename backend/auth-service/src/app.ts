import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import authRoutes from './routes/auth.routes';
import { errorHandler } from '../../shared/middleware/error.middleware';

const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(cookieParser());
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP', service: 'Auth Service', timestamp: new Date() });
});

app.use('/', authRoutes);

app.use(errorHandler);

export default app;
