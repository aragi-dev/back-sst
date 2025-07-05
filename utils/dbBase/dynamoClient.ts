import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

const dynamoClient = new DynamoDBClient({});

export default dynamoClient;
