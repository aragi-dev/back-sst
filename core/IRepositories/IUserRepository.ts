import type { User } from "@core/entities/User";


export interface IUserRepository {
  findAll(): Promise<User[]>;
  create(product: Partial<User>): Promise<User>;
  findByParams(params: Partial<User>): Promise<User | null>;
}
