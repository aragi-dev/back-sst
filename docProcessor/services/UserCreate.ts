import { inject, injectable } from "tsyringe";
import type { CreateResponseDTO, CreateUserDTO } from "@docInterface/UserDto";
import { messages } from "@utils/messages";
import type { UseCase } from "@utils/adapters/UseCase";
import { LogUseCase } from "@utils/loggers/useCaseDecorator";
import { authenticator } from "otplib";
import qrcode from "qrcode";
import { sendEmail } from "@docService/SendEmail";
import type { IUserRepository } from "@docInterfaceRepository/IUserRepository";
import Logger from "@utils/loggers/logger";
import { AppDataSource } from "@dbBase/DocProcessor";
import { uploadQrImage } from "@utils/generateQR";

function extractSecret(otpauth: string): string | null {
  try {
    const url = new URL(otpauth);
    return url.searchParams.get("secret");
  } catch {
    return null;
  }
}

@injectable()
export class UserCreate {
  constructor(
    @inject("IUserRepository")
    private readonly userRepository: IUserRepository
  ) { }

  @LogUseCase
  async create(data: CreateUserDTO): Promise<UseCase<CreateResponseDTO>> {
    const dataBase = await AppDataSource.createQueryRunner();
    await dataBase.connect();
    await dataBase.startTransaction();

    try {
      const existingUserPromise = this.userRepository.findByParams(
        { email: data.email },
        dataBase.manager
      );

      const mfaSecret = authenticator.generateSecret();
      const otpauth = authenticator.keyuri(data.email, "comberter", mfaSecret);
      const secret = extractSecret(otpauth);

      const existingUser = await existingUserPromise;

      if (existingUser) {
        await dataBase.rollbackTransaction();
        return {
          statusCode: messages.statusCode.CONFLICT,
          message: messages.error.ALREADY_EXISTS,
          data: {} as CreateResponseDTO,
        };
      }

      const user = await this.userRepository.create(
        {
          email: data.email,
          mfaSecret,
          role: data.role,
          status: true,
        },
        dataBase.manager
      );
      await dataBase.commitTransaction();

      const qrCodeBuffer = await qrcode.toBuffer(otpauth, { type: 'png' });
      const key = `mfa/${user.id}/${Date.now()}.png`;
      const qrUrl = await uploadQrImage(qrCodeBuffer, key);

      await sendEmail({
        to: data.email,
        subject: "Configura tu MFA",
        htmlBody: `
          <h1>Tu MFA está listo</h1>
          <p>Escanea este código QR:</p>
          <img src="${qrUrl}" />
          <p>O ingresa este código manual: <strong>${secret ?? "Código no disponible"}</strong></p>
        `,
      });

      return {
        statusCode: messages.statusCode.SUCCESS,
        message: messages.success.CREATED,
        data: { email: data.email, send: true },
      };
    } catch (error) {
      await dataBase.rollbackTransaction();
      Logger.error(messages.error.SERVICE, error);
      return {
        statusCode: messages.statusCode.INTERNAL_SERVER_ERROR,
        message: messages.error.SERVICE,
        data: error as CreateResponseDTO,
      };
    } finally {
      await dataBase.release();
    }
  }
}
