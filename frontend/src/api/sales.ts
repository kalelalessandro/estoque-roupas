import { Sale } from '../types';
import { api } from './client';

export const salesApi = {
  list: () => api.get<Sale[]>('/sales').then((r) => r.data),

  create: (productId: string, quantity: number) =>
    api.post<Sale>('/sales', { productId, quantity }).then((r) => r.data),
};
