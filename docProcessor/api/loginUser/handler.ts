import "reflect-metadata";
import type { APIGatewayProxyHandler } from "aws-lambda";
import { container } from "tsyringe";
import "./injector";
import Logger from "@utils/loggers/logger";
import { messages } from "@utils/messages";
import response from "@utils/adapters/responseHandler";
import { UserService } from "@docService/UserService";
import { schema } from "./schema";

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
  try {
    const service = container.resolve(UserService);
    const result = await service.login(validate.data);
    return response(result);
  } catch (error) {
    return response({
      statusCode: messages.statusCode.INTERNAL_SERVER_ERROR,
      message: messages.error.SERVICE,
      data: error,
    });
  }
};
