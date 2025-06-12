import Logger from "./logger";

export function LogRepository(target: unknown, propertyKey: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;
  descriptor.value = async function (...args: unknown[]) {
    Logger.info(`🚍 [REPO] Entering: ${propertyKey}`, ...args);
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
