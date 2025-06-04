import "reflect-metadata";
import type { APIGatewayProxyHandler } from "aws-lambda";
import { container } from "tsyringe";
import { ProductService } from "@services/ProductService";
import "@utils/injector";
import { createUserSchema } from "@schemas/userSchema";
import Logger from "@utils/loggers/logger";
import { messages } from "@utils/messages";
import response from "@utils/adapters/responseHandler";
import { UserService } from "@services/UserService";

export const handler: APIGatewayProxyHandler = async (event) => {
  let parsedBody;
  try {
    parsedBody = JSON.parse(event.body || '{}');
  } catch (err) {
    Logger.error(messages.error.VALIDATION_ERROR, err);
    return response({
      statusCode: messages.statusCode.BAD_REQUEST,
      message: messages.error.VALIDATION_ERROR,
      error: messages.error.INVALID_INPUT,
    });
  }
  const validate = createUserSchema.safeParse(parsedBody);
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
    const result = await service.create(validate.data);
    return response(result);
  } catch (error) {
    return response({
      statusCode: messages.statusCode.INTERNAL_SERVER_ERROR,
      message: messages.error.SERVICE,
      data: error,
    });
  }
};
