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
import { ConnectionManager } from "./database/connection-manager";
import { RedisService } from "./services";

export function registerInfrastructureServices() {
  container.registerSingleton<ILogger>("Logger", Logger);
  container.registerSingleton<ApplicationDbContext>("ApplicationDbContext", ApplicationDbContext);
  container.registerSingleton<ConnectionManager>("ConnectionManager", ConnectionManager);
  container.registerSingleton<RedisService>("RedisService", RedisService);
  container.registerSingleton<IMediator>("Mediator", Mediator);
  container.registerSingleton<IDateTimeProvider>("DateTimeProvider", DateTimeProvider);

  // container.registerSingleton("NotificationPublisher", NotificationPublisher);
  // container.registerSingleton("DeadLetterQueueConsumer", DeadLetterQueueConsumer);
}
