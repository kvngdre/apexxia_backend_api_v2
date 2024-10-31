import { container, Lifecycle } from "tsyringe";
import {
  ErrorHandlingMiddleware,
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
  container.register<AbstractErrorMiddleware>("ErrorHandlingMiddleware", ErrorHandlingMiddleware, {
    lifecycle: Lifecycle.ResolutionScoped
  });
  container.registerSingleton("GlobalErrorHandler", GlobalErrorHandler);

  container.resolve<ILogger>("Logger").logDebug("Services registration complete...✅");
}
