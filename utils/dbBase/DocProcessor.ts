import { DataSource } from "typeorm";

const databaseUrl = process.env.NEON_DATABASE_URL;

if (!databaseUrl) {
  throw new Error("NEON_DATABASE_URL is not defined in environment variables");
}

export function createDataSource(entities: any[]) {
  return new DataSource({
    type: "postgres",
    url: databaseUrl,
    entities: entities,
    synchronize: true, // Set to false in production
    logging: false,
    ssl: {
      rejectUnauthorized: false,
    },
  });
}

export async function connectDB(entities: any[]) {
  const dataSource = createDataSource(entities);
  if (!dataSource.isInitialized) {
    await dataSource.initialize();
  }
  return dataSource;
}