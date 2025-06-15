import Logger from "./logger";

export function LogRepository(target: unknown, propertyKey: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;
  descriptor.value = async function (...args: unknown[]) {
    const filteredArgs = args.map(arg => {
      if (arg && typeof arg === "object" && "queryRunner" in arg) {
        return "[EntityManager]";
      }
      return arg;
    });

    Logger.info(`🚍 [REPO] Entering: ${propertyKey}`, ...filteredArgs);
    try {
      const result = await originalMethod.apply(this, args);
      Logger.info(`🚍 [REPO] Return: ${propertyKey}`, result);
      return result;
    } catch (error) {
      Logger.error(`🚍 [REPO] Error in: ${propertyKey}`, error);
      throw error;
    }
  };
}
