export interface createProductDto {
  code: string;
  name: string;
  description?: string;
  price: number;
  cost: number;
  stock: number;
}