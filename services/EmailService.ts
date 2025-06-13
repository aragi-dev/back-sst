import { SESv2Client, SendEmailCommand } from "@aws-sdk/client-sesv2";
import { Resource } from "sst";

const ses = new SESv2Client();

export async function sendEmail({
  to,
  subject,
  htmlBody,
  textBody,
}: {
  to: string;
  subject: string;
  htmlBody?: string;
  textBody?: string;
}) {
  if (!htmlBody && !textBody) {
    throw new Error("Debes enviar htmlBody o textBody");
  }

  await ses.send(
    new SendEmailCommand({
      FromEmailAddress: Resource.MyEmail.sender,
      Destination: { ToAddresses: [to] },
      Content: {
        Simple: {
          Subject: { Data: subject },
          Body: {
            Html: htmlBody ? { Data: htmlBody } : undefined,
            Text: textBody ? { Data: textBody } : undefined,
          },
        },
      },
    })
  );
}
