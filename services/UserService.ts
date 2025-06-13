import { inject, injectable } from "tsyringe";
import type {
  ICreateResponse,
  ICreateUserDto,
  ILoginResponse,
  ILoginUserDto,
} from "@interfaces/UserDto";
import { messages } from "@utils/messages";
import type { UseCase } from "@utils/adapters/UseCase";
import type { User } from "@core/entities/User";
import type { IUserRepository } from "@core/IRepositories/IUserRepository";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { ExpireTimeEnum } from "@utils/enums/ExpireTimeEnum";
const JWT_SECRET = process.env.JWT_SECRET || "secret";
import { AppDataSource } from "@utils/typeorm";
import { LogUseCase } from "@utils/loggers/useCaseDecorator";
import { authenticator } from "otplib";
import qrcode from "qrcode";
import { sendEmail } from "@services/EmailService";
@injectable()
export class UserService {
  constructor(
    @inject("UserRepository")
    private readonly userRepository: IUserRepository
  ) {}

  @LogUseCase
  async create(data: ICreateUserDto): Promise<UseCase<ICreateResponse>> {
    const dataBase = await AppDataSource.createQueryRunner();

    try {
      await dataBase.connect();
      await dataBase.startTransaction();

      const existingUser = await this.userRepository.findByParams(
        { email: data.email },
        dataBase.manager
      );

      if (existingUser) {
        await dataBase.rollbackTransaction();
        return {
          statusCode: messages.statusCode.CONFLICT,
          message: messages.error.ALREADY_EXISTS,
          data: undefined as unknown as ICreateResponse,
        };
      }

      const mfaSecret = authenticator.generateSecret();
      const otpauth = authenticator.keyuri(data.email, "comberter", mfaSecret);
      const qrCodeDataUrl = await qrcode.toDataURL(otpauth);

      await this.userRepository.create(
        {
          email: data.email,
          mfaSecret,
          role: data.role,
          status: true,
        },
        dataBase.manager
      );

      await dataBase.commitTransaction();

      await sendEmail({
        to: data.email,
        subject: "Configura tu MFA",
        htmlBody: `
        <h1>Tu MFA está listo</h1>
        <p>Escanea este código QR:</p>
        <img src="${qrCodeDataUrl}" />
        <p>O ingresa este código manual: <strong>${otpauth}</strong></p>
        `,
      });

      return {
        statusCode: messages.statusCode.SUCCESS,
        message: messages.success.CREATED,
        data: { email: data.email },
      };
    } catch (error) {
      await dataBase.rollbackTransaction();
      return {
        statusCode: messages.statusCode.INTERNAL_SERVER_ERROR,
        message: messages.error.SERVICE,
        data: undefined as unknown as ICreateResponse,
      };
    } finally {
      await dataBase.release();
    }
  }

  @LogUseCase
  async login(data: ILoginUserDto): Promise<UseCase<ILoginResponse>> {
    const email = "test@gmail.com";
    const user = await this.userRepository.findByParams({
      email: email,
    });
    if (!user || !user.status || user.mfaSecret) {
      return {
        statusCode: messages.statusCode.UNAUTHORIZED,
        message: messages.error.NOT_AVAILABLE,
        data: undefined as unknown as ILoginResponse,
      };
    }

    const isValid = authenticator.check(data.code, user.mfaSecret);

    if (!isValid) {
      return {
        statusCode: messages.statusCode.UNAUTHORIZED,
        message: messages.error.INVALID_PARAMETERS,
        data: undefined as unknown as ILoginResponse,
      };
    }
    const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, {
      expiresIn: ExpireTimeEnum.TWENTY_HOURS,
    });
    return {
      statusCode: messages.statusCode.SUCCESS,
      message: messages.success.SUCCESS,
      data: {
        token,
        user: {
          id: user.id,
          role: user.role,
        },
      },
    };
  }
}
