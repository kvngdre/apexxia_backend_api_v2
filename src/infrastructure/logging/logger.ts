import winston, { transports, createLogger, format, addColors } from "winston";
import { singleton } from "tsyringe";
import "winston-daily-rotate-file";
import { Environment } from "@shared-kernel/environment";
import { ILogger } from "@application/abstractions/logging/logger-interface";

@singleton()
export class Logger implements ILogger {
  private readonly _logger: winston.Logger;
  private readonly _colors: Record<string, string> = {
    error: "red",
    warn: "yellow",
    info: "green",
    http: "blue",
    debug: "magenta"
  };
  private readonly _levels: Record<string, number> = {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    debug: 4
  };

  constructor() {
    const devTransports = [
      new transports.Console({
        format: format.combine(
          format.colorize(),
          format.splat(),
          format.printf(
            ({ level, message, metadata }) =>
              `[${level}]: ${message} ${this.formatMetadata(metadata)}`
          )
        )
      })
    ];

    const prodTransports = [
      new transports.DailyRotateFile({
        filename: "error %DATE%.log",
        dirname: "logs",
        datePattern: "YYYY-MM-DD",
        maxFiles: "30d",
        zippedArchive: true,
        level: "error",
        format: format.combine(
          format.align(),
          format.timestamp({ format: "HH:mm:ss A" }),
          format.printf(
            ({ message, timestamp, metadata }) =>
              `[${timestamp}]: ${message} ${this.formatMetadata(metadata)}`
          )
        )
      }),
      new transports.DailyRotateFile({
        filename: "combined %DATE%.log",
        dirname: "logs",
        datePattern: "YYYY-MM-DD",
        maxFiles: "30d",
        zippedArchive: true,
        level: "http",
        format: format.combine(
          format.align(),
          format.timestamp({ format: "HH:mm:ss A" }),
          format.printf(
            ({ level, message, timestamp, metadata }) =>
              `[${level} ${timestamp}]: ${message} ${this.formatMetadata(metadata)}`
          )
        )
      })
    ];

    this._logger = createLogger({
      transports: Environment.isDevelopment ? devTransports : prodTransports,
      levels: this._levels,
      level: Environment.isDevelopment ? "debug" : "http"
    });

    addColors(this._colors);
  }

  public logError(message: string, metadata: unknown = ""): void {
    this._logger.error(message, { metadata });
  }

  public logWarn(message: string, metadata: unknown = ""): void {
    this._logger.warn(message, { metadata });
  }

  public logInfo(message: string, metadata: unknown = ""): void {
    this._logger.info(message, { metadata });
  }

  public logHttp(message: string, metadata?: unknown): void {
    this._logger.http(message, { metadata });
  }

  public logDebug(message: string, metadata?: unknown): void {
    this._logger.debug(message, { metadata });
  }

  private formatMetadata(metadata: unknown) {
    return !metadata ? "" : `| ${JSON.stringify(metadata, null, 2)}`;
  }
}
