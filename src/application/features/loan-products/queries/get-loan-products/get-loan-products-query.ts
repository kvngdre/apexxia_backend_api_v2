import { IRequest } from "@infrastructure/mediator";
import { LoanProductResponseDto } from "../../shared";
import { Tenant } from "@domain/tenant";

export class GetLoanProductsQuery implements IRequest<LoanProductResponseDto[]> {
  constructor(public readonly tenant: Tenant) {}
}
