import { Router } from "express";
import { container } from "tsyringe";
import { SessionController } from "@web/controllers/session-controller";

export const sessionRouter = Router();
const sessionController = container.resolve(SessionController);

sessionRouter.get("/", sessionController.getSessions);
