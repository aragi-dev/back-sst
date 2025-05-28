export class Product {
  constructor(
    public id: string,
    public code: string,
    public name: string,
    public description: string | null,
    public purchase_price: number,
    public price: number,
    public stock: number,
    public status: boolean,
    public created_at: Date,
    public updated_at: Date,
  ) {}
}
