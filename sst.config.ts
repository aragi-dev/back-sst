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

		const { CorsOrigins } = await import("@utils/enums/CorsOrigins");
		const { Domain } = await import("@utils/enums/Domain");
		const { Email } = await import("@utils/enums/Email");
		const { Env } = await import("@utils/enums/Env");
		const { HttpMethod } = await import("@utils/enums/HttpMethos");
		const isProd = $app.stage === Env.PROD;
		const dbSecret = new sst.Secret("NEON_DATABASE_URL");

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

		const email = sst.aws.Email.get("MyEmail", Email.FROM);

		api.route("POST /user", {
			name: `${$app.stage}-user-create`,
			handler: "docProcessor/api/userCreate/handler.handler",
			link: [email, qrBucket],
			environment: {
				NEON_DATABASE_URL: dbSecret.value,
			},
		});

		api.route("POST /email", {
			name: `${$app.stage}-send-email`,
			handler: "docProcessor/api/sendEmail/handler.handler",
			link: [email, qrBucket],
			environment: {
				NEON_DATABASE_URL: dbSecret.value,
			},
		});

		api.route("POST /login", {
			name: `${$app.stage}-user-login`,
			handler: "docProcessor/api/userLogin/handler.handler",
			environment: {
				NEON_DATABASE_URL: dbSecret.value,
			},
		});
	},
});
