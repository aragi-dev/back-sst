import type { User } from "@core/entities/User";

export interface IUserRepository {
  findAll(): Promise<User[]>;
  create(user: Partial<User>): Promise<User>;
  findByParams(params: Partial<User>): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  update(id: string, data: Partial<User>): Promise<User | null>;
  delete(id: string): Promise<boolean>;
}
