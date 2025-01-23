import express, { json, urlencoded, type Express } from "express";
import cors from "cors";
import helmet from "helmet";
import { container } from "tsyringe";
import { Environment } from "src/shared-kernel";
import { IWebAppOptions as IWebAPIOptions } from "./abstractions/interfaces";
import {
  ErrorHandlingMiddleware,
  RequestLoggingMiddleware,
  ResourceNotFoundMiddleware
} from "./middleware";
import { Logger } from "@infrastructure/logging/logger";
import apiRouter from "./routes";

export default class WebAPI {
  private readonly _options: IWebAPIOptions;
  private readonly _app: Express = express();
  private readonly _requestLoggingMiddleware = container.resolve(RequestLoggingMiddleware);
  private readonly _resourceNotFoundMiddleware = container.resolve(ResourceNotFoundMiddleware);
  private readonly _errorHandlingMiddleware = container.resolve(ErrorHandlingMiddleware);
  private readonly _logger: Logger = container.resolve(Logger);

  constructor(options: IWebAPIOptions) {
    this._parsePortNumberOrThrow(options.port);

    this._options = options;
    this._setup();
  }

  public getOptions(): IWebAPIOptions {
    return this._options;
  }

  /**
   * Configure the options for the web application instance.
   * @param key The option to be set.
   * @param value The value of the option.
   */
  public setOption<K extends keyof IWebAPIOptions>(key: K, value: IWebAPIOptions[K]): void {
    if (key === "port") {
      this._parsePortNumberOrThrow(value as string | number);
    }

    this._options[key] = value;
  }

  public run(): void {
    const port = this._options.port;

    this._app.listen(port, () => {
      this._logger.logInfo(`Server running on port: [${port}]`);

      if (Environment.isDevelopment) {
        this._logger.logInfo(`http://localhost:${port}/api/v1/system/api-doc`);
      }
    });
  }

  private _setup(): void {
    this._app.use(cors());
    this._app.use(helmet());

    this._app.use(json());
    this._app.use(urlencoded({ extended: true }));

    this._app.use(this._requestLoggingMiddleware.execute);

    this._app.use("/api/v1", apiRouter);
    this._app.use("*", this._resourceNotFoundMiddleware.execute);

    this._app.use(this._errorHandlingMiddleware.execute);
  }

  private _parsePortNumberOrThrow(value: number | string) {
    const result = Number.parseInt(value as string);

    if (result === 0 || isNaN(result)) {
      throw new Error("Server port number is invalid or not set.");
    }
  }
}
