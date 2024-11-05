import { type Request, type Response } from "express";
import { Lifecycle, scoped } from "tsyringe";
import { BaseController } from "./base-controller";
import { GetLenderByIdQuery } from "@application/features/lenders/queries/get-lender-by-id";

@scoped(Lifecycle.ResolutionScoped)
export class LenderController extends BaseController {
  public getLenderById = async (req: Request<{ lenderId: string }>, res: Response) => {
    const command = new GetLenderByIdQuery(req.tenant!, req.params.lenderId);

    const result = await this.sender.send(command);

    const { code, payload } = this.buildHttpResponse(result, res);

    res.status(code).json(payload);
  };
}
