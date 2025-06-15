import { inject, injectable } from "tsyringe";
import type { CreateResponseDTO, CreateUserDTO } from "@docInterface/UserDto";
import { messages } from "@utils/messages";
import type { UseCase } from "@utils/adapters/UseCase";
import { LogUseCase } from "@utils/loggers/useCaseDecorator";
import { authenticator } from "otplib";
import type { IUserRepository } from "@docInterfaceRepository/IUserRepository";
import Logger from "@utils/loggers/logger";
import type { DataSource } from "typeorm";
import type { SendMfaEmail } from "@docService/SendMfaEmail";
import { withTransaction } from "@utils/dbBase/dbUtils";

@injectable()
export class UserCreate {
  constructor(
    @inject("IUserRepository")
    private readonly userRepository: IUserRepository,
    @inject("SendMfaEmail")
    private readonly sendMfaEmail: SendMfaEmail,
    @inject("DataSource")
    private readonly dataSource: DataSource
  ) { }

  @LogUseCase
  async create(data: CreateUserDTO): Promise<UseCase<CreateResponseDTO>> {
    try {
      const response = await withTransaction(this.dataSource, async (manager) => {
        const existingUser = await this.userRepository.findByParams({ email: data.email }, manager);
        if (existingUser) {
          return {
            statusCode: messages.statusCode.CONFLICT,
            message: messages.error.ALREADY_EXISTS,
            data: {} as CreateResponseDTO,
          };
        }

        const mfaSecret = authenticator.generateSecret();
        const user = await this.userRepository.create(
          {
            email: data.email,
            mfaSecret,
            role: data.role,
            status: true,
          },
          manager
        );
        const sendEmail = await this.sendMfaEmail.sendMfaEmail({
          email: data.email,
          mfaSecret,
          userId: user.id,
        });

        return {
          statusCode: messages.statusCode.SUCCESS,
          message: messages.success.CREATED,
          data: { email: data.email, send: sendEmail.data.send },
        };
      });

      return response;
    } catch (error) {
      Logger.error(messages.error.SERVICE, error);
      return {
        statusCode: messages.statusCode.INTERNAL_SERVER_ERROR,
        message: messages.error.SERVICE,
        data: error as CreateResponseDTO,
      };
    }
  }
}
