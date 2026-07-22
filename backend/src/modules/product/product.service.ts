import { HttpError } from '../../utils/httpError';
import { generateSku } from '../../utils/sku';
import { productRepository } from './product.repository';
import { CreateProductDTO, UpdateProductDTO } from './product.dto';

export const productService = {
  list(search?: string) {
    return productRepository.findAll(search);
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

  async remove(id: string) {
    await productService.getById(id);
    return productRepository.delete(id);
  },
};
