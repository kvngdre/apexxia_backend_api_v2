import { createClient, RedisClientType } from "redis";
import { inject, singleton } from "tsyringe";
import { IRedisService } from "@application/abstractions/services";
import { ILogger } from "@application/abstractions/logging";

@singleton()
export class RedisService implements IRedisService {
  private readonly _client: RedisClientType;

  constructor(@inject("Logger") private readonly _logger: ILogger) {
    const redisHost = process.env.REDIS_HOST;
    const redisPort = process.env.REDIS_PORT;
    const redisPassword = process.env.REDIS_PASSWORD;

    this._client = createClient({
      url: `redis://${redisHost}:${redisPort}`,
      password: redisPassword
    });

    this._client.on("connect", () => this._logger.logInfo("Connected to Redis"));
    this._client.on("error", (error) => this._logger.logInfo(`Redis connection error: ${error}`));
  }

  // Connect to Redis server
  public async connect() {
    if (!this._client.isOpen) {
      await this._client.connect();
    }
  }

  // Get value by key
  public async get(key: string): Promise<string | null> {
    return this._client.get(key);
  }

  // Set value with optional expiration time (in seconds)
  public async set(key: string, value: string, expiresInSec?: number): Promise<void> {
    if (expiresInSec) {
      await this._client.setEx(key, expiresInSec, value);
    } else {
      await this._client.set(key, value);
    }
  }

  // Delete key
  public async delete(key: string): Promise<void> {
    await this._client.del(key);
  }

  // Disconnect from Redis
  public async disconnect(): Promise<void> {
    await this._client.disconnect();
  }
}
