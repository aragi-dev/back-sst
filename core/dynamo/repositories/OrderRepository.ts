import { GetItemCommand, PutItemCommand, DynamoDBClient } from "@aws-sdk/client-dynamodb";
import type { Order } from "../entities/Order";

const client = new DynamoDBClient({});
const MAIN_TABLE = process.env.MAIN_TABLE!;

export class OrderRepository {
  async getById(orderId: string): Promise<Order | null> {
    const command = new GetItemCommand({
      TableName: MAIN_TABLE,
      Key: {
        PK: { S: `ORDER#${orderId}` },
        SK: { S: "METADATA" },
      },
    });
    const { Item } = await client.send(command);
    if (!Item) return null;
    if (!Item.PK?.S || !Item.userId?.S || !Item.total?.N || !Item.status?.S || !Item.createdAt?.S) {
      throw new Error("Invalid order item from DynamoDB");
    }
    return {
      orderId: Item.PK.S.replace("ORDER#", ""),
      userId: Item.userId.S,
      total: Number(Item.total.N),
      status: Item.status.S,
      createdAt: Item.createdAt.S,
      updatedAt: Item.updatedAt?.S,
    };
  }

  async create(order: Order): Promise<void> {
    const item: Record<string, { S: string } | { N: string }> = {
      PK: { S: `ORDER#${order.orderId}` },
      SK: { S: "METADATA" },
      userId: { S: order.userId },
      total: { N: order.total.toString() },
      status: { S: order.status },
      createdAt: { S: order.createdAt },
    };
    if (order.updatedAt) {
      item.updatedAt = { S: order.updatedAt };
    }
    const command = new PutItemCommand({
      TableName: MAIN_TABLE,
      Item: item,
    });
    await client.send(command);
  }
}
