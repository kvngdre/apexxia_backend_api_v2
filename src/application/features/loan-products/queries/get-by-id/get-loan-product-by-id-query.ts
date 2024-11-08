import { IRequest } from "@infrastructure/mediator";
import { LoanProductResponseDto } from "../../shared";
import { Tenant } from "@domain/tenant";

export class GetLoanProductByIdQuery implements IRequest<LoanProductResponseDto> {
  constructor(
    public readonly tenant: Tenant,
    public readonly loanProductId: string
  ) {}
}
