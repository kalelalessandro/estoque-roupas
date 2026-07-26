import { Request, Response, NextFunction } from 'express';
import { emitStockChanged } from '../../lib/socket';
import { createSaleSchema } from './sale.dto';
import { saleService } from './sale.service';

export const saleController = {
  async list(_req: Request, res: Response, next: NextFunction) {
    try {
      const sales = await saleService.list();
      return res.json(sales);
    } catch (err) {
      return next(err);
    }
  },

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const data = createSaleSchema.parse(req.body);
      const sale = await saleService.create(data);
      emitStockChanged();
      return res.status(201).json(sale);
    } catch (err) {
      return next(err);
    }
  },
};
