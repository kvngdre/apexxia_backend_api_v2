import { type Request, type Response } from "express";
import { Lifecycle, scoped } from "tsyringe";
import { BaseController } from "./base-controller";
// import { SaveOnboardingProgressCommand } from "@application/features/lenders/commands/save-onboarding-progress/save-onboarding-progress-command";
import { GetAuthenticatedUserQuery } from "@application/features/users/queries/get-authenticated-user";

@scoped(Lifecycle.ResolutionScoped)
export class UserController extends BaseController {
  public getAuthenticatedUser = async (req: Request, res: Response) => {
    const command = new GetAuthenticatedUserQuery(req.tenant!, req.authenticatedUser!);

    const result = await this.sender.send(command);

    const { code, payload } = this.buildHttpResponse(result, res);

    res.status(code).json(payload);
  };

  // public getUser = async (req: Request<{ userId: string }>, res: Response) => {
  //   const command = new SaveOnboardingProgressCommand(
  //     req.tenant!,
  //     req.authenticatedUser!.id,
  //     req.params.userId
  //   );

  //   const result = await this.sender.send(command);

  //   const { code, payload } = this.buildHttpResponse(result, res);

  //   res.status(code).json(payload);
  // };
}
