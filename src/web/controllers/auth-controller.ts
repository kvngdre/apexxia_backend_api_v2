import { type Request, type Response } from "express";
import { Lifecycle, scoped } from "tsyringe";
import { BaseController } from "./base-controller";
import { SignupCommand } from "@application/features/auth/commands/signup";
import { ResendTempPasswordCommand } from "@application/features/auth/commands/resend-temp-password";
import { LoginQuery } from "@application/features/auth/queries/login";

@scoped(Lifecycle.ResolutionScoped)
export class AuthController extends BaseController {
  public signup = async (req: Request<object, object, SignupCommand>, res: Response) => {
    const command = new SignupCommand(
      req.body.lenderName,
      req.body.subdomain,
      req.body.firstName,
      req.body.lastName,
      req.body.email
    );

    const result = await this.sender.send(command);

    const { code, payload } = this.buildHttpResponse(result, res);

    res.status(code).json(payload);
  };

  public resendTempPassword = async (
    req: Request<object, object, { email: string }>,
    res: Response
  ) => {
    const command = new ResendTempPasswordCommand(req.tenant!.id, req.body.email);

    const result = await this.sender.send(command);

    const { code, payload } = this.buildHttpResponse(result, res);

    res.status(code).json(payload);
  };

  public login = async (
    req: Request<object, object, { email: string; password: string }>,
    res: Response
  ) => {
    const command = new LoginQuery(req.tenantId!, req.body.email, req.body.password);

    const result = await this.sender.send(command);

    const { code, payload } = this.buildHttpResponse(result, res);

    res.status(code).json(payload);
  };
}
