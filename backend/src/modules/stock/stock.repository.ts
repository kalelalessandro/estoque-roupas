import { Prisma } from '@prisma/client';
import { prisma } from '../../lib/prisma';

export const stockRepository = {
  findAll() {
    return prisma.stockEntry.findMany({
      include: { product: true },
      orderBy: { createdAt: 'desc' },
    });
  },

  createWithStockUpdate(productId: string, quantity: number) {
    return prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const product = await tx.product.update({
        where: { id: productId },
        data: { quantity: { increment: quantity } },
      });

      const entry = await tx.stockEntry.create({
        data: { productId, quantity },
        include: { product: true },
      });

      return { entry, product };
    });
  },
};
