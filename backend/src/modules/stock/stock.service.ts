import { HttpError } from '../../utils/httpError';
import { productRepository } from '../product/product.repository';
import { CreateStockEntryDTO } from './stock.dto';
import { stockRepository } from './stock.repository';

export const stockService = {
  list() {
    return stockRepository.findAll();
  },

  async create(data: CreateStockEntryDTO) {
    const product = await productRepository.findById(data.productId);

    if (!product) {
      throw new HttpError(404, 'Produto não encontrado');
    }

    const { entry } = await stockRepository.createWithStockUpdate(
      data.productId,
      data.quantity,
    );

    return entry;
  },
};
