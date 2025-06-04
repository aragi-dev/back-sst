import { inject, injectable } from "tsyringe";
import type { IProductRepository } from "@core/IRepositories/IProductRepository";
import type { Product } from "@core/entities/Product";
import type { createProductDto } from "@interfaces/ProductDto";
import { messages } from "@utils/messages";
import type { UseCase } from "@utils/adapters/UseCase";

@injectable()
export class ProductService {
  constructor(
    @inject("ProductRepository")
    private readonly productRepository: IProductRepository
  ) { }

  async getAll(): Promise<Product[]> {
    const products = await this.productRepository.findAll();
    return products;
  }

  async create(product: createProductDto): Promise<UseCase<Product>> {
    const existingProduct = await this.productRepository.findByParams({
      code: product.code,
      name: product.name
    });
    if (existingProduct) {
      return {
        statusCode: messages.statusCode.CONFLICT,
        message: messages.error.ALREADY_EXISTS,
        data: existingProduct
      };
    }
    const newProduct = await this.productRepository.create(product);
    return {
      statusCode: messages.statusCode.SUCCESS,
      message: messages.success.CREATED,
      data: newProduct
    };;
  }
}
