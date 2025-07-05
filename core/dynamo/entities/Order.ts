export interface Order {
  orderId: string;
  userId: string;
  total: number;
  status: string;
  createdAt: string;
  updatedAt?: string;
}
