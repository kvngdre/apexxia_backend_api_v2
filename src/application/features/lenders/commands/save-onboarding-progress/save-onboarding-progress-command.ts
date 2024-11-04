import { Tenant } from "@domain/tenant";
import { IRequest } from "@infrastructure/mediator";

export class SaveOnboardingProgressCommand implements IRequest {
  constructor(
    public readonly tenant: Tenant,
    public readonly userId: string,
    public readonly step: number,
    public readonly data: unknown
  ) {}
}
