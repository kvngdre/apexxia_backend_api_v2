import { OnboardingProcessStatus } from "./onboarding-process-status-enum";
import { OnboardingStep } from "./onboarding-step";

export class OnboardingProcess {
  constructor(
    public steps: OnboardingStep[],
    public status: OnboardingProcessStatus = OnboardingProcessStatus.NOT_STARTED,
    public isComplete: boolean = false,
    public currentStep: number = 0,
    public startDateTime: Date | null = null,
    public completedDateTime: Date | null = null
  ) {}
}
