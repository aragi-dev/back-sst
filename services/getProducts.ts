import { inject, injectable } from "tsyringe";
import type { IProductRepository } from "../core/IRepositories/IProductRepository";

@injectable()
export default class GetProducts {
  constructor(
    @inject("ProductRepository") private readonly productRepository: IProductRepository
  ) {}

  async execute() {
    const products = await this.productRepository.findAll();
    return products;
  }
}