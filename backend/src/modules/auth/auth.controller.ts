import { Request, Response, NextFunction } from 'express';
import { authService } from './auth.service';
import { loginSchema, registerSchema } from './auth.dto';

export const authController = {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const data = registerSchema.parse(req.body);
      const result = await authService.register(data);
      return res.status(201).json(result);
    } catch (err) {
      return next(err);
    }
  },

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const data = loginSchema.parse(req.body);
      const result = await authService.login(data);
      return res.status(200).json(result);
    } catch (err) {
      return next(err);
    }
  },
};
