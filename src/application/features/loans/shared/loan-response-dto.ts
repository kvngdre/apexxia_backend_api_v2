import { ResponseDtoType } from "@application/shared/response-dto-type";
import { AuditTrail } from "@domain/audit-trail";
import { Loan } from "@domain/loan";

export class LoanResponseDto {
  constructor(
    public readonly loanId: string,
    public readonly customerId: string,
    public readonly lenderId: string,
    public readonly loanProductId: string,
    public readonly parentLoanId: string | null,
    public readonly amountRequested: number,
    public readonly amountRecommended: number,
    public readonly tenureInMonthsRequested: number,
    public readonly tenureInMonthsRecommended: number,
    public readonly status: string,
    public readonly interestRateInPercentage: number,
    public readonly auditTrail: AuditTrail[],
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}

  public static from<T extends Loan | null>(loan?: T): ResponseDtoType<T, LoanResponseDto> {
    return (
      !loan
        ? null
        : new LoanResponseDto(
            loan._id.toString(),
            loan.customerId.toString(),
            loan.lenderId.toString(),
            loan.loanProductId.toString(),
            loan.parentLoanId ? loan.parentLoanId.toString() : null,
            loan.amountRequested,
            loan.amountRecommended,
            loan.tenureInMonthsRequested,
            loan.tenureInMonthsRecommended,
            loan.status,
            loan.interestRateInPercentage,
            loan.auditTrail,
            loan.createdAt,
            loan.updatedAt
          )
    ) as ResponseDtoType<T, LoanResponseDto>;
  }

  public static fromMany(loans: Loan[]) {
    return loans.map((l) => LoanResponseDto.from(l));
  }
}
