import { container } from "tsyringe";
import { Logger } from "./logging";
import { ILogger } from "@application/abstractions/logging/logger-interface";
import { ApplicationDbContext } from "./database/application-db-context";
import { Mediator } from "./mediator";
// import { NotificationPublisher } from "./publisher";
// import { DeadLetterQueueConsumer } from "./consumer/dead-letter-queue-consumer";
import { IMediator } from "./mediator/mediator-interface";
import { ConnectionManager, CentralDbContext } from "./database";
import { JwtService, RedisService } from "./services";
import {
  AddressRepository,
  CustomerRepository,
  LenderRepository,
  LoanProductRepository,
  SessionRepository,
  TenantRepository,
  UserRepository
} from "./repositories";
import { ITenantRepository } from "@domain/tenant";
import { ILenderRepository } from "@domain/lender";
import { IUserRepository } from "@domain/user";
import { IJwtService } from "@application/abstractions/services";
import { ISessionRepository } from "@domain/session";
import { ILoanProductRepository } from "@domain/loan-product";
import { ICustomerRepository } from "@domain/customer";
import { IAddressRepository } from "@domain/address";

export function registerInfrastructureServices() {
  container.registerSingleton<ILogger>("Logger", Logger);
  container.registerSingleton<ApplicationDbContext>("ApplicationDbContext", ApplicationDbContext);
  container.registerSingleton<CentralDbContext>("CentralDbContext", CentralDbContext);
  container.registerSingleton<ConnectionManager>("ConnectionManager", ConnectionManager);
  container.registerSingleton<RedisService>("RedisService", RedisService);
  container.registerSingleton<IMediator>("Mediator", Mediator);
  container.registerSingleton<IJwtService>("JwtService", JwtService);

  container.register<ITenantRepository>("TenantRepository", TenantRepository);
  container.register<ILenderRepository>("LenderRepository", LenderRepository);
  container.register<IUserRepository>("UserRepository", UserRepository);
  container.register<ISessionRepository>("SessionRepository", SessionRepository);
  container.register<ILoanProductRepository>("LoanProductRepository", LoanProductRepository);
  container.register<ICustomerRepository>("CustomerRepository", CustomerRepository);
  container.register<IAddressRepository>("AddressRepository", AddressRepository);

  // container.registerSingleton("NotificationPublisher", NotificationPublisher);
  // container.registerSingleton("DeadLetterQueueConsumer", DeadLetterQueueConsumer);
}
