import { IRequest } from "@infrastructure/mediator";
import { LoanProductResponseDto } from "../../shared";
import { Tenant } from "@domain/tenant";
import { Fee } from "@domain/loan-product";

export class CreateLoanProductCommand implements IRequest<LoanProductResponseDto> {
  constructor(
    public readonly tenant: Tenant,
    public readonly lenderId: string,
    public readonly name: string,
    public readonly minLoanAmount: number,
    public readonly maxLoanAmount: number,
    public readonly interestRateInPercentage: number,
    public readonly isActive?: boolean,
    public readonly upfrontFee?: number,
    public readonly maxDTIInPercentage?: number,
    public readonly minTenureInMonths?: number,
    public readonly maxTenureInMonths?: number,
    public readonly minIncome?: number,
    public readonly maxIncome?: number,
    public readonly minAge?: number,
    public readonly maxAge?: number,
    public readonly fees?: Fee[]
  ) {}
}
