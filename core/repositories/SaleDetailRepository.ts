import { connectDB } from "@utils/typeorm";
import { SaleDetail } from "@core/entities/SaleDetail";

export class SaleDetailRepository {
  async findAll(): Promise<SaleDetail[]> {
    const db = await connectDB();
    const repo = db.getRepository(SaleDetail);
    return repo.find();
  }

  async findById(id: string): Promise<SaleDetail | null> {
    const db = await connectDB();
    const repo = db.getRepository(SaleDetail);
    return repo.findOneBy({ id } as any);
  }

  async create(saleDetail: Partial<SaleDetail>): Promise<SaleDetail> {
    const db = await connectDB();
    const repo = db.getRepository(SaleDetail);
    return repo.save(saleDetail);
  }

  async update(
    id: string,
    data: Partial<SaleDetail>
  ): Promise<SaleDetail | null> {
    const db = await connectDB();
    const repo = db.getRepository(SaleDetail);
    await repo.update(id, data);
    return repo.findOneBy({ id } as any);
  }

  async delete(id: string): Promise<boolean> {
    const db = await connectDB();
    const repo = db.getRepository(SaleDetail);
    const result = await repo.delete(id);
    return result.affected !== 0;
  }
}
