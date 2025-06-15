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

@injectable()
export class UserService {
  constructor(
    @inject("IUserRepository")
    private readonly userRepository: IUserRepository
  ) { }

  @LogUseCase
  async login(data: LoginUserDTO): Promise<UseCase<LoginResponseDTO>> {
    try {
      const user = await this.userRepository.findByParams(
        { email: data.email }
      );

      if (!user) {
        return {
          statusCode: messages.statusCode.NOT_FOUND,
          message: "User not found",
          data: {} as LoginResponseDTO,
        };
      }

      if (!user.status || user.mfaSecret) {
        return {
          statusCode: messages.statusCode.UNAUTHORIZED,
          message: messages.error.NOT_AVAILABLE,
          data: undefined as unknown as LoginResponseDTO,
        };
      }

      const isValid = authenticator.check(data.code, user.mfaSecret);

      if (!isValid) {
        return {
          statusCode: messages.statusCode.UNAUTHORIZED,
          message: messages.error.INVALID_PARAMETERS,
          data: undefined as unknown as LoginResponseDTO,
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
      throw new Error(String(error));
    }
  }
}
