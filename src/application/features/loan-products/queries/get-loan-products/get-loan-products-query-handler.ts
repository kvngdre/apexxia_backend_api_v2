import { inject, Lifecycle, scoped } from "tsyringe";
import { IRequestHandler } from "@infrastructure/mediator";
import { GetLoanProductsQuery } from "./get-loan-products-query";
import { LoanProductResponseDto } from "../../shared";
import { Result, ResultType } from "@shared-kernel/result";
import { ILoanProductRepository } from "@domain/loan-product";

@scoped(Lifecycle.ResolutionScoped)
export class GetLoanProductsQueryHandler
  implements IRequestHandler<GetLoanProductsQuery, LoanProductResponseDto[]>
{
  constructor(
    @inject("LoanProductRepository") private readonly _loanProductRepository: ILoanProductRepository
  ) {}

  public async handle(query: GetLoanProductsQuery): Promise<ResultType<LoanProductResponseDto[]>> {
    const products = await this._loanProductRepository.find(query.tenant.id);

    return Result.success("Loan products retrieved", LoanProductResponseDto.fromMany(products));
  }
}
