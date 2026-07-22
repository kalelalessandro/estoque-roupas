import { z } from 'zod';

export const createProductSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  category: z.string().min(1, 'Categoria é obrigatória'),
  size: z.string().min(1, 'Tamanho é obrigatório'),
  color: z.string().min(1, 'Cor é obrigatória'),
  price: z.number().positive('Preço deve ser maior que zero'),
  quantity: z.number().int().min(0, 'Quantidade não pode ser negativa').default(0),
});

export const updateProductSchema = z.object({
  name: z.string().min(1).optional(),
  category: z.string().min(1).optional(),
  size: z.string().min(1).optional(),
  color: z.string().min(1).optional(),
  price: z.number().positive().optional(),
});

export type CreateProductDTO = z.infer<typeof createProductSchema>;
export type UpdateProductDTO = z.infer<typeof updateProductSchema>;
