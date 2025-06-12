import { DataSource } from "typeorm";
import { User } from "../core/entities/User";
import { Product } from "../core/entities/Product";
import { Sale } from "../core/entities/Sale";
import { SaleDetail } from "../core/entities/SaleDetail";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  entities: [User, Product, Sale, SaleDetail],
  synchronize: true,
});

export async function connectDB() {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }
  return AppDataSource;
}
