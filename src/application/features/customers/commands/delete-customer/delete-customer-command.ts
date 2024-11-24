import { Tenant } from "@domain/tenant";
import { IRequest } from "@infrastructure/mediator";

export class DeleteCustomerCommand implements IRequest {
  constructor(
    public readonly tenant: Tenant,
    public readonly customerId: string
  ) {}
}
