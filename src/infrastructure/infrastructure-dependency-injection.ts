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
import { RedisService } from "./services";
import { LenderRepository, TenantRepository, UserRepository } from "./repositories";
import { ITenantRepository } from "@domain/tenants";
import { ILenderRepository } from "@domain/lenders";
import { IUserRepository } from "@domain/users";

export function registerInfrastructureServices() {
  container.registerSingleton<ILogger>("Logger", Logger);
  container.registerSingleton<ApplicationDbContext>("ApplicationDbContext", ApplicationDbContext);
  container.registerSingleton<CentralDbContext>("CentralDbContext", CentralDbContext);
  container.registerSingleton<ConnectionManager>("ConnectionManager", ConnectionManager);
  container.registerSingleton<RedisService>("RedisService", RedisService);
  container.registerSingleton<IMediator>("Mediator", Mediator);
  container.registerSingleton<IDateTimeProvider>("DateTimeProvider", DateTimeProvider);

  container.register<ITenantRepository>("TenantRepository", TenantRepository);
  container.register<ILenderRepository>("LenderRepository", LenderRepository);
  container.register<IUserRepository>("UserRepository", UserRepository);

  // container.registerSingleton("NotificationPublisher", NotificationPublisher);
  // container.registerSingleton("DeadLetterQueueConsumer", DeadLetterQueueConsumer);
}
