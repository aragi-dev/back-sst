import { GetItemCommand, PutItemCommand, DynamoDBClient } from "@aws-sdk/client-dynamodb";
import type { Product } from "../entities/Product";

const client = new DynamoDBClient({});
const MAIN_TABLE = process.env.MAIN_TABLE!;

export class ProductRepository {
  async getById(productId: string): Promise<Product | null> {
    const command = new GetItemCommand({
      TableName: MAIN_TABLE,
      Key: {
        PK: { S: `PRODUCT#${productId}` },
        SK: { S: "METADATA" },
      },
    });
    const { Item } = await client.send(command);
    if (!Item) return null;
    if (!Item.PK?.S || !Item.name?.S || !Item.description?.S || !Item.price?.N || !Item.restaurantId?.S || !Item.createdAt?.S) {
      throw new Error("Invalid product item from DynamoDB");
    }
    return {
      productId: Item.PK.S.replace("PRODUCT#", ""),
      name: Item.name.S,
      description: Item.description.S,
      price: Number(Item.price.N),
      imageUrl: Item.imageUrl?.S,
      restaurantId: Item.restaurantId.S,
      createdAt: Item.createdAt.S,
      updatedAt: Item.updatedAt?.S,
    };
  }

  async create(product: Product): Promise<void> {
    const item: Record<string, { S: string } | { N: string }> = {
      PK: { S: `PRODUCT#${product.productId}` },
      SK: { S: "METADATA" },
      name: { S: product.name },
      description: { S: product.description },
      price: { N: product.price.toString() },
      restaurantId: { S: product.restaurantId },
      createdAt: { S: product.createdAt },
    };
    if (product.imageUrl) item.imageUrl = { S: product.imageUrl };
    if (product.updatedAt) item.updatedAt = { S: product.updatedAt };
    const command = new PutItemCommand({
      TableName: MAIN_TABLE,
      Item: item,
    });
    await client.send(command);
  }
}
