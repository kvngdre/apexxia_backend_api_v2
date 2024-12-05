import { Tenant } from "@domain/tenant";
import { User } from "@domain/user";
import { IRequest } from "@infrastructure/mediator";

export class UpdateLoanCommand implements IRequest {
  constructor(
    public readonly tenant: Tenant,
    public readonly user: User,
    public readonly loanId: string,
    public readonly loanAmount?: number,
    public readonly loanTenureInMonths?: number
  ) {}
}
