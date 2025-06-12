import "reflect-metadata";
import type { APIGatewayProxyHandler } from "aws-lambda";
import { container } from "tsyringe";
import { ProductService } from "@services/ProductService";
import "@utils/injector";
import response from "@utils/adapters/responseHandler";
import { messages } from "@utils/messages";

export const handler: APIGatewayProxyHandler = async (event) => {
  try {
    const service = container.resolve(ProductService);
    const result = await service.getAll();
    return response(result);
  } catch (error) {
    return response({
      statusCode: messages.statusCode.INTERNAL_SERVER_ERROR,
      message: messages.error.SERVICE,
      data: error,
    });
  }
};
