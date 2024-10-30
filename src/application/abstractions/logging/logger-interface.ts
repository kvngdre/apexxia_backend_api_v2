export interface ILogger {
  logError(message: string, metadata?: unknown): void;
  logWarn(message: string, metadata?: unknown): void;
  logInfo(message: string, metadata?: unknown): void;
  logHttp(message: string, metadata?: unknown): void;
  logDebug(message: string, metadata?: unknown): void;
}
