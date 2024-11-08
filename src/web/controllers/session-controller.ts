import { type Request, type Response } from "express";
import { Lifecycle, scoped } from "tsyringe";
import { BaseController } from "./base-controller";
import { GetSessionsQuery } from "@application/features/sessions/queries/get-sessions";

@scoped(Lifecycle.ResolutionScoped)
export class SessionController extends BaseController {
  public getSessions = async (req: Request, res: Response) => {
    const query = new GetSessionsQuery(req.tenant!);

    const result = await this.sender.send(query);

    const { code, payload } = this.buildHttpResponse(result, res);

    res.status(code).json(payload);
  };
}
