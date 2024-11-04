import { Router } from "express";
import { container } from "tsyringe";
import { LenderController } from "@web/controllers/lender-controller";

export const lenderRouter = Router();
const lenderController = container.resolve(LenderController);

lenderRouter.patch("/:lenderId/onboarding/save", lenderController.getLender);
