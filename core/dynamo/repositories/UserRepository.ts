import { GetItemCommand, PutItemCommand, DynamoDBClient } from "@aws-sdk/client-dynamodb";
import type { User } from "../entities/User";

const client = new DynamoDBClient({});
const MAIN_TABLE = process.env.MAIN_TABLE!;

export class UserRepository {
  async getById(userId: string): Promise<User | null> {
    const command = new GetItemCommand({
      TableName: MAIN_TABLE,
      Key: {
        PK: { S: `USER#${userId}` },
        SK: { S: "PROFILE" },
      },
    });
    const { Item } = await client.send(command);
    if (!Item) return null;
    if (!Item.PK?.S || !Item.email?.S || !Item.name?.S || !Item.createdAt?.S) {
      throw new Error("Invalid user item from DynamoDB");
    }
    return {
      userId: Item.PK.S.replace("USER#", ""),
      email: Item.email.S,
      name: Item.name.S,
      address: Item.address?.S,
      createdAt: Item.createdAt.S,
      updatedAt: Item.updatedAt?.S,
    };
  }

  async create(user: User): Promise<void> {
    const item: Record<string, { S: string }> = {
      PK: { S: `USER#${user.userId}` },
      SK: { S: "PROFILE" },
      email: { S: user.email },
      name: { S: user.name },
      createdAt: { S: user.createdAt },
    };
    if (user.address) item.address = { S: user.address };
    if (user.updatedAt) item.updatedAt = { S: user.updatedAt };
    const command = new PutItemCommand({
      TableName: MAIN_TABLE,
      Item: item,
    });
    await client.send(command);
  }
}
