import { HttpError } from '../../utils/httpError';
import { generateSku } from '../../utils/sku';
import { productRepository } from './product.repository';
import { CreateProductDTO, UpdateProductDTO } from './product.dto';

export const productService = {
  list(search?: string, includeInactive = false) {
    return productRepository.findAll(search, includeInactive);
  },

  async getById(id: string) {
    const product = await productRepository.findById(id);
    if (!product) {
      throw new HttpError(404, 'Produto não encontrado');
    }
    return product;
  },

  create(data: CreateProductDTO) {
    const sku = generateSku(data.category, data.size, data.color);
    return productRepository.create({ ...data, sku });
  },

  async update(id: string, data: UpdateProductDTO) {
    await productService.getById(id);
    return productRepository.update(id, data);
  },

  /**
   * Remove a product. If it has no sales/stock history, it's deleted for
   * good. If it has history, it's deactivated instead — this keeps past
   * sales and stock records intact while taking the product out of daily
   * use (catalog, dashboard counts, low-stock alerts, sale/stock forms).
   */
  async remove(id: string) {
    await productService.getById(id);
    try {
      await productRepository.delete(id);
      return { deleted: true, deactivated: false };
    } catch (err: any) {
      if (err?.code === 'P2003') {
        await productRepository.setActive(id, false);
        return { deleted: false, deactivated: true };
      }
      throw err;
    }
  },

  async reactivate(id: string) {
    await productService.getById(id);
    return productRepository.setActive(id, true);
  },
};
