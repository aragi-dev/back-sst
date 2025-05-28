import { prisma } from "../../utils/prisma";
import type { User } from "../entities/User";
import type { IUserRepository } from "../IRepositories/IUserRepository";

export class UserRepository implements IUserRepository {
  async create(user: User): Promise<User> {
    return prisma.user.create({ data: user });
  }

  async findById(id: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { id } });
  }

  async findAll(): Promise<User[]> {
    return prisma.user.findMany();
  }

  async update(user: User): Promise<User> {
    return prisma.user.update({ where: { id: user.id }, data: user });
  }

  async delete(id: string): Promise<void> {
    await prisma.user.delete({ where: { id } });
  }
}
