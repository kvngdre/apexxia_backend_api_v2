import { IRequest } from "@infrastructure/mediator";
import { Tenant } from "@domain/tenant";
import { User } from "@domain/user";
import { LoanResponseDto } from "@application/features/loans/shared";

export class CreateCustomerLoanCommand implements IRequest<LoanResponseDto> {
  constructor(
    public readonly tenant: Tenant,
    public readonly user: User,
    public readonly customerId: string,
    public readonly loanProductId: string,
    public readonly loanAmount: number,
    public readonly loanTenureInMonths: number
  ) {}
}
