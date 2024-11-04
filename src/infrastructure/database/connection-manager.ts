import { Connection, createConnection } from "mongoose";
import { inject, singleton } from "tsyringe";
import { ILogger } from "@application/abstractions/logging";

@singleton()
export class ConnectionManager {
  private readonly _connections: Map<string, Connection> = new Map();

  constructor(@inject("Logger") private readonly _logger: ILogger) {}

  public getTenantDatabaseConnection(tenantId: string, connectionURI: string): Connection {
    // If a connection exists for the given tenantId, return it
    if (this._connections.has(tenantId)) {
      return this._connections.get(tenantId)!;
    }

    // Otherwise, create a new connection.
    const newConnection = createConnection(connectionURI);

    // Event listeners for logging
    newConnection.on("connected", () =>
      this._logger.logInfo(`Connected to database for tenant ${tenantId}.`)
    );
    newConnection.on("disconnected", () =>
      this._logger.logInfo(`Disconnected from database for tenant ${tenantId}`)
    );
    newConnection.on("error", (error) =>
      this._logger.logInfo(`Database error for tenant ${tenantId}: ${error}`)
    );

    // Cache and return the connection
    this._connections.set(tenantId, newConnection);

    return newConnection;
  }

  // Method to close all connections (optional cleanup)
  public async closeAllDatabaseConnections(): Promise<void> {
    for (const [tenantId, connection] of this._connections) {
      await connection.close();
      this._connections.delete(tenantId);
      this._logger.logInfo(`Closed connection for tenant ${tenantId}`);
    }
  }

  // Optional: Close a specific tenant's connection
  public async closeTenantConnection(tenantId: string): Promise<void> {
    const connection = this._connections.get(tenantId);
    if (connection) {
      await connection.close();
      this._connections.delete(tenantId);
      this._logger.logInfo(`Closed connection for tenant ${tenantId}`);
    }
  }
}
