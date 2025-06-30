export const authLambda = ({ stage, jwtSecret }: any) => ({
  name: `${stage}-auth`,
  handler: "auth/handler.handler",
  environment: {
    JWT_SECRET: jwtSecret.value,
  },
});
