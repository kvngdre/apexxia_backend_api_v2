import { IRequest } from "@infrastructure/mediator";
import { LoanResponseDto } from "../../shared";
import { Tenant } from "@domain/tenant";

export class GetLoanByIdQuery implements IRequest<LoanResponseDto> {
  constructor(
    public readonly tenant: Tenant,
    public readonly loanId: string
  ) {}
}
