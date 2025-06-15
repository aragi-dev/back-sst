import { DataSource } from "typeorm";
import { User } from "@docEntity/User";

const databaseUrl = process.env.NEON_DATABASE_URL;

if (!databaseUrl) {
  throw new Error("NEON_DATABASE_URL is not defined in environment variables");
}

export const AppDataSource = new DataSource({
  type: "postgres",
  url: databaseUrl,
  entities: [User],
  synchronize: true, // Set to false in production
  logging: false,
  ssl: {
    rejectUnauthorized: false,
  },
});

export async function connectDB() {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }
  return AppDataSource;
}