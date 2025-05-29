import type { Product } from "@core/entities/Product";

export interface IProductRepository {
  create(product: Partial<Product>): Promise<Product>;
  findById(id: string): Promise<Product | null>;
  findAll(): Promise<Product[]>;
  update(product: Partial<Product>): Promise<Product>;
  delete(id: string): Promise<void>;
}
