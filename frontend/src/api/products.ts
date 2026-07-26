import { Product } from '../types';
import { api } from './client';

export interface ProductInput {
  name: string;
  category: string;
  size: string;
  color: string;
  price: number;
  quantity: number;
}

export interface RemoveProductResult {
  deleted: boolean;
  deactivated: boolean;
}

export const productsApi = {
  list: (search?: string, includeInactive?: boolean) =>
    api
      .get<Product[]>('/products', {
        params: {
          ...(search ? { search } : {}),
          ...(includeInactive ? { includeInactive: 'true' } : {}),
        },
      })
      .then((r) => r.data),

  create: (data: ProductInput) => api.post<Product>('/products', data).then((r) => r.data),

  update: (id: string, data: Partial<ProductInput>) =>
    api.put<Product>(`/products/${id}`, data).then((r) => r.data),

  remove: (id: string) => api.delete<RemoveProductResult>(`/products/${id}`).then((r) => r.data),

  reactivate: (id: string) => api.post<Product>(`/products/${id}/reactivate`).then((r) => r.data),
};
