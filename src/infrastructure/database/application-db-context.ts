import mongoose from "mongoose";
import { inject, singleton } from "tsyringe";
import { Entity } from "@shared-kernel/entity";
import { ILogger } from "@application/abstractions/logging/logger-interface";
import { ConnectionManager } from "./connection-manager";

@singleton()
export class ApplicationDbContext {
  private readonly _entities: (typeof Entity)[] = [] as unknown as (typeof Entity)[];
  private _connection: typeof mongoose;

  constructor(
    @inject("Logger") private readonly _logger: ILogger,
    private readonly _connectionManager: ConnectionManager
  ) {}

  private synchronize(connection: mongoose.Connection) {
    for (const entity of this._entities) {
      connection.model(entity.collectionName, entity.schema);
    }
  }

  public async connect() {
    try {
      if (this._connection === undefined) {
        this._connection = await mongoose.connect(process.env.DB_URI!);
        // this.synchronize(this._connection);
      }

      this._logger.logInfo("Database connected.");
    } catch (error: unknown) {
      if (error instanceof Error)
        this._logger.logError(`Failed to connect to database. Reason -> ${error.message}`, error.stack);

      process.exit(1);
    }
  }

  // Get tenant-specific database connection and synchronize entities.
  public async getTenantDBConnection(tenantId: string): Promise<mongoose.Connection> {
    const connectionURI = process.env.DB_URI!.replace("<tenant>", tenantId);
    const connection = this._connectionManager.getTenantDatabaseConnection(tenantId, connectionURI);
    this.synchronize(connection);

    return connection;
  }

  public async startSession(tenantId: string) {
    const connection = await this.getTenantDBConnection(tenantId);
    return connection.startSession();
  }
}
