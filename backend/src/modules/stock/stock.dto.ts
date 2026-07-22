import { z } from 'zod';

export const createStockEntrySchema = z.object({
  productId: z.string().uuid('Produto inválido'),
  quantity: z.number().int().positive('Quantidade deve ser maior que zero'),
});

export type CreateStockEntryDTO = z.infer<typeof createStockEntrySchema>;
