import { connectDB } from "@utils/typeorm";
import { Product } from "@core/entities/Product";
import type { IProductRepository } from "@core/IRepositories/IProductRepository";

export class ProductRepository implements IProductRepository {
  async findAll(): Promise<Product[]> {
    const db = await connectDB();
    const repo = db.getRepository(Product);
    return repo.find();
  }

  async create(product: Partial<Product>): Promise<Product> {
    const db = await connectDB();
    const repo = db.getRepository(Product);
    return repo.save(product);
  }

  async findByParams(params: Partial<Product>): Promise<Product | null> {
    const db = await connectDB();
    const repo = db.getRepository(Product);
    return repo.findOneBy(params);
  }

  async findById(id: string): Promise<Product | null> {
    const db = await connectDB();
    const repo = db.getRepository(Product);
    return repo.findOneBy({ id });
  }

  async update(id: string, data: Partial<Product>): Promise<Product | null> {
    const db = await connectDB();
    const repo = db.getRepository(Product);
    await repo.update(id, data);
    return repo.findOneBy({ id });
  }

  async delete(id: string): Promise<boolean> {
    const db = await connectDB();
    const repo = db.getRepository(Product);
    const result = await repo.delete(id);
    return result.affected !== 0;
  }
}
