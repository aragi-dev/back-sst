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

		const api = new sst.aws.ApiGatewayV2("MyApi", {
			cors: true,
			transform: {
				route: {
					handler: (args, _opts) => {
						args.memory ??= "2048 MB";
					},
				},
			},
		});
		
		api.route("GET /product", {
			name: "getProduct",
			handler: "api/getProduct.handler",
			timeout: "10 seconds",
		});

		api.route("POST /product", {
			name: "createProduct",
			handler: "api/createProduct.handler",
			timeout: "10 seconds",
		});
		
		api.route("POST /user", {
			name: "createUser",
			handler: "api/createUser.handler",
			timeout: "10 seconds",
		});
	},
});
