export class User {
  constructor(
    public id: string,
    public name: string,
    public password_hash: string,
    public role: string,
    public status: boolean,
    public created_at: Date,
    public updated_at: Date,
    public email: string,
  ) {}
}
