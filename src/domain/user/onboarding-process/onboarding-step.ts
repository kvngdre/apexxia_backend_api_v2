import { OnboardingProcessStatus } from "./onboarding-process-status-enum";
export class OnboardingStep {
  constructor(
    public readonly relatedEntity: string,
    public readonly requiredFields: string[],
    public readonly isComplete: boolean = false,
    public readonly status: OnboardingProcessStatus = OnboardingProcessStatus.NOT_STARTED,
    public readonly startDateTime: Date | null = null,
    public readonly completeDateTime: Date | null = null
  ) {}

  public readonly data: unknown = {};
  public readonly stepNumber: number;
}
