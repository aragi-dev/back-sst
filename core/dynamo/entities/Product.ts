export interface Product {
  productId: string;
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
  restaurantId: string;
  createdAt: string;
  updatedAt?: string;
}
