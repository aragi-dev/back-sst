export interface UserCreateLambdaProps {
  stage: string;
  dbProcessor: { value: string };
  emailSender: { value: string };
  BucketImgQr: { value: string };
}

export const userCreateLambda = ({ stage, dbProcessor, emailSender, BucketImgQr }: UserCreateLambdaProps) => ({
  name: `${stage}-user-create`,
  handler: "docProcessor/api/userCreate/handler.handler",
  link: [emailSender, BucketImgQr],
  environment: {
    NEON_DATABASE_URL: dbProcessor.value,
  },
});
