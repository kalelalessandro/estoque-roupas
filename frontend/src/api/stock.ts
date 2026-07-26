import { StockEntry } from '../types';
import { api } from './client';

export const stockApi = {
  list: () => api.get<StockEntry[]>('/stock-entries').then((r) => r.data),

  create: (productId: string, quantity: number) =>
    api.post<StockEntry>('/stock-entries', { productId, quantity }).then((r) => r.data),
};
