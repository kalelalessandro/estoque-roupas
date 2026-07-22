import { Request, Response, NextFunction } from 'express';
import { emitStockChanged } from '../../lib/socket';
import { createStockEntrySchema } from './stock.dto';
import { stockService } from './stock.service';

export const stockController = {
  async list(_req: Request, res: Response, next: NextFunction) {
    try {
      const entries = await stockService.list();
      return res.json(entries);
    } catch (err) {
      return next(err);
    }
  },

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const data = createStockEntrySchema.parse(req.body);
      const entry = await stockService.create(data);
      emitStockChanged();
      return res.status(201).json(entry);
    } catch (err) {
      return next(err);
    }
  },
};
