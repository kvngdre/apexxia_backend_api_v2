import { singleton } from "tsyringe";
import { Logger } from "@infrastructure/logging/logger";
import { RedisService } from "@infrastructure/services";

@singleton()
export class GlobalErrorHandler {
  constructor(
    private readonly _logger: Logger,
    private readonly _redisService: RedisService
  ) {}

  public static isRegistered = false;

  public async registerProcessListeners() {
    process.on("unhandledRejection", (reason) => {
      this._logger.logWarn("===unhandledRejection===");
      throw reason;
    });

    process.on("uncaughtException", async (error) => {
      this._logger.logWarn("===uncaughtException===");
      await this.handle(error);
    });

    process.on("SIGINT", async () => {
      await this._redisService.disconnect();
      this._logger.logInfo("Disconnected from redis");

      process.exit(0);
    });

    GlobalErrorHandler.isRegistered = true;

    this._logger.logDebug("Process listeners registered...✅");
  }

  public async handle(error: Error): Promise<void> {
    // Ensure registration of process listeners
    if (GlobalErrorHandler.isRegistered === false) {
      this.registerProcessListeners();
    }

    // Log error
    this._logger.logError(error.message, error.stack);

    // Run other processes below
    await this._contactAdmin();
  }

  private async _contactAdmin() {
    this._logger.logInfo("sending email...");
  }
}
