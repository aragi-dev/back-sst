export interface SendEmailLambdaProps {
  stage: string;
  dbProcessor: { value: string };
  emailSender: { value: string };
  BucketImgQr: { value: string };
}

export const sendEmailLambda = ({ stage, dbProcessor, emailSender, BucketImgQr }: SendEmailLambdaProps) => ({
  name: `${stage}-send-email`,
  handler: "docProcessor/api/sendEmail/handler.handler",
  link: [emailSender, BucketImgQr],
  environment: {
    NEON_DATABASE_URL: dbProcessor.value,
  },
});
