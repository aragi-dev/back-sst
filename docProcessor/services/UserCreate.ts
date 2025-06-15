import { inject, injectable } from "tsyringe";
import type { CreateResponseDTO, CreateUserDTO } from "@docInterface/UserDto";
import { messages } from "@utils/messages";
import type { UseCase } from "@utils/adapters/UseCase";
import { LogUseCase } from "@utils/loggers/useCaseDecorator";
import { authenticator } from "otplib";
import type { IUserRepository } from "@docInterfaceRepository/IUserRepository";
import Logger from "@utils/loggers/logger";
import { AppDataSource } from "@dbBase/DocProcessor";
import type { SendMfaEmail } from "@docService/SendMfaEmail";

@injectable()
export class UserCreate {
  constructor(
    @inject("IUserRepository")
    private readonly userRepository: IUserRepository,
    @inject("SendMfaEmail")
    private readonly sendMfaEmail: SendMfaEmail
  ) { }

  @LogUseCase
  async create(data: CreateUserDTO): Promise<UseCase<CreateResponseDTO>> {
    const dataBase = await AppDataSource.createQueryRunner();
    await dataBase.connect();
    await dataBase.startTransaction();

    try {
      const existingUser = await this.userRepository.findByParams({ email: data.email }, dataBase.manager);

      if (existingUser) {
        await dataBase.rollbackTransaction();
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
        dataBase.manager
      );

      await dataBase.commitTransaction();

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
