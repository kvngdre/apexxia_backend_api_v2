import { IRequestHandler } from "@infrastructure/mediator";
import { SaveOnboardingProgressCommand } from "./save-onboarding-progress-command";
import { Result, ResultType } from "@shared-kernel/result";

export class SaveOnboardingProcessCommandHandler
  implements IRequestHandler<SaveOnboardingProgressCommand>
{
  public async handle(command: SaveOnboardingProgressCommand): Promise<ResultType<unknown>> {
    return Result.success("Onboarding progress saved");
  }
}
