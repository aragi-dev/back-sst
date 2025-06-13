import Logger from "./logger";

export function LogUseCase(target: unknown, propertyKey: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;
  descriptor.value = async function (...args: unknown[]) {
    Logger.info("🚍 [USECASE] Entering use case:", propertyKey, ...args);
    try {
      const result = await originalMethod.apply(this, args);
      Logger.info("🚍 [USECASE] Return use case:", propertyKey, result);
      return result;
    } catch (error) {
      Logger.error("🚍 [USECASE] Error in use case:", propertyKey, error);
      throw error;
    }
  };
}
