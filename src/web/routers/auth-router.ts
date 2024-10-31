import { Router } from "express";
import { container } from "tsyringe";
import { AuthController } from "@web/controllers/auth-controller";

export const authRouter = Router();
const authController = container.resolve(AuthController);

authRouter.post("/signup", authController.signup);
