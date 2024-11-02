import { IRequest } from "@infrastructure/mediator";

export class InitiateLenderOnboardingCommand implements IRequest {
  constructor(
    public readonly tenantId: string,
    public readonly lenderId: string
  ) {}
}
