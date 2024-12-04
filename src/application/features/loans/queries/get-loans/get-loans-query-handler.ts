import { inject, Lifecycle, scoped } from "tsyringe";
import { IRequestHandler } from "@infrastructure/mediator";
import { GetLoansQuery } from "./get-loans-query";
import { LoanResponseDto } from "../../shared";
import { Result, ResultType } from "@shared-kernel/result";
import { ILoanRepository } from "@domain/loan";

@scoped(Lifecycle.ResolutionScoped)
export class GetLoansQueryHandler implements IRequestHandler<GetLoansQuery, LoanResponseDto[]> {
  constructor(@inject("LoanRepository") private readonly _loanRepository: ILoanRepository) {}

  public async handle(query: GetLoansQuery): Promise<ResultType<LoanResponseDto[]>> {
    const loans = await this._loanRepository.find(query.tenant._id);

    return Result.success("Retrieved loans successfully", LoanResponseDto.fromMany(loans));
  }
}
