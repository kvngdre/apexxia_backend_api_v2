import { Router } from "express";
import { systemRouter } from "./system-router";

const apiRouter = Router();

apiRouter.use("/system", systemRouter);

export default apiRouter;
