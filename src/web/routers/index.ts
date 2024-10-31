import { Router } from "express";
import { systemRouter } from "./system-router";
import { authRouter } from "./auth-router";

const apiRouter = Router();

apiRouter.use("/auth", authRouter);
apiRouter.use("/system", systemRouter);

export default apiRouter;
