import { prisma } from "../../utils/prisma";
import type { SaleDetail } from "../entities/SaleDetail";
import type { ISaleDetailRepository } from "../IRepositories/ISaleDetailRepository";

export class SaleDetailRepository implements ISaleDetailRepository {
  async create(saleDetail: SaleDetail): Promise<SaleDetail> {
    return prisma.saleDetail.create({ data: saleDetail });
  }

  async findById(id: string): Promise<SaleDetail | null> {
    return prisma.saleDetail.findUnique({ where: { id } });
  }

  async findAll(): Promise<SaleDetail[]> {
    return prisma.saleDetail.findMany();
  }

  async update(saleDetail: SaleDetail): Promise<SaleDetail> {
    return prisma.saleDetail.update({ where: { id: saleDetail.id }, data: saleDetail });
  }

  async delete(id: string): Promise<void> {
    await prisma.saleDetail.delete({ where: { id } });
  }
}
