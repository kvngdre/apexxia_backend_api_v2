import { ClientSession, Types } from "mongoose";
import {
  HydratedOnboardingProcessDocument,
  OnboardingProcessEntity
} from "./onboarding-process-entity";

export interface IOnboardingRepository {
  findById(
    tenantId: Types.ObjectId | string,
    OnboardingId: Types.ObjectId | string
  ): Promise<HydratedOnboardingProcessDocument | null>;
  findByLenderId(
    tenantId: Types.ObjectId | string,
    lenderId: Types.ObjectId | string
  ): Promise<HydratedOnboardingProcessDocument | null>;
  find(tenantId: Types.ObjectId | string): Promise<HydratedOnboardingProcessDocument[]>;
  insert(
    tenantId: Types.ObjectId | string,
    Onboarding: OnboardingProcessEntity,
    options?: { session: ClientSession }
  ): Promise<HydratedOnboardingProcessDocument>;
  update(
    Onboarding: HydratedOnboardingProcessDocument,
    changes?: Partial<OnboardingProcessEntity>,
    options?: { session: ClientSession }
  ): Promise<HydratedOnboardingProcessDocument>;
  delete(Onboarding: HydratedOnboardingProcessDocument): Promise<void>;
}
