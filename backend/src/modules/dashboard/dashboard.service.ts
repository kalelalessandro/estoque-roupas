import { prisma } from '../../lib/prisma';

const LOW_STOCK_THRESHOLD = 5;

export const dashboardService = {
  async getSummary() {
    const [totalProducts, lowStock, totalSales] = await Promise.all([
      prisma.product.count(),
      prisma.product.findMany({
        where: { quantity: { lte: LOW_STOCK_THRESHOLD } },
        orderBy: { quantity: 'asc' },
        select: { id: true, name: true, sku: true, quantity: true },
      }),
      prisma.sale.count(),
    ]);

    return {
      totalProducts,
      totalSales,
      lowStockThreshold: LOW_STOCK_THRESHOLD,
      lowStockProducts: lowStock,
    };
  },
};
