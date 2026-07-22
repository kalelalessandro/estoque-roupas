import { Router } from 'express';
import { authMiddleware } from '../../middleware/auth.middleware';
import { saleController } from './sale.controller';

export const saleRoutes = Router();

saleRoutes.use(authMiddleware);
saleRoutes.get('/', saleController.list);
saleRoutes.post('/', saleController.create);
