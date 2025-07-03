/// <reference path="./.sst/platform/config.d.ts" />

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
		const { Env } = await import("@utils/enums/Env");
		const isProd = $app.stage === Env.PROD;

		const { resolveResources } = await import("@utils/lib/resourceMap");
		const { CorsOrigins } = await import("@utils/enums/CorsOrigins");
		const { HttpMethod } = await import("@utils/enums/HttpMethos");
		const { apiRoutes } = await import("./docProcessor/api/index");
		const { Resource } = await import("@utils/enums/Resource");
		const { Domain } = await import("@utils/enums/Domain");
		const { Email } = await import("@utils/enums/Email");
		const { authLambda } = await import("./auth/index");

		const dbProcessor = new sst.Secret("NEON_DATABASE_URL");

		const emailSender = sst.aws.Email.get("EmailSender", Email.FROM);
		const BucketImgQr = new sst.aws.Bucket("BucketImgQr", {
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

		const resources = {
			[Resource.DB_PROCESSOR]: dbProcessor,
			[Resource.PRE_AUTH]: preAuth,
			[Resource.EMAIL_SENDER]: emailSender,
			[Resource.BUCKET_IMG_QR]: BucketImgQr,
		};

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

		for (const route of apiRoutes) {
			const lambdaProps = resolveResources($app.stage, resources, route.needs);
			api.route(`${route.method} ${route.path}`, route.lambda(lambdaProps));
		}

	},
});
