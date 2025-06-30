export interface UserCreateLambdaProps {
  stage: string;
  dbSecret: { value: string };
  email: { value: string };
  qrBucket: { value: string };
}

export const userCreateLambda = ({ stage, dbSecret, email, qrBucket }: UserCreateLambdaProps) => ({
  name: `${stage}-user-create`,
  handler: "docProcessor/api/userCreate/handler.handler",
  link: [email, qrBucket],
  environment: {
    NEON_DATABASE_URL: dbSecret.value,
  },
});
