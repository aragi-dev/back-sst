import { inject, injectable } from "tsyringe";
import type { IProductRepository } from "@core/IRepositories/IProductRepository";
import type { Product } from "@core/entities/Product";
import type { createProductDto } from "@interfaces/ProductDto"

@injectable()
export default class ProductService {
  constructor(
    @inject("ProductRepository")
    private readonly productRepository: IProductRepository
  ) {}

  async getAll(): Promise<Product[]> {
    const products = await this.productRepository.findAll();
    return products;
  }

  async getOne(id: string): Promise<Product> {
    const product = await this.productRepository.findById(id);
    if (!product) {
      throw new Error("Product not found");
    }
    return product;
  }

  async createOne(productData: createProductDto): Promise<Product> {
    const product = await this.productRepository.create(productData);
    return product;
  }

  async updateOne(id: string, productData: Partial<Product>): Promise<Product> {
    const existingProduct = await this.productRepository.findById(id);
    if (!existingProduct) {
      throw new Error("Product not found");
    }
    const updatedProduct = await this.productRepository.update({
      ...existingProduct,
      ...productData,
    });
    return updatedProduct;
  }

  async deleteOne(id: string) {
    const existingProduct = await this.productRepository.findById(id);
    if (!existingProduct) {
      throw new Error("Product not found");
    }
    await this.productRepository.delete(id);
  }
}
