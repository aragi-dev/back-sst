import type { User } from "@docEntity/User";
import type { EntityManager } from "typeorm";

export interface IUserRepository {
  findAll(manager: EntityManager): Promise<User[]>;
  create(user: Partial<User>, manager: EntityManager): Promise<User>;
  findByParams(params: Partial<User>, manager: EntityManager): Promise<User | null>;
  findById(id: string, manager: EntityManager): Promise<User | null>;
  update(id: string, data: Partial<User>, manager: EntityManager): Promise<User | null>;
  delete(id: string, manager: EntityManager): Promise<boolean>;
}
