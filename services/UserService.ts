import { inject, injectable } from "tsyringe";
import type { createUserDto } from "@interfaces/UserDto";
import { messages } from "@utils/messages";
import type { UseCase } from "@utils/adapters/UseCase";
import type { User } from "@core/entities/User";
import type { IUserRepository } from "@core/IRepositories/IUserRepository";
import crypto from "node:crypto";

@injectable()
export class UserService {
  constructor(
    @inject("UserRepository")
    private readonly userRepository: IUserRepository
  ) { }

  async create(data: createUserDto): Promise<UseCase<User>> {
    const existingUser = await this.userRepository.findByParams({
      email: data.email,
      name: data.name
    });
    if (existingUser) {
      return {
        statusCode: messages.statusCode.CONFLICT,
        message: messages.error.ALREADY_EXISTS,
        data: existingUser
      };
    }

    const passwordHash = crypto.createHash("sha256").update(data.password).digest("hex");
    const newUser = await this.userRepository.create({
      name: data.name,
      email: data.email,
      password_hash: passwordHash,
      role: data.role,
      status: true,
    });
    return {
      statusCode: messages.statusCode.SUCCESS,
      message: messages.success.CREATED,
      data: newUser
    };
  }
}
