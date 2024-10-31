import mongoose from "mongoose";
import { singleton } from "tsyringe";
import { Entity } from "@shared-kernel/entity";
import { ConnectionManager } from "./connection-manager";
import { CentralDbContext } from "./central-db-context";

@singleton()
export class ApplicationDbContext {
  private readonly _entities: (typeof Entity)[] = [] as unknown as (typeof Entity)[];

  constructor(
    private readonly _connectionManager: ConnectionManager,
    private readonly _centralDbContext: CentralDbContext
  ) {}

  private synchronize(connection: mongoose.Connection) {
    for (const entity of this._entities) {
      connection.model(entity.collectionName, entity.schema);
    }
  }

  // Get tenant-specific database connection and synchronize entities.
  public async getTenantDBConnection(tenantId: string): Promise<mongoose.Connection> {
    const tenant = await this._centralDbContext.getTenant(tenantId);

    if (!tenant) {
      throw new Error(`Failed to locate tenant ${tenantId} configurations`);
    }

    const connectionURI = tenant!.databaseConnectionURI.replace("<tenant>", tenantId);

    const connection = this._connectionManager.getTenantDatabaseConnection(tenantId, connectionURI);
    this.synchronize(connection);

    return connection;
  }

  public async startSession(tenantId: string) {
    const connection = await this.getTenantDBConnection(tenantId);
    return connection.startSession();
  }
}
