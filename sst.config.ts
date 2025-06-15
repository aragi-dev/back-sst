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
			cors: true,
			transform: {
				route: {
					handler: (args, _opts) => {
						args.memory ??= "2048 MB";
						args.timeout ??= "5 seconds";
					},
				},
			},
		});

		const email = $app.stage === "frank"
			? sst.aws.Email.get("MyEmail", "docprocessor@omatu.dev")
			: sst.aws.Email.get("MyEmail", "docprocessor@omatu.dev");

		api.route("POST /user", {
			name: "createUser",
			handler: "docProcessor/api/createUser/handler.handler",
			link: [email, qrBucket],
			environment: {
				NEON_DATABASE_URL: dbSecret.value,
			},
		});

		api.route("POST /login", {
			name: "loginUser",
			handler: "docProcessor/api/loginUser/handler.handler",
			environment: {
				NEON_DATABASE_URL: dbSecret.value,
			},
		});
	},
});
