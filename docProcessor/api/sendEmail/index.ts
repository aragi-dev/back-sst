export interface SendEmailLambdaProps {
  stage: string;
  dbSecret: { value: string };
  email: { value: string };
  qrBucket: { value: string };
}

export const sendEmailLambda = ({ stage, dbSecret, email, qrBucket }: SendEmailLambdaProps) => ({
  name: `${stage}-send-email`,
  handler: "docProcessor/api/sendEmail/handler.handler",
  link: [email, qrBucket],
  environment: {
    NEON_DATABASE_URL: dbSecret.value,
  },
});
