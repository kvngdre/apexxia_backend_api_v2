import { IRequest } from "@infrastructure/mediator";
import { LoanResponseDto } from "../../shared";
import { Tenant } from "@domain/tenant";
import { User } from "@domain/user";

export class CreateLoanCommand implements IRequest<LoanResponseDto> {
  constructor(
    public readonly tenant: Tenant,
    public readonly user: User,
    public readonly customerId: string,
    public readonly loanProductId: string,
    public readonly loanAmount: number,
    public readonly loanTenureInMonths: number
  ) {}
}
