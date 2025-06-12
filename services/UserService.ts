import { inject, injectable } from "tsyringe";
import type {
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

@injectable()
export class UserService {
  constructor(
    @inject("UserRepository")
    private readonly userRepository: IUserRepository
  ) {}

  @LogUseCase
  async create(data: ICreateUserDto): Promise<UseCase<User>> {
    const dataBase = await AppDataSource.createQueryRunner();
    try {
      await dataBase.connect();
      await dataBase.startTransaction();

      const existingUser = await this.userRepository.findByParams(
        {
          email: data.email,
          name: data.name,
        },
        dataBase.manager
      );
      if (existingUser) {
        await dataBase.rollbackTransaction();
        return {
          statusCode: messages.statusCode.CONFLICT,
          message: messages.error.ALREADY_EXISTS,
          data: undefined as unknown as User,
        };
      }

      const passwordHash = await bcrypt.hash(data.password, 10);
      const newUser = await this.userRepository.create(
        {
          name: data.name,
          email: data.email,
          password_hash: passwordHash,
          role: data.role,
          status: true,
        },
        dataBase.manager
      );

      await dataBase.commitTransaction();
      return {
        statusCode: messages.statusCode.SUCCESS,
        message: messages.success.CREATED,
        data: newUser,
      };
    } catch (error) {
      await dataBase.rollbackTransaction();
      return {
        statusCode: messages.statusCode.INTERNAL_SERVER_ERROR,
        message: messages.error.SERVICE,
        data: undefined as unknown as User,
      };
    } finally {
      await dataBase.release();
    }
  }

  @LogUseCase
  async login(data: ILoginUserDto): Promise<UseCase<ILoginResponse>> {
    const user = await this.userRepository.findByParams({
      email: data.email,
    });
    if (!user || !user.status) {
      return {
        statusCode: messages.statusCode.UNAUTHORIZED,
        message: messages.error.NOT_AVAILABLE,
        data: undefined as unknown as ILoginResponse,
      };
    }
    const match = await bcrypt.compare(data.password, user.password_hash);

    if (!match) {
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
          name: user.name,
          role: user.role,
        },
      },
    };
  }
}
