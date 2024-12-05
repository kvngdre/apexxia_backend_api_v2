import { Router } from "express";
import { container } from "tsyringe";
import { UserController } from "@web/controllers/user-controller";

export const userRouter = Router();
const userController = container.resolve(UserController);

userRouter.get("/", userController.getUsers);
userRouter.get("/me", userController.getAuthenticatedUser);
userRouter.get("/:userId", userController.getUser);
userRouter.post("/", userController.createUser);
userRouter.patch("/:userId", userController.updateUser);
