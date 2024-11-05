import { Router } from "express";
import { container } from "tsyringe";
import { UserController } from "@web/controllers/user-controller";

export const userRouter = Router();
const userController = container.resolve(UserController);

userRouter.get("/me", userController.getAuthenticatedUser);
