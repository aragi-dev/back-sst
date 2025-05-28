export class SaleDetail {
  constructor(
    public id: string,
    public sale_id: string,
    public product_id: string,
    public quantity: number,
    public unit_price: number,
    public status: boolean,
    public created_at: Date,
    public updated_at: Date,
  ) {}
}
