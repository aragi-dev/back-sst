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
		// const vpc = new sst.aws.Vpc("MyVpc");
		// const bucket = new sst.aws.Bucket("MyBucket");
		// const cluster = new sst.aws.Cluster("MyCluster", { vpc });

		// new sst.aws.Service("MyService", {
		// 	cluster,
		// 	loadBalancer: {
		// 		ports: [{ listen: "80/http", forward: "3000/http" }],
		// 	},
		// 	dev: {
		// 		command: "bun dev",
		// 	},
		// 	link: [bucket],
		// });

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
			memory: "1024 MB",
		});
		api.route("POST /product", {
			name: "createProduct",
			handler: "api/createProduct.handler",
			timeout: "10 seconds",
			memory: "1024 MB",
		});
	},
});
