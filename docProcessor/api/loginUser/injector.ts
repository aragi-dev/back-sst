import { container } from "tsyringe";
import { UserRepository } from "@docRepository/UserRepository";
import { UserService } from "@docService/UserService";
import Logger from "@utils/loggers/logger";

container.register("UserRepository", {
  useClass: UserRepository,
});

container.register("UserService", {
  useClass: UserService,
});

container.register("Logger", {
  useValue: Logger,
});
