import { OnboardingProcessStatus } from "./onboarding-process-status-enum";
import { IOnboardingStep } from "./onboarding-step";

export class OnboardingProcess {
  constructor(
    public readonly status: OnboardingProcessStatus,
    public readonly isComplete: boolean,
    public readonly currentStep: number,
    public readonly steps: IOnboardingStep[],
    public readonly startDateTime: Date | null,
    public readonly completedDateTime: Date | null
  ) {}
}
