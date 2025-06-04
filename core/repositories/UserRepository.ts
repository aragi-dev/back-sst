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
}
