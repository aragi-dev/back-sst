import "reflect-metadata";
import type { APIGatewayProxyHandler } from "aws-lambda";
import { container } from "tsyringe";
import { ProductService } from "@services/ProductService";
import "@utils/injector";


export const handler: APIGatewayProxyHandler = async (event) => {
	const service = container.resolve(ProductService);
	const result = await service.getAll();
	return {
		statusCode: 200,
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ data: result }),
	};
};
