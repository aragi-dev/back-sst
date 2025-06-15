import "reflect-metadata";
import "./injector";
import { schema } from "./schema";
import type { APIGatewayProxyHandler } from "aws-lambda";
import { container } from "tsyringe";
import Logger from "@utils/loggers/logger";
import { messages } from "@utils/messages";
import response from "@utils/adapters/responseHandler";
import { UserCreate } from "@docService/UserCreate";
import { connectDB } from "@dbBase/DocProcessor";
import { entities } from "./injector";

export const handler: APIGatewayProxyHandler = async (event) => {
  let parsedBody = JSON.parse(event.body || "{}");
  const validate = schema.safeParse(parsedBody);
  if (!validate.success) {
    Logger.error(messages.error.VALIDATION_ERROR, validate.error);
    return response({
      statusCode: messages.statusCode.BAD_REQUEST,
      message: messages.error.VALIDATION_ERROR,
      error: validate.error.errors,
    });
  }
  const dataSource = await connectDB(entities);
  if (!container.isRegistered("DataSource")) {
    container.register("DataSource", { useValue: dataSource });
  }
  try {
    const service = container.resolve(UserCreate);
    const result = await service.create(validate.data);
    return response(result);
  } catch (error) {
    Logger.error(messages.error.INTERNAL_SERVER_ERROR, error);
    return response({
      statusCode: messages.statusCode.INTERNAL_SERVER_ERROR,
      message: messages.error.INTERNAL_SERVER_ERROR,
      data: error,
    });
  }
};