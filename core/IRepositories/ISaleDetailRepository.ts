import type { SaleDetail } from "@core/entities/SaleDetail";

export interface ISaleDetailRepository {
  findAll(): Promise<SaleDetail[]>;
  create(saleDetail: Partial<SaleDetail>): Promise<SaleDetail>;
  findById(id: string): Promise<SaleDetail | null>;
  update(id: string, data: Partial<SaleDetail>): Promise<SaleDetail | null>;
  delete(id: string): Promise<boolean>;
}
