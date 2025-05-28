import type { SaleDetail } from "../entities/SaleDetail";

export interface ISaleDetailRepository {
  create(saleDetail: SaleDetail): Promise<SaleDetail>;
  findById(id: string): Promise<SaleDetail | null>;
  findAll(): Promise<SaleDetail[]>;
  update(saleDetail: SaleDetail): Promise<SaleDetail>;
  delete(id: string): Promise<void>;
}
