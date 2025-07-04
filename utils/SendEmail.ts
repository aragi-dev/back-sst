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
}): Promise<{ success: boolean; message?: string }> {
  if (!htmlBody && !textBody) {
    throw new Error("Debes enviar htmlBody o textBody");
  }

  try {
    await ses.send(
      new SendEmailCommand({
        FromEmailAddress: Resource.EmailSender.sender,
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
    return { success: true };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return { success: false, message: errorMessage };
  }
}
