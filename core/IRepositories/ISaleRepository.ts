import { Sale } from "@core/entities/Sale";

export interface ISaleRepository {
  findAll(): Promise<Sale[]>;
  findById(id: string): Promise<Sale | null>;
  create(sale: Partial<Sale>): Promise<Sale>;
  update(id: string, data: Partial<Sale>): Promise<Sale | null>;
  delete(id: string): Promise<boolean>;
}
