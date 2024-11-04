import { type Request, type Response } from "express";
import { Lifecycle, scoped } from "tsyringe";
import { BaseController } from "./base-controller";
import { SaveOnboardingProgressCommand } from "@application/features/lenders/commands/save-onboarding-progress/save-onboarding-progress-command";

@scoped(Lifecycle.ResolutionScoped)
export class LenderController extends BaseController {
  public saveOnboardingProgress = async (req: Request, res: Response) => {
    const command = new SaveOnboardingProgressCommand(
      req.tenant!,
      req.authenticatedUser!.id,
      req.body.step,
      req.body.data
    );

    const result = await this.sender.send(command);

    const { code, payload } = this.buildHttpResponse(result, res);

    res.status(code).json(payload);
  };

  public getLender = async (req: Request<{ lenderId: string }>, res: Response) => {
    const command = new SaveOnboardingProgressCommand(
      req.tenant!,
      req.authenticatedUser!.id,
      req.body.step,
      req.body.data
    );

    const result = await this.sender.send(command);

    const { code, payload } = this.buildHttpResponse(result, res);

    res.status(code).json(payload);
  };
}
