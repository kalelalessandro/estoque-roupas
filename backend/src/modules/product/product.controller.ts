import { Request, Response, NextFunction } from 'express';
import { emitStockChanged } from '../../lib/socket';
import { productService } from './product.service';
import { createProductSchema, updateProductSchema } from './product.dto';

export const productController = {
  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const search = typeof req.query.search === 'string' ? req.query.search : undefined;
      const includeInactive = req.query.includeInactive === 'true';
      const products = await productService.list(search, includeInactive);
      return res.json(products);
    } catch (err) {
      return next(err);
    }
  },

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const product = await productService.getById(req.params.id);
      return res.json(product);
    } catch (err) {
      return next(err);
    }
  },

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const data = createProductSchema.parse(req.body);
      const product = await productService.create(data);
      emitStockChanged();
      return res.status(201).json(product);
    } catch (err) {
      return next(err);
    }
  },

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const data = updateProductSchema.parse(req.body);
      const product = await productService.update(req.params.id, data);
      emitStockChanged();
      return res.json(product);
    } catch (err) {
      return next(err);
    }
  },

  async remove(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await productService.remove(req.params.id);
      emitStockChanged();
      return res.status(200).json(result);
    } catch (err) {
      return next(err);
    }
  },

  async reactivate(req: Request, res: Response, next: NextFunction) {
    try {
      const product = await productService.reactivate(req.params.id);
      emitStockChanged();
      return res.json(product);
    } catch (err) {
      return next(err);
    }
  },
};
