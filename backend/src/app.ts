import cors from 'cors';
import express from 'express';
import { errorMiddleware } from './middleware/error.middleware';
import { authRoutes } from './modules/auth/auth.routes';
import { dashboardRoutes } from './modules/dashboard/dashboard.routes';
import { productRoutes } from './modules/product/product.routes';
import { saleRoutes } from './modules/sale/sale.routes';
import { stockRoutes } from './modules/stock/stock.routes';

export const app = express();

app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => res.json({ status: 'ok' }));

app.use('/auth', authRoutes);
app.use('/products', productRoutes);
app.use('/sales', saleRoutes);
app.use('/stock-entries', stockRoutes);
app.use('/dashboard', dashboardRoutes);

app.use(errorMiddleware);
