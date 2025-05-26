import type { APIGatewayProxyHandler } from "aws-lambda";

const handler: APIGatewayProxyHandler = async (event) => {
	return {
		statusCode: 200,
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ message: "¡Hola desde Lambda!" }),
	};
};
export default handler;
