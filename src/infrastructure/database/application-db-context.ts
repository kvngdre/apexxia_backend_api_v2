import mongoose from "mongoose";
import { singleton } from "tsyringe";
import { Entity } from "@shared-kernel/entity";
import { ConnectionManager } from "./connection-manager";
import { CentralDbContext } from "./central-db-context";
import { Lender, LenderModel } from "@domain/lenders";
import { User, UserModel } from "@domain/users";
import { Address, AddressModel } from "@domain/addresses";

@singleton()
export class ApplicationDbContext {
  private readonly _entities: (typeof Entity)[] = [
    Lender,
    Address,
    User
  ] as unknown as (typeof Entity)[];

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

    const connectionURI = tenant!.databaseConnectionURI
      .replace("<user>", process.env.DB_USER)
      .replace("<password>", process.env.DB_PASSWORD);
    // const connectionURI = tenant!.databaseConnectionURI;

    const connection = this._connectionManager.getTenantDatabaseConnection(tenantId, connectionURI);
    this.synchronize(connection);

    return connection;
  }

  public async startTransactionSession(tenantId: string) {
    const connection = await this.getTenantDBConnection(tenantId);
    return connection.startSession();
  }

  public async addresses(tenantId: string) {
    const connection = await this.getTenantDBConnection(tenantId);
    return connection.model<Address, AddressModel>(Address.collectionName, Address.schema);
  }

  public async lenders(tenantId: string) {
    const connection = await this.getTenantDBConnection(tenantId);
    return connection.model<Lender, LenderModel>(Lender.collectionName, Lender.schema);
  }

  public async users(tenantId: string) {
    const connection = await this.getTenantDBConnection(tenantId);
    return connection.model<User, UserModel>(User.collectionName, User.schema);
  }
}
