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
						args.timeout ??= "10 seconds";
					},
				},
			},
		});

		 const email = new sst.aws.Email("MyEmail", {
           sender: "tucorreo@gmail.com",
			 dmarc: "v=DMARC1; p=quarantine; adkim=s; aspf=s;"
         });

		api.route("GET /product", {
			name: "getProduct",
			handler: "api/getProduct.handler",
		});

		api.route("POST /product", {
			name: "createProduct",
			handler: "api/createProduct.handler",
		});

		api.route("POST /user", {
			name: "createUser",
			handler: "api/createUser.handler",
			link: [email],
		});

		api.route("POST /login", {
			name: "loginUser",
			handler: "api/loginUser.handler",
		});
	},
});
