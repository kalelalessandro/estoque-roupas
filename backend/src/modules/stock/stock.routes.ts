import { Router } from 'express';
import { authMiddleware } from '../../middleware/auth.middleware';
import { stockController } from './stock.controller';

export const stockRoutes = Router();

stockRoutes.use(authMiddleware);
stockRoutes.get('/', stockController.list);
stockRoutes.post('/', stockController.create);
