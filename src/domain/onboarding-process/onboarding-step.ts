import { OnboardingProcessStatus } from "./onboarding-process-status-enum";

export interface IOnboardingStep {
  stepName: string;
  relatedEntity: string;
  requiredFields: string[];
  data: unknown;
  isComplete: boolean;
  status: OnboardingProcessStatus;
  startDateTime: Date | null;
  completeDateTime: Date | null;
}

// Memento
export class OnboardingStep implements IOnboardingStep {
  constructor(
    public readonly stepName: string,
    public readonly relatedEntity: string,
    public readonly requiredFields: string[],
    public readonly isComplete: boolean = false,
    public readonly status: OnboardingProcessStatus = OnboardingProcessStatus.NOT_STARTED,
    public readonly startDateTime: Date | null = null,
    public readonly completeDateTime: Date | null = null
  ) {}

  public readonly data: unknown = {};
}
