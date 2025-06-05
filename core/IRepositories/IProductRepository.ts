import type { Product } from "@core/entities/Product";

export interface IProductRepository {
  findAll(): Promise<Product[]>;
  create(product: Partial<Product>): Promise<Product>;
  findByParams(params: Partial<Product>): Promise<Product | null>;
  findById(id: string): Promise<Product | null>;
  update(id: string, data: Partial<Product>): Promise<Product | null>;
  delete(id: string): Promise<boolean>;
}
