import "reflect-metadata";
import type { APIGatewayProxyHandler } from "aws-lambda";
import { container } from "tsyringe";
import GetProducts from "../services/getProducts";
import "../utils/injector";


export const handler: APIGatewayProxyHandler = async (event) => {
	const service = container.resolve(GetProducts);
	const result = await service.execute();
	return {
		statusCode: 200,
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ data: result }),
	};
};
