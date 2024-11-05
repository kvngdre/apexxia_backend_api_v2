import { Router } from "express";
import { container } from "tsyringe";
import { systemRouter } from "./system-router";
import { authRouter } from "./auth-router";
import { lenderRouter } from "./lender-router";
import { userRouter } from "./user.router";
import { AuthenticateUserMiddleware, ResolveTenantMiddleware } from "@web/middleware";

const apiRouter = Router();
const resolveTenantMiddleware = container.resolve(ResolveTenantMiddleware).execute;
const authenticateUserMiddleware = container.resolve(AuthenticateUserMiddleware).execute;

apiRouter.use("/auth", authRouter);
apiRouter.use("/lenders", resolveTenantMiddleware, authenticateUserMiddleware, lenderRouter);
apiRouter.use("/system", systemRouter);
apiRouter.use("/users", resolveTenantMiddleware, authenticateUserMiddleware, userRouter);

export default apiRouter;
