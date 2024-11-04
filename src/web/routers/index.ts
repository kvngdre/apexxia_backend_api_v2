import { Router } from "express";
import { systemRouter } from "./system-router";
import { authRouter } from "./auth-router";
import { lenderRouter } from "./lender-router";

const apiRouter = Router();

apiRouter.use("/auth", authRouter);
apiRouter.use("/lenders", lenderRouter);
apiRouter.use("/system", systemRouter);

export default apiRouter;
