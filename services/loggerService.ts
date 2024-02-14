export type LoggerService = {
  log(...args: any[]): void;
  debug(...args: any[]): void;
  info(...args: any[]): void;
  error(...args: any[]): void;
};

export const loggerService: LoggerService = {
    log(...args: any[]): void {
        console.log(...args);
    },

    debug(...args: any[]): void {
        console.debug(...args);
    },

    info(...args: any[]): void {
        console.info(...args);
    },

    error(...args: any[]): void {
        console.error(...args);
    },
};
