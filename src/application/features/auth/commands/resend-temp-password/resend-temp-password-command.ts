import { Tenant } from "@domain/tenant";
import { IRequest } from "@infrastructure/mediator";

export class ResendTempPasswordCommand implements IRequest {
  constructor(
    public readonly tenant: Tenant,
    public readonly email: string
  ) {}
}
