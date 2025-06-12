import { connectDB } from "@utils/typeorm";
import { Product } from "@core/entities/Product";
import type { IProductRepository } from "@core/IRepositories/IProductRepository";
import type { EntityManager } from "typeorm";
import { LogRepository } from "@utils/loggers/repositoryDecorator";

export class ProductRepository implements ProductRepository {
  @LogRepository
  async findAll(manager?: EntityManager): Promise<Product[]> {
    const db = manager || (await connectDB());
    const repo = manager
      ? manager.getRepository(Product)
      : db.getRepository(Product);
    return repo.find();
  }

  @LogRepository
  async create(
    data: Partial<Product>,
    manager?: EntityManager
  ): Promise<Product> {
    const db = manager || (await connectDB());
    const repo = manager
      ? manager.getRepository(Product)
      : db.getRepository(Product);
    return repo.save(data);
  }

  @LogRepository
  async findByParams(
    data: Partial<Product>,
    manager?: EntityManager
  ): Promise<Product | null> {
    const db = manager || (await connectDB());
    const repo = manager
      ? manager.getRepository(Product)
      : db.getRepository(Product);
    return repo.findOneBy(data);
  }

  @LogRepository
  async findById(id: string, manager?: EntityManager): Promise<Product | null> {
    const db = manager || (await connectDB());
    const repo = manager
      ? manager.getRepository(Product)
      : db.getRepository(Product);
    return repo.findOneBy({ id });
  }

  @LogRepository
  async update(
    id: string,
    data: Partial<Product>,
    manager?: EntityManager
  ): Promise<Product | null> {
    const db = manager || (await connectDB());
    const repo = manager
      ? manager.getRepository(Product)
      : db.getRepository(Product);
    await repo.update(id, data);
    return repo.findOneBy({ id });
  }

  @LogRepository
  async delete(id: string, manager?: EntityManager): Promise<boolean> {
    const db = manager || (await connectDB());
    const repo = manager
      ? manager.getRepository(Product)
      : db.getRepository(Product);
    const result = await repo.delete(id);
    return result.affected !== 0;
  }
}
