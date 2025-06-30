/// <reference path="./.sst/platform/config.d.ts" />

import { apiRoutes } from "./docProcessor/api/index";
import { authLambda } from "./auth/index";
import { ResourceKey } from "./utils/enums/ResourceKey";
import type { SendEmailLambdaProps } from "./docProcessor/api/sendEmail/index";
import type { UserCreateLambdaProps } from "./docProcessor/api/userCreate/index";
import type { UserLoginLambdaProps } from "./docProcessor/api/userLogin/index";

export default $config({
	app(input) {
		return {
			name: "back-sst",
			removal: input?.stage === "prod" ? "retain" : "remove",
			protect: ["prod"].includes(input?.stage),
			home: "aws",
		};
	},
	async run() {
		const { CorsOrigins } = await import("@utils/enums/CorsOrigins");
		const { Domain } = await import("@utils/enums/Domain");
		const { Email } = await import("@utils/enums/Email");
		const { Env } = await import("@utils/enums/Env");
		const { HttpMethod } = await import("@utils/enums/HttpMethos");
		const isProd = $app.stage === Env.PROD;
		const dbSecret = new sst.Secret("NEON_DATABASE_URL");
		const jwtSecret = new sst.Secret("JWT_SECRET");
		const email = sst.aws.Email.get("MyEmail", Email.FROM);
		const qrBucket = new sst.aws.Bucket("QrBucket", {
			cors: {
				allowOrigins: [CorsOrigins.ALL],
				allowMethods: [HttpMethod.GET],
			},
			versioning: false,
			transform: {
				bucket: {
					lifecycleRules: [
						{
							id: "DeleteOldQRCodes",
							expirations: [
								{
									days: 1,
								},
							],
							prefix: "mfa/",
							enabled: true,
						},
					],
				},
			},
		});
		const api = new sst.aws.ApiGatewayV2("doc", {
			cors: {
				allowOrigins: [isProd ? CorsOrigins.PROD : CorsOrigins.DEV],
				allowMethods: [HttpMethod.POST],
			},
			domain: $app.stage === Env.PROD
				? {
					nameId: Domain.PROD,
				}
				: undefined,
			transform: {
				route: {
					handler: (args, _opts) => {
						args.memory ??= "2048 MB";
						args.timeout ??= "5 seconds";
					},
				},
			},
		});


		type Resources = {
			[key in ResourceKey]: unknown;
		};
		const resources: Resources = {
			[ResourceKey.dbSecret]: dbSecret,
			[ResourceKey.email]: email,
			[ResourceKey.qrBucket]: qrBucket,
			[ResourceKey.jwtSecret]: jwtSecret,
		};

		function buildProps<T>(needs: string[], resources: Record<string, unknown>, stage: string): T {
			const props: any = { stage };
			for (const dep of needs) {
				props[dep] = resources[dep];
			}
			return props as T;
		}

		for (const route of apiRoutes) {
			const { method, path, lambdaFactory, needs } = route;
			const lambdaProps = needs.reduce((acc, dep) => {
				acc[dep] = resources[dep];
				return acc;
			}, { stage: $app.stage });
			api.route(`${method} ${path}`, lambdaFactory(lambdaProps));
		}

		api.route("POST /auth", authLambda({
			stage: $app.stage,
			jwtSecret,
		}));
	},
});
