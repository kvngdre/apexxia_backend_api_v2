import { Router } from "express";
import { container } from "tsyringe";
import { TenantController } from "@web/controllers/tenant-controller";

export const tenantRouter = Router();
const tenantController = container.resolve(TenantController);

tenantRouter.get("/", tenantController.getTenants);
tenantRouter.delete("/:tenantId", tenantController.deleteTenant);
