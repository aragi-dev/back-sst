import { connectDB } from "@utils/typeorm";
import { Sale } from "@core/entities/Sale";
import type { EntityManager } from "typeorm";
import type { ISaleRepository } from "@core/IRepositories/ISaleRepository";
import { LogRepository } from "@utils/loggers/repositoryDecorator";

export class SaleRepository implements ISaleRepository {
  @LogRepository
  async findAll(manager?: EntityManager): Promise<Sale[]> {
    const db = manager || (await connectDB());
    const repo = manager ? manager.getRepository(Sale) : db.getRepository(Sale);
    return repo.find();
  }

  @LogRepository
  async create(data: Partial<Sale>, manager?: EntityManager): Promise<Sale> {
    const db = manager || (await connectDB());
    const repo = manager ? manager.getRepository(Sale) : db.getRepository(Sale);
    return repo.save(data);
  }

  @LogRepository
  async findByParams(
    data: Partial<Sale>,
    manager?: EntityManager
  ): Promise<Sale | null> {
    const db = manager || (await connectDB());
    const repo = manager ? manager.getRepository(Sale) : db.getRepository(Sale);
    return repo.findOneBy(data);
  }

  @LogRepository
  async findById(id: string, manager?: EntityManager): Promise<Sale | null> {
    const db = manager || (await connectDB());
    const repo = manager ? manager.getRepository(Sale) : db.getRepository(Sale);
    return repo.findOneBy({ id });
  }

  @LogRepository
  async update(
    id: string,
    data: Partial<Sale>,
    manager?: EntityManager
  ): Promise<Sale | null> {
    const db = manager || (await connectDB());
    const repo = manager ? manager.getRepository(Sale) : db.getRepository(Sale);
    await repo.update(id, data);
    return repo.findOneBy({ id });
  }

  @LogRepository
  async delete(id: string, manager?: EntityManager): Promise<boolean> {
    const db = manager || (await connectDB());
    const repo = manager ? manager.getRepository(Sale) : db.getRepository(Sale);
    const result = await repo.delete(id);
    return result.affected !== 0;
  }
}
