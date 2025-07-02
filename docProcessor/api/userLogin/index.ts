export interface UserLoginLambdaProps {
  stage: string;
  dbProcessor: { value: string };
  preAuth: { value: string };
}

export const userLoginLambda = ({ stage, dbProcessor, preAuth }: UserLoginLambdaProps) => ({
  name: `${stage}-user-login`,
  handler: "docProcessor/api/userLogin/handler.handler",
  environment: {
    NEON_DATABASE_URL: dbProcessor.value,
    JWT_SECRET: preAuth.value,
  },
});
