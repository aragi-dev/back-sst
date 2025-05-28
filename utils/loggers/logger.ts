const Logger = {
  info(message: string, ...args: unknown[]) {
    console.info(`🔵 - [INFO] ${message}`, ...args);
  },

  warn(message: string, ...args: unknown[]) {
    console.warn(`🟠 - [WARN] ${message}`, ...args);
  },

  error(message: string, ...args: unknown[]) {
    console.error(`🔴 - [ERROR] ${message}`, ...args);
  },

  critical(message: string, ...args: unknown[]) {
    console.error(`🟣 - [CRITICAL] ${message}`, ...args);
  },
};

export default Logger;
