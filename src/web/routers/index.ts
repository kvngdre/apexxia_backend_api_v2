import { Router } from "express";
import { container } from "tsyringe";
import { systemRouter } from "./system-router";
import { authRouter } from "./auth-router";
import { lenderRouter } from "./lender-router";
import { userRouter } from "./user.router";
import { AuthenticateUserMiddleware, ResolveTenantMiddleware } from "@web/middleware";
import { sessionRouter } from "./session-router";
import { loanProductRouter } from "./loan-product-router";
import { tenantRouter } from "./tenant-router";
import { customerRouter } from "./customer-router";
import { loanRouter } from "./loan-router";

const apiRouter = Router();
const resolveTenantMiddleware = container.resolve(ResolveTenantMiddleware).execute;
const authenticateUserMiddleware = container.resolve(AuthenticateUserMiddleware).execute;

apiRouter.use("/auth", authRouter);
apiRouter.use("/customers", resolveTenantMiddleware, authenticateUserMiddleware, customerRouter);
apiRouter.use("/lenders", resolveTenantMiddleware, authenticateUserMiddleware, lenderRouter);
apiRouter.use(
  "/loan-products",
  resolveTenantMiddleware,
  authenticateUserMiddleware,
  loanProductRouter
);
apiRouter.use("/loans", resolveTenantMiddleware, authenticateUserMiddleware, loanRouter);
apiRouter.use("/sessions", resolveTenantMiddleware, authenticateUserMiddleware, sessionRouter);
apiRouter.use("/system", systemRouter);
apiRouter.use("/tenants", tenantRouter);
apiRouter.use("/users", resolveTenantMiddleware, authenticateUserMiddleware, userRouter);

export default apiRouter;
