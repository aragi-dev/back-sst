import { DataSource } from "typeorm";
import { User } from "../core/entities/User";
import { Product } from "../core/entities/Product";
import { Sale } from "../core/entities/Sale";
import { SaleDetail } from "../core/entities/SaleDetail";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST || "localhost",
  port: +(process.env.DB_PORT || 5432),
  username: process.env.DB_USER || "postgres",
  password: process.env.DB_PASS || "miyasaki002",
  database: process.env.DB_NAME || "postgres",
  entities: [User, Product, Sale, SaleDetail],
  synchronize: true,
});

export async function connectDB() {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }
  return AppDataSource;
}
