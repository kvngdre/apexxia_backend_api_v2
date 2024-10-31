import { Router } from "express";
import { container } from "tsyringe";
import { SystemController } from "@web/controllers";

export const systemRouter = Router();
const systemController = container.resolve(SystemController);

systemRouter.all("/health", systemController.getHealth);
systemRouter.get("/api-doc", systemController.getAPIDoc);
