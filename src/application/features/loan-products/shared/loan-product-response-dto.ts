import { ResponseDtoType } from "@application/shared/response-dto-type";
import { Fee, LoanProduct } from "@domain/loan-product";

export class LoanProductResponseDto {
  constructor(
    public readonly loanProductId: string,
    public readonly lenderId: string,
    public readonly name: string,
    public readonly isActive: boolean,
    public readonly minLoanAmount: number,
    public readonly maxLoanAmount: number,
    public readonly minTenureInMonths: number,
    public readonly maxTenureInMonths: number,
    public readonly upfrontFee: number,
    public readonly maxDTIInPercentage: number,
    public readonly interestRateInPercentage: number,
    public readonly minIncome: number,
    public readonly maxIncome: number,
    public readonly minAge: number,
    public readonly maxAge: number,
    public readonly fees: Fee[],
    public readonly createdAt: Date
  ) {}

  public static from<T extends LoanProduct | null>(
    loanProduct?: T
  ): ResponseDtoType<T, LoanProductResponseDto> {
    return (
      !loanProduct
        ? null
        : new LoanProductResponseDto(
            loanProduct._id.toString(),
            loanProduct.lenderId.toString(),
            loanProduct.name,
            loanProduct.isActive,
            loanProduct.minLoanAmount,
            loanProduct.maxLoanAmount,
            loanProduct.minTenureInMonths,
            loanProduct.maxTenureInMonths,
            loanProduct.upfrontFee,
            loanProduct.maxDTIInPercentage,
            loanProduct.interestRateInPercentage,
            loanProduct.minIncome,
            loanProduct.maxIncome,
            loanProduct.minAge,
            loanProduct.maxAge,
            loanProduct.fees,
            loanProduct.createdAt
          )
    ) as ResponseDtoType<T, LoanProductResponseDto>;
  }

  public static fromMany(loanProducts: LoanProduct[]) {
    return loanProducts.map((lp) => LoanProductResponseDto.from(lp));
  }
}
