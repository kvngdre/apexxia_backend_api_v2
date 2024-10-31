import mongoose from "mongoose";
import { singleton } from "tsyringe";
import { Entity } from "@shared-kernel/entity";
import { RedisService } from "@infrastructure/services";
import { Logger } from "@infrastructure/logging/logger";
import { Tenant, TenantModel } from "@domain/tenants";

@singleton()
export class CentralDbContext {
  private readonly _entities: (typeof Entity)[] = [Tenant] as unknown as (typeof Entity)[];
  private _connection: mongoose.Connection;

  constructor(
    private readonly _logger: Logger,
    private readonly _redisService: RedisService
  ) {}

  private synchronize() {
    for (const entity of this._entities) {
      this._connection.model(entity.collectionName, entity.schema);
    }
  }

  public async connect() {
    try {
      if (this._connection === undefined) {
        this._connection = mongoose.createConnection(process.env.CENTRAL_DB_URI!);
        this.synchronize();
      }

      this._logger.logInfo("Connected to central database.");
    } catch (error: unknown) {
      if (error instanceof Error)
        this._logger.logError(
          `Failed to connect to database. Reason -> ${error.message}`,
          error.stack
        );

      process.exit(1);
    }
  }

  public async close() {
    if (this._connection) {
      await this._connection.close();
      this._logger.logInfo("Central database connection closed.");
    }
  }

  public async getTenant(tenantId: string): Promise<Tenant | null> {
    // Check Redis for cached tenant configuration
    const cachedConfig = await this._redisService.get(`tenant:${tenantId}`);
    if (cachedConfig) return JSON.parse(cachedConfig);

    // Fetch from central database if not in cache
    const tenant = await this.tenants.findOne({ tenantId });
    if (tenant) {
      // Cache in Redis
      await this._redisService.set(`tenant:${tenantId}`, JSON.stringify(tenant), 86400);
    }

    return tenant;
  }

  public async startSession() {
    return this._connection.startSession();
  }

  public get tenants() {
    return this._connection.model<Tenant, TenantModel>(Tenant.collectionName, Tenant.schema);
  }
}
