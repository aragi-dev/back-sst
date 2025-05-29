import { container } from "tsyringe";
import type { IUserRepository } from "@core/IRepositories/IUserRepository";
import type { IProductRepository } from "@core/IRepositories/IProductRepository";
import type { ISaleRepository } from "@core/IRepositories/ISaleRepository";
import type { ISaleDetailRepository } from "@core/IRepositories/ISaleDetailRepository";

import { UserRepository } from "@core/repositories/UserRepository";
import { ProductRepository } from "@core/repositories/ProductRepository";
import { SaleRepository } from "@core/repositories/SaleRepository";
import { SaleDetailRepository } from "@core/repositories/SaleDetailRepository";



container.register<IUserRepository>("UserRepository", { useClass: UserRepository });
container.register<IProductRepository>("ProductRepository", { useClass: ProductRepository });
container.register<ISaleRepository>("SaleRepository", { useClass: SaleRepository });
container.register<ISaleDetailRepository>("SaleDetailRepository", { useClass: SaleDetailRepository });
