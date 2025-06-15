import { container } from "tsyringe";
import { UserRepository } from "@docRepository/UserRepository";
import { UserLogin } from "@docService/UserLogin";
import Logger from "@utils/loggers/logger";
import type { IUserRepository } from "@docInterfaceRepository/IUserRepository";

container.register<IUserRepository>("IUserRepository", {
  useClass: UserRepository,
});

container.register("UserLogin", {
  useClass: UserLogin,
});

container.register("Logger", {
  useValue: Logger,
});
