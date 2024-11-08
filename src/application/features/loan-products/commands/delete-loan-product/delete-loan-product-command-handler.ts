import { inject, Lifecycle, scoped } from "tsyringe";
import { IRequestHandler } from "@infrastructure/mediator";
import { DeleteLoanProductCommand } from "./delete-loan-product-command";
import { Result, ResultType } from "@shared-kernel/result";
import { ILoanProductRepository, LoanProductExceptions } from "@domain/loan-product";

@scoped(Lifecycle.ResolutionScoped)
export class DeleteLoanProductCommandHandler implements IRequestHandler<DeleteLoanProductCommand> {
  constructor(
    @inject("LoanProductRepository")
    private readonly _loanProductRepository: ILoanProductRepository
  ) {}

  public async handle(command: DeleteLoanProductCommand): Promise<ResultType<unknown>> {
    const product = await this._loanProductRepository.findById(
      command.tenant.id,
      command.loanProductId
    );
    if (!product) return Result.failure(LoanProductExceptions.NotFound);

    await this._loanProductRepository.delete(product);

    return Result.success("Loan product deleted");
  }
}
