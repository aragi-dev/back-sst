import { container } from "tsyringe";
import type { IProductRepository } from "@core/IRepositories/IProductRepository";
import type { IUserRepository } from "@core/IRepositories/IUserRepository";
import { ProductRepository } from "@core/repositories/ProductRepository";
import { UserRepository } from "@core/repositories/UserRepository";
import type { ISaleRepository } from "@core/IRepositories/ISaleRepository";
import { SaleRepository } from "@core/repositories/SaleRepository";
import type { ISaleDetailRepository } from "@core/IRepositories/ISaleDetailRepository";
import { SaleDetailRepository } from "@core/repositories/SaleDetailRepository";

container.register<IProductRepository>("ProductRepository", {
  useClass: ProductRepository,
});
container.register<IUserRepository>("UserRepository", {
  useClass: UserRepository,
});
container.register<ISaleRepository>("SaleRepository", {
  useClass: SaleRepository,
});
container.register<ISaleDetailRepository>("SaleDetailRepository", {
  useClass: SaleDetailRepository,
});
