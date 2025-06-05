import { connectDB } from "@utils/typeorm";
import { Sale } from "@core/entities/Sale";

export class SaleRepository {
  async findAll(): Promise<Sale[]> {
    const db = await connectDB();
    const repo = db.getRepository(Sale);
    return repo.find();
  }

  async findById(id: string): Promise<Sale | null> {
    const db = await connectDB();
    const repo = db.getRepository(Sale);
    return repo.findOneBy({ id } as any);
  }

  async create(sale: Partial<Sale>): Promise<Sale> {
    const db = await connectDB();
    const repo = db.getRepository(Sale);
    return repo.save(sale);
  }

  async update(id: string, data: Partial<Sale>): Promise<Sale | null> {
    const db = await connectDB();
    const repo = db.getRepository(Sale);
    await repo.update(id, data);
    return repo.findOneBy({ id } as any);
  }

  async delete(id: string): Promise<boolean> {
    const db = await connectDB();
    const repo = db.getRepository(Sale);
    const result = await repo.delete(id);
    return result.affected !== 0;
  }
}
