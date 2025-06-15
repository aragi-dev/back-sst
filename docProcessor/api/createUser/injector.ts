import { container } from "tsyringe";
import { UserRepository } from "@docRepository/UserRepository";
import { UserCreate } from "@docService/UserCreate";
import Logger from "@utils/loggers/logger";
import type { IUserRepository } from "@docInterfaceRepository/IUserRepository";

container.register<IUserRepository>("IUserRepository", {
  useClass: UserRepository,
});

container.register("UserCreate", {
  useClass: UserCreate,
});

container.register("Logger", {
  useValue: Logger,
});
