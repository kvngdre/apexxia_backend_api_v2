import { IOnboardingStep } from "@domain/onboarding-process";
import { IRequest } from "@infrastructure/mediator";

export class SaveOnboardingProgressCommand implements IRequest {
  constructor(
    public readonly tenantId: string,
    public readonly lenderId: string,
    public readonly onboardingSteps: IOnboardingStep[]
  ) {}
}
