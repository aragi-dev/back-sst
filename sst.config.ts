/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
	app(input) {
		return {
			name: "back-sst",
			removal: input?.stage === "production" ? "retain" : "remove",
			protect: ["production"].includes(input?.stage),
			home: "aws",
		};
	},
	async run() {
		const dbSecret = new sst.Secret("NEON_DATABASE_URL");
		const corsOriginSecret = new sst.Secret("CORS_ORIGIN");

		const qrBucket = new sst.aws.Bucket("QrBucket", {
			cors: {
				allowOrigins: ["*"],
				allowMethods: ["GET"],
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

		const api = new sst.aws.ApiGatewayV2("MyApi", {
			cors: {
				allowOrigins: [corsOriginSecret.value],
				allowMethods: ["POST"],
			},
			domain: process.env.SST_STAGE === "production"
				? {
					name: "api.omatu.dev",
					dns: sst.aws.dns({
						zone: "Z057933120QKWKTXK2HIO"
					})
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

		const email = sst.aws.Email.get("MyEmail", "docprocessor@omatu.dev");

		api.route("POST /user", {
			name: "userCreate",
			handler: "docProcessor/api/userCreate/handler.handler",
			link: [email, qrBucket],
			environment: {
				NEON_DATABASE_URL: dbSecret.value,
			},
		});

		api.route("POST /email", {
			name: "sendEmail",
			handler: "docProcessor/api/sendEmail/handler.handler",
			link: [email, qrBucket],
			environment: {
				NEON_DATABASE_URL: dbSecret.value,
			},
		});

		api.route("POST /login", {
			name: "userLogin",
			handler: "docProcessor/api/userLogin/handler.handler",
			environment: {
				NEON_DATABASE_URL: dbSecret.value,
			},
		});
	},
});
