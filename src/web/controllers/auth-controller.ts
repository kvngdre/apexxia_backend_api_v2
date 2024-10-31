import { type Request, type Response } from "express";
import { Lifecycle, scoped } from "tsyringe";
import { BaseController } from "./base-controller";
import { SignupCommand } from "@application/features/auth/commands/signup";

@scoped(Lifecycle.ResolutionScoped)
export class AuthController extends BaseController {
  public signup = async (req: Request<object, object, SignupCommand>, res: Response) => {
    const command = new SignupCommand(
      req.body.lenderName,
      req.body.firstName,
      req.body.lastName,
      req.body.email
    );

    const result = await this.sender.send(command);

    const { code, payload } = this.buildHttpResponse(result, res);

    res.status(code).json(payload);
  };
}
