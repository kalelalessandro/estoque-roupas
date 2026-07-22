import { Router } from 'express';
import { authMiddleware } from '../../middleware/auth.middleware';
import { productController } from './product.controller';

export const productRoutes = Router();

productRoutes.use(authMiddleware);
productRoutes.get('/', productController.list);
productRoutes.get('/:id', productController.getById);
productRoutes.post('/', productController.create);
productRoutes.put('/:id', productController.update);
productRoutes.delete('/:id', productController.remove);
