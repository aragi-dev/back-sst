import { connectDB } from "@dbBase/DocProcessor";
import { User } from "@docEntity/User";
import type { IUserRepository } from "@docInterfaceRepository/IUserRepository";
import type { EntityManager } from "typeorm";
import { LogRepository } from "@utils/loggers/repositoryDecorator";

export class UserRepository implements IUserRepository {
  @LogRepository
  async findAll(manager?: EntityManager): Promise<User[]> {
    const db = manager || (await connectDB());
    const repo = manager ? manager.getRepository(User) : db.getRepository(User);
    return repo.find();
  }

  @LogRepository
  async create(data: Partial<User>, manager?: EntityManager): Promise<User> {
    const db = manager || (await connectDB());
    const repo = manager ? manager.getRepository(User) : db.getRepository(User);
    return repo.save(data);
  }

  @LogRepository
  async findByParams(
    params: Partial<User>,
    manager?: EntityManager
  ): Promise<User | null> {
    const db = manager || (await connectDB());
    const repo = manager ? manager.getRepository(User) : db.getRepository(User);
    return repo.findOneBy(params);
  }

  @LogRepository
  async findById(id: string, manager?: EntityManager): Promise<User | null> {
    const db = manager || (await connectDB());
    const repo = manager ? manager.getRepository(User) : db.getRepository(User);
    return repo.findOneBy({ id });
  }

  @LogRepository
  async update(
    id: string,
    data: Partial<User>,
    manager?: EntityManager
  ): Promise<User | null> {
    const db = manager || (await connectDB());
    const repo = manager ? manager.getRepository(User) : db.getRepository(User);
    await repo.update(id, data);
    return repo.findOneBy({ id });
  }

  @LogRepository
  async delete(id: string, manager?: EntityManager): Promise<boolean> {
    const db = manager || (await connectDB());
    const repo = manager ? manager.getRepository(User) : db.getRepository(User);
    const result = await repo.delete(id);
    return result.affected !== 0;
  }
}