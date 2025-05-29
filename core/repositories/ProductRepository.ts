import { prisma } from "@utils/prisma";
import type { Product } from "@core/entities/Product";
import type { IProductRepository } from "@core/IRepositories/IProductRepository";

export class ProductRepository implements IProductRepository {
  async create(saleDetail: Product): Promise<Product> {
    return prisma.product.create({ data: saleDetail });
  }

  async findById(id: string): Promise<Product | null> {
    return prisma.product.findUnique({ where: { id } });
  }

  async findAll(): Promise<Product[]> {
    return prisma.product.findMany();
  }

  async update(saleDetail: Product): Promise<Product> {
    return prisma.product.update({ where: { id: saleDetail.id }, data: saleDetail });
  }

  async delete(id: string): Promise<void> {
    await prisma.product.delete({ where: { id } });
  }
}
