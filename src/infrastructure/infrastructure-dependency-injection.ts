import { container } from "tsyringe";
import { Logger } from "./logging";
import { ILogger } from "@application/abstractions/logging/logger-interface";
import { ApplicationDbContext } from "./database/application-db-context";
import { Mediator } from "./mediator";
import { IDateTimeProvider } from "@shared-kernel/index.js";
import { DateTimeProvider } from "./time";
// import { NotificationPublisher } from "./publisher";
// import { DeadLetterQueueConsumer } from "./consumer/dead-letter-queue-consumer";
import { IMediator } from "./mediator/mediator-interface";
import { ConnectionManager, CentralDbContext } from "./database";
import { JwtService, RedisService } from "./services";
import {
  LenderRepository,
  SessionRepository,
  TenantRepository,
  UserRepository
} from "./repositories";
import { ITenantRepository } from "@domain/tenant";
import { ILenderRepository } from "@domain/lender";
import { IUserRepository } from "@domain/user";
import { IJwtService } from "@application/abstractions/services";
import { ISessionRepository } from "@domain/session";

export function registerInfrastructureServices() {
  container.registerSingleton<ILogger>("Logger", Logger);
  container.registerSingleton<ApplicationDbContext>("ApplicationDbContext", ApplicationDbContext);
  container.registerSingleton<CentralDbContext>("CentralDbContext", CentralDbContext);
  container.registerSingleton<ConnectionManager>("ConnectionManager", ConnectionManager);
  container.registerSingleton<RedisService>("RedisService", RedisService);
  container.registerSingleton<IMediator>("Mediator", Mediator);
  container.registerSingleton<IDateTimeProvider>("DateTimeProvider", DateTimeProvider);
  container.registerSingleton<IJwtService>("JwtService", JwtService);

  container.register<ITenantRepository>("TenantRepository", TenantRepository);
  container.register<ILenderRepository>("LenderRepository", LenderRepository);
  container.register<IUserRepository>("UserRepository", UserRepository);
  container.register<ISessionRepository>("SessionRepository", SessionRepository);

  // container.registerSingleton("NotificationPublisher", NotificationPublisher);
  // container.registerSingleton("DeadLetterQueueConsumer", DeadLetterQueueConsumer);
}
