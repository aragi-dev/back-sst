import qrcode from "qrcode";
import { uploadImageToS3 } from "@utils/uploadImagen";
import { authenticator } from "otplib";
import { sendEmail } from "@utils/SendEmail";
import { LogUseCase } from "@utils/loggers/useCaseDecorator";
import { inject, injectable } from "tsyringe";
import type { IUserRepository } from "@docInterfaceRepository/IUserRepository";
import type { SendEmailDTO, SendEmailResponseDTO } from "@docInterface/SendEmailDto";
import { messages } from "@utils/messages";
import type { UseCase } from "@utils/adapters/UseCase";

@injectable()
export class SendMfaEmail {
  constructor(
    @inject("IUserRepository")
    private readonly userRepository: IUserRepository
  ) { }

  @LogUseCase
  async sendMfaEmail(data: SendEmailDTO): Promise<UseCase<SendEmailResponseDTO>> {
    if (!data.mfaSecret || !data.userId) {
      const user = await this.userRepository.findByParams({ email: data.email });
      if (!user) {
        return {
          statusCode: messages.statusCode.NOT_FOUND,
          message: messages.error.NOT_EXISTS,
          data: {} as SendEmailResponseDTO,
        };
      }
      data.mfaSecret = user.mfaSecret;
      data.userId = user.id;
    }
    const otpauth = authenticator.keyuri(data.email, "comberter", data.mfaSecret);
    const secret = this.extractSecret(otpauth);

    const qrCodeBuffer = await qrcode.toBuffer(otpauth, { type: "png" });
    const key = `mfa/${data.userId}/${Date.now()}.png`;
    const qrUrl = await uploadImageToS3(qrCodeBuffer, key);

    const emailBody = `
    <h1>Tu MFA está listo</h1>
    <p>Escanea este código QR:</p>
    <img src="${qrUrl}" />
    <p>O ingresa este código manual: <strong>${secret}</strong></p>
    `;

    const send = await sendEmail({
      to: data.email,
      subject: "Configura tu MFA",
      htmlBody: emailBody,
    });

    return {
      statusCode: messages.statusCode.SUCCESS,
      message: messages.success.SUCCESS,
      data: {
        email: data.email,
        send: send.success,
      }
    }
  }

  private extractSecret(otpauth: string): string | null {
    try {
      const url = new URL(otpauth);
      return url.searchParams.get("secret");
    } catch {
      return null;
    }
  }
}
