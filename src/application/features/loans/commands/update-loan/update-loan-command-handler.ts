import { inject, Lifecycle, scoped } from "tsyringe";
import { IRequestHandler } from "@infrastructure/mediator";
import { UpdateLoanCommand } from "./update-loan-command";
import { ILoanRepository, LoanExceptions } from "@domain/loan";
import { Result, ResultType } from "@shared-kernel/result";
import { UpdateLoanCommandValidator } from "./update-loan-command-validator";
import { ILoanProductRepository, LoanProductExceptions } from "@domain/loan-product";
import { Publisher } from "@infrastructure/pubsub/publisher";
import { LoanUpdatedDomainEvent } from "@domain/loan/domain-events";

@scoped(Lifecycle.ResolutionScoped)
export class UpdateLoanCommandHandler
  extends Publisher
  implements IRequestHandler<UpdateLoanCommand>
{
  constructor(
    @inject("LoanRepository") private readonly _loanRepository: ILoanRepository,
    @inject("LoanProductRepository")
    private readonly _loanProductRepository: ILoanProductRepository,
    private readonly _validator: UpdateLoanCommandValidator
  ) {
    super();
  }

  public async handle(command: UpdateLoanCommand): Promise<ResultType<unknown>> {
    const { isFailure, exception, value } = this._validator.validate(command);
    if (isFailure) return Result.failure(exception);

    const loan = await this._loanRepository.findById(value.tenant._id, value.loanId);
    if (!loan) return Result.failure(LoanExceptions.NotFound);

    // Fetch the loan product
    const loanProduct = await this._loanProductRepository.findById(
      value.tenant._id,
      loan.loanProductId
    );
    if (!loanProduct) return Result.failure(LoanProductExceptions.NotFound);

    // TODO: validate the loan against loan product rules...

    const changes = {
      amountRequested: value.loanAmount,
      amountRecommended: value.loanAmount,
      tenureInMonthsRequested: value.loanTenureInMonths,
      tenureInMonthsRecommended: value.loanTenureInMonths
    };

    await this._loanRepository.update(loan, changes);

    this.raiseDomainEvent(
      new LoanUpdatedDomainEvent(
        value.tenant,
        value.user._id,
        { ...loan._doc },
        { ...loan._doc, ...changes }
      )
    );

    return Result.success("Loan document updated");
  }
}
