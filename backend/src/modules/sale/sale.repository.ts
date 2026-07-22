import { Prisma } from '@prisma/client';
import { prisma } from '../../lib/prisma';

export const saleRepository = {
  findAll() {
    return prisma.sale.findMany({
      include: { product: true },
      orderBy: { createdAt: 'desc' },
    });
  },

  // Transação: garante que o desconto de estoque e o registro da venda
  // aconteçam de forma atômica (ou os dois, ou nenhum).
  createWithStockUpdate(productId: string, quantity: number, totalPrice: number) {
    return prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const product = await tx.product.update({
        where: { id: productId },
        data: { quantity: { decrement: quantity } },
      });

      const sale = await tx.sale.create({
        data: { productId, quantity, totalPrice },
        include: { product: true },
      });

      return { sale, product };
    });
  },
};
