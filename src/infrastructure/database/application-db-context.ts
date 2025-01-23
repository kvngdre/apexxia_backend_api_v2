import mongoose from "mongoose";
import { singleton } from "tsyringe";
import { Entity } from "@shared-kernel/entity";
import { ConnectionManager } from "./connection-manager";
import { CentralDbContext } from "./central-db-context";
import { Lender, LenderModel } from "@domain/lender";
import { User, UserModel } from "@domain/user";
import { Address, AddressModel } from "@domain/address";
import { Session, SessionModel } from "@domain/session";
import { LoanProduct, LoanProductModel } from "@domain/loan-product";
import { Customer, CustomerModel } from "@domain/customer";
import { RedisService } from "@infrastructure/services";
import { Tenant } from "@domain/tenant";
import { Loan, LoanModel } from "@domain/loan";
import { AuditTrail, AuditTrailModel } from "@domain/audit-trail";

@singleton()
export class ApplicationDbContext {
  private readonly _entities: (typeof Entity)[] = [
    Lender,
    Address,
    User,
    Session,
    LoanProduct,
    Customer,
    Loan,
    AuditTrail
  ] as unknown as (typeof Entity)[];

  constructor(
    private readonly _connectionManager: ConnectionManager,
    private readonly _centralDbContext: CentralDbContext,
    private readonly _redisService: RedisService
  ) {}

  private synchronize(connection: mongoose.Connection) {
    for (const entity of this._entities) {
      connection.model(entity.collectionName, entity.schema);
    }
  }

  // Get tenant-specific database connection and synchronize entities.
  public async getTenantDBConnection(lenderId: string): Promise<mongoose.Connection> {
    let tenant: Tenant = JSON.parse((await this._redisService.get(`lender:${lenderId}`))!);

    // if cache miss, make call to DB
    if (!tenant) {
      const foundTenant = await this._centralDbContext.getTenant(lenderId);
      if (!foundTenant) {
        throw new Error(`Failed to locate tenant ${lenderId} configurations`);
      }

      tenant = foundTenant;
    }

    const connectionURI = tenant!.databaseConnectionURI
      .replace("<user>", process.env.DB_USER)
      .replace("<password>", process.env.DB_PASSWORD);

    const connection = this._connectionManager.getTenantDatabaseConnection(lenderId, connectionURI);
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

  public async auditTrails(tenantId: string) {
    const connection = await this.getTenantDBConnection(tenantId);
    return connection.model<AuditTrail, AuditTrailModel>(
      AuditTrail.collectionName,
      AuditTrail.schema
    );
  }

  public async customers(tenantId: string) {
    const connection = await this.getTenantDBConnection(tenantId);
    return connection.model<Customer, CustomerModel>(Customer.collectionName, Customer.schema);
  }

  public async lenders(tenantId: string) {
    const connection = await this.getTenantDBConnection(tenantId);
    return connection.model<Lender, LenderModel>(Lender.collectionName, Lender.schema);
  }

  public async loanProducts(tenantId: string) {
    const connection = await this.getTenantDBConnection(tenantId);
    return connection.model<LoanProduct, LoanProductModel>(
      LoanProduct.collectionName,
      LoanProduct.schema
    );
  }

  public async loans(tenantId: string) {
    const connection = await this.getTenantDBConnection(tenantId);
    return connection.model<Loan, LoanModel>(Loan.collectionName, Loan.schema);
  }

  public async sessions(tenantId: string) {
    const connection = await this.getTenantDBConnection(tenantId);
    return connection.model<Session, SessionModel>(Session.collectionName, Session.schema);
  }

  public async users(tenantId: string) {
    const connection = await this.getTenantDBConnection(tenantId);
    return connection.model<User, UserModel>(User.collectionName, User.schema);
  }
}
