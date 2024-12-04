import { inject, Lifecycle, scoped } from "tsyringe";
import { IRequestHandler } from "@infrastructure/mediator";
import { LoanResponseDto } from "../../shared";
import { Result, ResultType } from "@shared-kernel/result";
import { ILoanRepository, LoanExceptions } from "@domain/loan";
import { GetLoanByIdQuery } from "./get-loan-by-id-query";

@scoped(Lifecycle.ResolutionScoped)
export class GetLoanByIdQueryHandler implements IRequestHandler<GetLoanByIdQuery, LoanResponseDto> {
  constructor(@inject("LoanRepository") private readonly _loanRepository: ILoanRepository) {}

  public async handle(query: GetLoanByIdQuery): Promise<ResultType<LoanResponseDto>> {
    const loan = await this._loanRepository.findById(query.tenant._id, query.loanId);
    if (!loan) return Result.failure(LoanExceptions.NotFound);

    return Result.success("Retrieved loans successfully", LoanResponseDto.from(loan));
  }
}
