import { Request, Response, NextFunction } from 'express';
import { dashboardService } from './dashboard.service';

export const dashboardController = {
  async summary(_req: Request, res: Response, next: NextFunction) {
    try {
      const data = await dashboardService.getSummary();
      return res.json(data);
    } catch (err) {
      return next(err);
    }
  },
};
