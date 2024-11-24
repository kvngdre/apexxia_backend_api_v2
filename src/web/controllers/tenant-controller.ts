import { type Request, type Response } from "express";
import { Lifecycle, scoped } from "tsyringe";
import { BaseController } from "./base-controller";
import { GetTenantsQuery } from "@application/features/tenants/queries/get-tenants";
import { DeleteTenantCommand } from "@application/features/tenants/commands/delete-tenant";
import { HttpStatus } from "@web/web-infrastructure";

@scoped(Lifecycle.ResolutionScoped)
export class TenantController extends BaseController {
  public getTenants = async (req: Request, res: Response) => {
    const query = new GetTenantsQuery();

    const result = await this.sender.send(query);

    const { code, payload } = this.buildHttpResponse(result, res);

    res.status(code).json(payload);
  };

  public deleteTenant = async (req: Request<{ tenantId: string }>, res: Response) => {
    const command = new DeleteTenantCommand(req.params.tenantId);

    const result = await this.sender.send(command);

    const { code, payload } = this.buildHttpResponse(result, res, { code: HttpStatus.NO_CONTENT });

    res.status(code).json(payload);
  };
}
