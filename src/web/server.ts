import "reflect-metadata";
import "express-async-errors";
import "dotenv/config";
import { container } from "tsyringe";
import { registerServices } from "./dependency-injection";
import WebAPI from "./web-api";
import { GlobalErrorHandler } from "./web-infrastructure/global-error-handler";
import { RedisService } from "@infrastructure/services";
import { CentralDbContext } from "@infrastructure/database/central-db-context";

async function startup() {
  // Register application services to dependency injection container
  registerServices();

  // Register process listeners
  await container.resolve(GlobalErrorHandler).registerProcessListeners();

  // Initialize Redis connection
  await container.resolve(RedisService).connect();

  // Connect to central database
  await container.resolve(CentralDbContext).connect();

  const app = new WebAPI({
    port: Number(process.env.API_PORT)
  });

  app.run();

  return app;
}

export default startup();
