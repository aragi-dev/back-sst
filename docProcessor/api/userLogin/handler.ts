import "reflect-metadata";
import "./injector";
import type { APIGatewayProxyHandler } from "aws-lambda";
import { container } from "tsyringe";
import Logger from "@utils/loggers/logger";
import { messages } from "@utils/messages";
import response from "@utils/adapters/responseHandler";
import { UserLogin } from "@docService/UserLogin";
import { schema } from "./schema";
import { connectDB } from "@dbBase/DocProcessor";
import { entities } from "./injector";
import jwt from "jsonwebtoken";

export const handler: APIGatewayProxyHandler = async (event) => {
  if (!process.env.JWT_SECRET) {
    return response({
      statusCode: messages.statusCode.INTERNAL_SERVER_ERROR,
      message: messages.error.TOKEN_NOT_CONFIG,
    });
  }
  const apiToken = event.headers?.["token"];
  if (!apiToken) {
    return response({
      statusCode: messages.statusCode.UNAUTHORIZED,
      message: messages.error.TOKEN_REQUIRED,
    });
  }
  try {
    const payload = jwt.verify(apiToken, process.env.JWT_SECRET) as any;
    if (payload.purpose !== "api-protection") {
      return response({
        statusCode: messages.statusCode.FORBIDDEN,
        message: messages.error.TOKEN_INVALID,
      });
    }
  } catch (e) {
    return response({
      statusCode: messages.statusCode.UNAUTHORIZED,
      message: messages.error.TOKEN_EXPIRED,
    });
  }

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
    const service = container.resolve(UserLogin);
    const result = await service.login(validate.data);
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
