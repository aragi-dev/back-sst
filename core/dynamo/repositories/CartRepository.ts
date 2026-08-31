
import { QueryCommand, PutItemCommand, DeleteItemCommand, DynamoDBClient } from "@aws-sdk/client-dynamodb";
import type { CartItem } from "../entities/CartItem";

const client = new DynamoDBClient({});
const MAIN_TABLE = process.env.MAIN_TABLE!;

export class CartRepository {
  async getCartItems(userId: string): Promise<CartItem[]> {
    const command = new QueryCommand({
      TableName: MAIN_TABLE,
      KeyConditionExpression: "PK = :pk and begins_with(SK, :sk)",
      ExpressionAttributeValues: {
        ":pk": { S: `CART#${userId}` },
        ":sk": { S: "PRODUCT#" },
      },
    });
    const { Items } = await client.send(command);
    if (!Items) return [];
    return Items.map((item) => {
      if (!item.PK?.S || !item.SK?.S || !item.quantity?.N || !item.addedAt?.N) {
        throw new Error("Invalid item from DynamoDB");
      }
      return {
        userId: item.PK.S.replace("CART#", ""),
        productId: item.SK.S.replace("PRODUCT#", ""),
        quantity: Number(item.quantity.N),
        addedAt: item.addedAt.N.toString(),
      };
    });
  }

  async addCartItem(item: CartItem): Promise<void> {
    const command = new PutItemCommand({
      TableName: MAIN_TABLE,
      Item: {
        PK: { S: `CART#${item.userId}` },
        SK: { S: `PRODUCT#${item.productId}` },
        quantity: { N: item.quantity.toString() },
        addedAt: { N: item.addedAt.toString() },
      },
    });
    await client.send(command);
  }

  async removeCartItem(userId: string, productId: string): Promise<void> {
    const command = new DeleteItemCommand({
      TableName: MAIN_TABLE,
      Key: {
        PK: { S: `CART#${userId}` },
        SK: { S: `PRODUCT#${productId}` },
      },
    });
    await client.send(command);
  }
}
