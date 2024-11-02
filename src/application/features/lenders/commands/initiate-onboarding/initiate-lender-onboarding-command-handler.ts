import { inject, Lifecycle, scoped } from "tsyringe";
import { ILenderRepository, Lender, LenderExceptions, LenderStatus } from "@domain/lender";
import { IRequestHandler } from "@infrastructure/mediator";
import { InitiateLenderOnboardingCommand } from "./initiate-onboarding-command";
import { Result, ResultType } from "@shared-kernel/result";
import {
  IOnboardingRepository,
  OnboardingProcessEntity,
  OnboardingStep
} from "@domain/onboarding-process";
import { User } from "@domain/user";

@scoped(Lifecycle.ResolutionScoped)
export class InitiateLenderOnboardingCommandHandler
  implements IRequestHandler<InitiateLenderOnboardingCommand>
{
  constructor(
    @inject("LenderRepository") private readonly _lenderRepository: ILenderRepository,
    @inject("LenderRepository") // TODO: fix token
    private readonly _onboardingProcessRepository: IOnboardingRepository
  ) {}

  public async handle(command: InitiateLenderOnboardingCommand): Promise<ResultType<unknown>> {
    const lender = await this._lenderRepository.findById(command.tenantId, command.lenderId);
    if (!lender) {
      return Result.failure(LenderExceptions.NotFound);
    }

    // Guard clause against re-initiation of onboarding process
    if (
      lender.status === LenderStatus.ONBOARDING ||
      lender.status === LenderStatus.DOCUMENT_REVIEW
    ) {
      return Result.failure(LenderExceptions.AlreadyOnboarding);
    }

    // Guard clause to ensure only new lender can initiate onboarding
    if (lender.status !== LenderStatus.NEW) {
      return Result.failure(LenderExceptions.AlreadyVerified);
    }

    const process = new OnboardingProcessEntity("New lender onboarding process", [
      new OnboardingStep("update lender info", Lender.collectionName, ["category"]),
      new OnboardingStep("update user info", User.collectionName, ["displayName"])
    ]);

    lender.onboardingProcessId = process._id;
    lender.status = LenderStatus.ONBOARDING;

    await this._onboardingProcessRepository.insert(command.tenantId, process);
    await this._lenderRepository.update(lender);

    return Result.success("Lender onboarding process initiated successfully.");
  }
}
