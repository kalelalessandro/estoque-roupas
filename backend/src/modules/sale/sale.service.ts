import { HttpError } from '../../utils/httpError';
import { productRepository } from '../product/product.repository';
import { CreateSaleDTO } from './sale.dto';
import { saleRepository } from './sale.repository';

export const saleService = {
  list() {
    return saleRepository.findAll();
  },

  async create(data: CreateSaleDTO) {
    const product = await productRepository.findById(data.productId);

    if (!product) {
      throw new HttpError(404, 'Produto não encontrado');
    }

    if (product.quantity < data.quantity) {
      throw new HttpError(
        400,
        `Estoque insuficiente. Disponível: ${product.quantity}, solicitado: ${data.quantity}`,
      );
    }

    const totalPrice = product.price * data.quantity;
    const { sale } = await saleRepository.createWithStockUpdate(
      data.productId,
      data.quantity,
      totalPrice,
    );

    return sale;
  },
};
