import { container } from "tsyringe";
import {
  ErrorHandlingMiddleware,
  ResolveTenantMiddleware,
  RequestLoggingMiddleware,
  ResourceNotFoundMiddleware
} from "./middleware";
import { AbstractErrorMiddleware, AbstractMiddleware } from "./abstractions/types";
import { registerInfrastructureServices } from "@infrastructure/infrastructure-dependency-injection";
import { registerApplicationServices } from "@application/application-dependency-injection";
import { GlobalErrorHandler } from "./web-infrastructure/global-error-handler";
import { ILogger } from "@application/abstractions/logging";

export function registerServices() {
  registerInfrastructureServices();
  registerApplicationServices();

  container.registerSingleton<AbstractMiddleware>(RequestLoggingMiddleware);
  container.registerSingleton<AbstractMiddleware>(ResourceNotFoundMiddleware);
  container.registerSingleton<AbstractMiddleware>(ResolveTenantMiddleware);
  container.registerSingleton<AbstractErrorMiddleware>(ErrorHandlingMiddleware);
  container.registerSingleton(GlobalErrorHandler);

  container.resolve<ILogger>("Logger").logDebug("Services registration complete...✅");
}

registerServices();
