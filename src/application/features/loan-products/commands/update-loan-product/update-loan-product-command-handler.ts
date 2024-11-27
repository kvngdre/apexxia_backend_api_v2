import { inject, Lifecycle, scoped } from "tsyringe";
import { IRequestHandler } from "@infrastructure/mediator";
import { UpdateLoanProductCommand } from "./update-loan-product-command";
import { Result, ResultType } from "@shared-kernel/result";
import { ILoanProductRepository, LoanProductExceptions } from "@domain/loan-product";
import { UpdateLoanProductCommandValidator } from "./update-loan-product-command-validator";

@scoped(Lifecycle.ResolutionScoped)
export class UpdateLoanProductCommandHandler implements IRequestHandler<UpdateLoanProductCommand> {
  constructor(
    @inject("LoanProductRepository")
    private readonly _loanProductRepository: ILoanProductRepository,
    private readonly _validator: UpdateLoanProductCommandValidator
  ) {}

  public async handle(command: UpdateLoanProductCommand): Promise<ResultType> {
    const { isFailure, exception, value } = this._validator.validate(command);
    if (isFailure) return Result.failure(exception);

    const product = await this._loanProductRepository.findById(
      value.tenant._id,
      value.loanProductId
    );
    if (!product) return Result.failure(LoanProductExceptions.NotFound);

    if (
      value.name &&
      !(await this._loanProductRepository.isNameUnique(value.tenant._id, value.name))
    ) {
      return Result.failure(LoanProductExceptions.DuplicateName);
    }

    await this._loanProductRepository.update(product, value);

    return Result.success("Loan product updated");
  }
}
