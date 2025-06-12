import { inject, injectable } from "tsyringe";
import type { IProductRepository } from "@core/IRepositories/IProductRepository";
import type { Product } from "@core/entities/Product";
import type { createProductDto } from "@interfaces/ProductDto";
import { messages } from "@utils/messages";
import type { UseCase } from "@utils/adapters/UseCase";
import { AppDataSource } from "@utils/typeorm";
import { LogUseCase } from "@utils/loggers/useCaseDecorator";

@injectable()
export class ProductService {
  constructor(
    @inject("ProductRepository")
    private readonly productRepository: IProductRepository
  ) {}

  @LogUseCase
  async getAll(): Promise<UseCase<Product[]>> {
    const products = await this.productRepository.findAll();
    return {
      statusCode: messages.statusCode.SUCCESS,
      message: messages.success.SUCCESS,
      data: products,
    };
  }

  @LogUseCase
  async create(product: createProductDto): Promise<UseCase<Product>> {
    const dataBase = await AppDataSource.createQueryRunner();
    try {
      await dataBase.connect();
      await dataBase.startTransaction();
      const existingProduct = await this.productRepository.findByParams(
        {
          code: product.code,
          name: product.name,
        },
        dataBase.manager
      );
      if (existingProduct) {
        await dataBase.rollbackTransaction();
        return {
          statusCode: messages.statusCode.CONFLICT,
          message: messages.error.ALREADY_EXISTS,
          data: existingProduct,
        };
      }
      const newProduct = await this.productRepository.create(
        product,
        dataBase.manager
      );
      await dataBase.commitTransaction();
      return {
        statusCode: messages.statusCode.SUCCESS,
        message: messages.success.CREATED,
        data: newProduct,
      };
    } catch {
      await dataBase.rollbackTransaction();
      return {
        statusCode: messages.statusCode.INTERNAL_SERVER_ERROR,
        message: messages.error.SERVICE,
        data: undefined as unknown as Product,
      };
    } finally {
      await dataBase.release();
    }
  }
}
