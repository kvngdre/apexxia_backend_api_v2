import { IRequest } from "@infrastructure/mediator";

export class ResendTempPasswordCommand implements IRequest {
  constructor(
    public readonly tenantId: string,
    public readonly email: string
  ) {}
}
