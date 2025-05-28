import type { Sale } from "../entities/Sale";

export interface ISaleRepository {
  create(sale: Sale): Promise<Sale>;
  findById(id: string): Promise<Sale | null>;
  findAll(): Promise<Sale[]>;
  update(sale: Sale): Promise<Sale>;
  delete(id: string): Promise<void>;
}
