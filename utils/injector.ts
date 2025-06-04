import { container } from "tsyringe";
import type { IProductRepository } from "@core/IRepositories/IProductRepository";
import type { IUserRepository } from "@core/IRepositories/IUserRepository";
import { ProductRepository } from "@core/repositories/ProductRepository";
import { UserRepository } from "@core/repositories/UserRepository";

container.register<IProductRepository>("ProductRepository", { useClass: ProductRepository });
container.register<IUserRepository>("UserRepository", { useClass: UserRepository });
