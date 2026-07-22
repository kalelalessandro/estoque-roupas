import { prisma } from '../../lib/prisma';
import { CreateProductDTO, UpdateProductDTO } from './product.dto';

export const productRepository = {
  findAll(search?: string) {
    if (!search) {
      return prisma.product.findMany({ orderBy: { createdAt: 'desc' } });
    }

    return prisma.product.findMany({
      where: {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { sku: { contains: search, mode: 'insensitive' } },
        ],
      },
      orderBy: { createdAt: 'desc' },
    });
  },

  findById(id: string) {
    return prisma.product.findUnique({ where: { id } });
  },

  create(data: CreateProductDTO & { sku: string }) {
    return prisma.product.create({ data });
  },

  update(id: string, data: UpdateProductDTO) {
    return prisma.product.update({ where: { id }, data });
  },

  updateQuantity(id: string, quantity: number) {
    return prisma.product.update({ where: { id }, data: { quantity } });
  },

  delete(id: string) {
    return prisma.product.delete({ where: { id } });
  },

  count() {
    return prisma.product.count();
  },

  findLowStock(threshold: number) {
    return prisma.product.findMany({
      where: { quantity: { lte: threshold } },
      orderBy: { quantity: 'asc' },
    });
  },
};
