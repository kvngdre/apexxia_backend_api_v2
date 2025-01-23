import { Router } from "express";
import { container } from "tsyringe";
import { systemRouter } from "./system-routes";
import { authRouter } from "./auth-routes";
import { lenderRouter } from "./lender-routes";
import { userRouter } from "./user-routes";
import { AuthenticateUserMiddleware, ResolveTenantMiddleware } from "@web/middleware";
import { sessionRouter } from "./session-routes";
import { loanProductRouter } from "./loan-product-routes";
import { tenantRouter } from "./tenant-routes";
import { customerRouter } from "./customer-routes";
import { loanRouter } from "./loan-routes";

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
apiRouter.use("/sessions", authenticateUserMiddleware, sessionRouter);
apiRouter.use("/system", systemRouter);
apiRouter.use("/tenants", tenantRouter);
apiRouter.use("/users", authenticateUserMiddleware, userRouter);

export default apiRouter;
