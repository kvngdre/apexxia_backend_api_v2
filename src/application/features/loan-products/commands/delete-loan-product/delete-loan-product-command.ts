import { Tenant } from "@domain/tenant";
import { IRequest } from "@infrastructure/mediator";

export class DeleteLoanProductCommand implements IRequest {
  constructor(
    public readonly tenant: Tenant,
    public readonly loanProductId: string
  ) {}
}
