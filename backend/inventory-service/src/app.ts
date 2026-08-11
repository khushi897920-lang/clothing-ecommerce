import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import inventoryRoutes from './routes/inventory.routes';
import { errorHandler } from '../../shared/middleware/error.middleware';

const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(cookieParser());
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP', service: 'Inventory Service', timestamp: new Date() });
});

app.use('/', inventoryRoutes);

app.use(errorHandler);

export default app;
