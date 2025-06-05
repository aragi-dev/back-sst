import { connectDB } from "@utils/typeorm";
import { User } from "@core/entities/User";
import type { IUserRepository } from "@core/IRepositories/IUserRepository";

export class UserRepository implements IUserRepository {
  async findAll(): Promise<User[]> {
    const db = await connectDB();
    const repo = db.getRepository(User);
    return repo.find();
  }

  async create(user: Partial<User>): Promise<User> {
    const db = await connectDB();
    const repo = db.getRepository(User);
    return repo.save(user);
  }

  async findByParams(params: Partial<User>): Promise<User | null> {
    const db = await connectDB();
    const repo = db.getRepository(User);
    return repo.findOneBy(params);
  }

  async findById(id: string): Promise<User | null> {
    const db = await connectDB();
    const repo = db.getRepository(User);
    return repo.findOneBy({ id } as any);
  }

  async update(id: string, data: Partial<User>): Promise<User | null> {
    const db = await connectDB();
    const repo = db.getRepository(User);
    await repo.update(id, data);
    return repo.findOneBy({ id } as any);
  }

  async delete(id: string): Promise<boolean> {
    const db = await connectDB();
    const repo = db.getRepository(User);
    const result = await repo.delete(id);
    return result.affected !== 0;
  }
}
