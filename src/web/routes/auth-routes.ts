import { Router } from "express";
import { container } from "tsyringe";
import { AuthController } from "@web/controllers/auth-controller";
import { ResolveTenantMiddleware } from "@web/middleware";

export const authRouter = Router();

const authController = container.resolve(AuthController);
const resolveTenantMiddleware = container.resolve(ResolveTenantMiddleware).execute;

authRouter.post("/signup", authController.signup);
authRouter.post("/login", resolveTenantMiddleware, authController.login);
authRouter.post(
  "/resend-temporary-password",
  resolveTenantMiddleware,
  authController.resendTempPassword
);
authRouter.post("/reset-password", resolveTenantMiddleware, authController.resetPassword);
