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

export const productsApi = {
  list: (search?: string) =>
    api.get<Product[]>('/products', { params: search ? { search } : {} }).then((r) => r.data),

  create: (data: ProductInput) => api.post<Product>('/products', data).then((r) => r.data),

  update: (id: string, data: Partial<ProductInput>) =>
    api.put<Product>(`/products/${id}`, data).then((r) => r.data),

  remove: (id: string) => api.delete(`/products/${id}`),
};
