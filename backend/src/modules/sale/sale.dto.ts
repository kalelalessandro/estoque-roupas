import { z } from 'zod';

export const createSaleSchema = z.object({
  productId: z.string().uuid('Produto inválido'),
  quantity: z.number().int().positive('Quantidade deve ser maior que zero'),
});

export type CreateSaleDTO = z.infer<typeof createSaleSchema>;
