export interface UserLoginLambdaProps {
  stage: string;
  dbSecret: { value: string };
  jwtSecret: { value: string };
}

export const userLoginLambda = ({ stage, dbSecret, jwtSecret }: UserLoginLambdaProps) => ({
  name: `${stage}-user-login`,
  handler: "docProcessor/api/userLogin/handler.handler",
  environment: {
    NEON_DATABASE_URL: dbSecret.value,
    JWT_SECRET: jwtSecret.value,
  },
});
