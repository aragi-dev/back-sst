import { container } from "tsyringe";
import { UserRepository } from "@docRepository/UserRepository";
import Logger from "@utils/loggers/logger";
import type { IUserRepository } from "@docInterfaceRepository/IUserRepository";
import { SendMfaEmail } from "@docService/SendMfaEmail";

container.register<IUserRepository>("IUserRepository", {
  useClass: UserRepository,
});

container.register("SendMfaEmail", {
  useClass: SendMfaEmail,
});

container.register("Logger", {
  useValue: Logger,
});
