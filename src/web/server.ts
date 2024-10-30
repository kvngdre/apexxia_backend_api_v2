import "reflect-metadata";
import "express-async-errors";
import "dotenv/config";
import { container } from "tsyringe";
import { registerServices } from "./dependency-injection";
import Webapp from "./webapp";
import { GlobalErrorHandler } from "./infrastructure/global-error-handler";
import { ApplicationDbContext } from "@infrastructure/database/application-db-context";
import { RedisService } from "@infrastructure/services";

async function startup() {
  // Register application services to dependency injection container
  registerServices();

  // Register process listeners
  await container.resolve(GlobalErrorHandler).registerProcessListeners();

  // Initialize Redis connection
  await container.resolve(RedisService).connect();

  await container.resolve(ApplicationDbContext).connect();

  const app = new Webapp({
    port: Number(process.env.PORT)
  });

  app.run();

  return app;
}

export default startup();
