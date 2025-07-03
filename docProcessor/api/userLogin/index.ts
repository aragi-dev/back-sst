export interface UserLoginLambdaProps {
  stage: string;
  dbProcessor: { value: string };
}

export const userLoginLambda = ({ stage, dbProcessor }: UserLoginLambdaProps) => ({
  name: `${stage}-user-login`,
  handler: "docProcessor/api/userLogin/handler.handler",
  environment: {
    NEON_DATABASE_URL: dbProcessor.value,
  },
});
