import { connectDB } from "@utils/typeorm";
import { SaleDetail } from "@core/entities/SaleDetail";
import type { EntityManager } from "typeorm";
import type { ISaleDetailRepository } from "@core/IRepositories/ISaleDetailRepository";
import { LogRepository } from "@utils/loggers/repositoryDecorator";

export class SaleDetailRepository implements ISaleDetailRepository {
  @LogRepository
  async findAll(manager?: EntityManager): Promise<SaleDetail[]> {
    const db = manager || (await connectDB());
    const repo = manager
      ? manager.getRepository(SaleDetail)
      : db.getRepository(SaleDetail);
    return repo.find();
  }

  @LogRepository
  async create(
    data: Partial<SaleDetail>,
    manager?: EntityManager
  ): Promise<SaleDetail> {
    const db = manager || (await connectDB());
    const repo = manager
      ? manager.getRepository(SaleDetail)
      : db.getRepository(SaleDetail);
    return repo.save(data);
  }

  @LogRepository
  async findByParams(
    data: Partial<SaleDetail>,
    manager?: EntityManager
  ): Promise<SaleDetail | null> {
    const db = manager || (await connectDB());
    const repo = manager
      ? manager.getRepository(SaleDetail)
      : db.getRepository(SaleDetail);
    return repo.findOneBy(data);
  }

  @LogRepository
  async findById(
    id: string,
    manager?: EntityManager
  ): Promise<SaleDetail | null> {
    const db = manager || (await connectDB());
    const repo = manager
      ? manager.getRepository(SaleDetail)
      : db.getRepository(SaleDetail);
    return repo.findOneBy({ id });
  }

  @LogRepository
  async update(
    id: string,
    data: Partial<SaleDetail>,
    manager?: EntityManager
  ): Promise<SaleDetail | null> {
    const db = manager || (await connectDB());
    const repo = manager
      ? manager.getRepository(SaleDetail)
      : db.getRepository(SaleDetail);
    await repo.update(id, data);
    return repo.findOneBy({ id });
  }

  @LogRepository
  async delete(id: string, manager?: EntityManager): Promise<boolean> {
    const db = manager || (await connectDB());
    const repo = manager
      ? manager.getRepository(SaleDetail)
      : db.getRepository(SaleDetail);
    const result = await repo.delete(id);
    return result.affected !== 0;
  }
}
