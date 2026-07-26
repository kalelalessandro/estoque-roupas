import { prisma } from '../../lib/prisma';
import { CreateProductDTO, UpdateProductDTO } from './product.dto';

export const productRepository = {
  findAll(search?: string, includeInactive = false) {
    const activeFilter = includeInactive ? {} : { active: true };

    if (!search) {
      return prisma.product.findMany({ where: activeFilter, orderBy: { createdAt: 'desc' } });
    }

    return prisma.product.findMany({
      where: {
        ...activeFilter,
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

  setActive(id: string, active: boolean) {
    return prisma.product.update({ where: { id }, data: { active } });
  },

  delete(id: string) {
    return prisma.product.delete({ where: { id } });
  },

  count() {
    return prisma.product.count({ where: { active: true } });
  },

  findLowStock(threshold: number) {
    return prisma.product.findMany({
      where: { quantity: { lte: threshold }, active: true },
      orderBy: { quantity: 'asc' },
    });
  },
};
