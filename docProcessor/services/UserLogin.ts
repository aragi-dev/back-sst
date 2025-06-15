import { inject, injectable } from "tsyringe";
import type {
  LoginResponseDTO,
  LoginUserDTO,
} from "@docInterface/UserDto";
import { messages } from "@utils/messages";
import type { UseCase } from "@utils/adapters/UseCase";
import jwt from "jsonwebtoken";
import { ExpireTimeEnum } from "@utils/enums/ExpireTimeEnum";
const JWT_SECRET = process.env.JWT_SECRET || "secret";
import { LogUseCase } from "@utils/loggers/useCaseDecorator";
import { authenticator } from "otplib";
import type { IUserRepository } from "@docInterfaceRepository/IUserRepository";
import Logger from "@utils/loggers/logger";
import type { DataSource } from "typeorm";

@injectable()
export class UserLogin {
  constructor(
    @inject("IUserRepository")
    private readonly userRepository: IUserRepository,
    @inject("DataSource")
    private readonly dataSource: DataSource
  ) { }

  @LogUseCase
  async login(data: LoginUserDTO): Promise<UseCase<LoginResponseDTO>> {
    try {
      const user = await this.userRepository.findByParams(
        { email: data.email },
        this.dataSource.manager
      );

      if (!user || !user.status || !user.mfaSecret) {
        return {
          statusCode: messages.statusCode.NOT_FOUND,
          message: messages.error.NOT_AVAILABLE,
          data: {} as LoginResponseDTO,
        };
      }


      const isValid = authenticator.check(data.code, user.mfaSecret);

      if (!isValid) {
        return {
          statusCode: messages.statusCode.UNAUTHORIZED,
          message: messages.error.INVALID_PARAMETERS,
          data: {} as LoginResponseDTO,
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
    } catch (error) {
      Logger.error(messages.error.SERVICE, error);
      return {
        statusCode: messages.statusCode.INTERNAL_SERVER_ERROR,
        message: messages.error.SERVICE,
        data: {} as LoginResponseDTO,
      };
    }
  }
}
