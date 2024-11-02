import { HydratedDocument, Model, Schema } from "mongoose";
import { Entity } from "@shared-kernel/entity";
import { OnboardingProcessStatus } from "./onboarding-process-status-enum";
import { IOnboardingStep } from "./onboarding-step";

export class OnboardingProcessEntity extends Entity {
  public static readonly collectionName: string = "Onboarding_Process";

  public static readonly schema = new Schema<
    OnboardingProcessEntity,
    OnboardingProcessModel,
    IOnboardingProcessMethods
  >(
    {
      name: { type: String, required: true },

      status: {
        type: String,
        enum: OnboardingProcessStatus,
        default: OnboardingProcessStatus.NOT_STARTED
      },

      isComplete: { type: Boolean, default: false },

      currentStep: { type: Number, default: 0 },

      steps: {
        type: [
          {
            stepName: { type: String, required: true },
            relatedEntity: { type: String, required: true },
            requiredFields: { type: [String] },
            data: {
              type: Schema.Types.Mixed,
              default: function (this: OnboardingProcessEntity) {
                return {};
              }
            },
            isComplete: { type: Boolean, default: false },
            status: {
              type: String,
              enum: OnboardingProcessStatus,
              default: OnboardingProcessStatus.NOT_STARTED
            },
            startDateTime: { type: Date, default: null },
            completeDateTime: { type: Date, default: null }
          }
        ],
        required: true
      },

      startDateTime: {
        type: Date,
        default: null
      },

      completedDateTime: {
        type: Date,
        default: null
      }
    },
    { timestamps: true }
  );

  constructor(
    public name: string,
    public steps: IOnboardingStep[]
  ) {
    super();
  }

  public currentStep: number = 0;
  public status: OnboardingProcessStatus = OnboardingProcessStatus.NOT_STARTED;
  public isComplete: boolean = false;
  public startDateTime: Date | null = null;
  public completedDateTime: Date | null = null;
  public _doc: OnboardingProcessEntity;
}

export type HydratedOnboardingProcessDocument = HydratedDocument<
  OnboardingProcessEntity,
  IOnboardingProcessMethods
>;

export interface IOnboardingProcessMethods {
  completeStep(data: unknown): void;
}

export type OnboardingProcessModel = Model<
  OnboardingProcessEntity,
  object,
  IOnboardingProcessMethods
>;
