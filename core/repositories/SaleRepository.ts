import { prisma } from "@utils/prisma";
import type { Sale } from "@core/entities/Sale";
import type { ISaleRepository } from "@core/IRepositories/ISaleRepository";

export class SaleRepository implements ISaleRepository {
  async create(sale: Sale): Promise<Sale> {
    return prisma.sale.create({ data: sale });
  }

  async findById(id: string): Promise<Sale | null> {
    return prisma.sale.findUnique({ where: { id } });
  }

  async findAll(): Promise<Sale[]> {
    return prisma.sale.findMany();
  }

  async update(sale: Sale): Promise<Sale> {
    return prisma.sale.update({ where: { id: sale.id }, data: sale });
  }

  async delete(id: string): Promise<void> {
    await prisma.sale.delete({ where: { id } });
  }
}
