export class Sale {
  constructor(
    public id: string,
    public user_id: string,
    public total: number,
    public status: boolean,
    public created_at: Date,
    public updated_at: Date,
  ) {}
}
