import { Router } from "express";
import { container } from "tsyringe";
import { AuthController } from "@web/controllers/auth-controller";
import { ResolveTenantMiddleware } from "@web/middleware";

export const authRouter = Router();

const authController = container.resolve(AuthController);
const resolveTenantIdMiddleware = container.resolve(ResolveTenantMiddleware).execute;

authRouter.post("/signup", authController.signup);
authRouter.post("/login", authController.login);
authRouter.post(
  "/resend-temporary-password",
  resolveTenantIdMiddleware,
  authController.resendTempPassword
);
