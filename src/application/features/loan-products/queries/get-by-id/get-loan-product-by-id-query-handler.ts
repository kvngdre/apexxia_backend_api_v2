import { inject, Lifecycle, scoped } from "tsyringe";
import { IRequestHandler } from "@infrastructure/mediator";
import { LoanProductResponseDto } from "../../shared";
import { Result, ResultType } from "@shared-kernel/result";
import { ILoanProductRepository, LoanProductExceptions } from "@domain/loan-product";
import { GetLoanProductByIdQuery } from "./get-loan-product-by-id-query";

@scoped(Lifecycle.ResolutionScoped)
export class GetLoanProductByIdQueryHandler
  implements IRequestHandler<GetLoanProductByIdQuery, LoanProductResponseDto>
{
  constructor(
    @inject("LoanProductRepository") private readonly _loanProductRepository: ILoanProductRepository
  ) {}

  public async handle(query: GetLoanProductByIdQuery): Promise<ResultType<LoanProductResponseDto>> {
    const product = await this._loanProductRepository.findById(
      query.tenant._id,
      query.loanProductId
    );

    if (!product) return Result.failure(LoanProductExceptions.NotFound);

    return Result.success("Loan product retrieved", LoanProductResponseDto.from(product));
  }
}
