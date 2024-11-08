import { inject, Lifecycle, scoped } from "tsyringe";
import { IRequestHandler } from "@infrastructure/mediator";
import { CreateLoanProductCommand } from "./create-loan-product-command";
import { LoanProductResponseDto } from "../../shared";
import { Result, ResultType } from "@shared-kernel/result";
import { ILoanProductRepository, LoanProduct, LoanProductExceptions } from "@domain/loan-product";
import { CreateLoanProductCommandValidator } from "./create-loan-product-command-validator";

@scoped(Lifecycle.ResolutionScoped)
export class CreateLoanProductCommandHandler
  implements IRequestHandler<CreateLoanProductCommand, LoanProductResponseDto>
{
  constructor(
    @inject("LoanProductRepository")
    private readonly _loanProductRepository: ILoanProductRepository,
    private readonly _validator: CreateLoanProductCommandValidator
  ) {}

  public async handle(
    command: CreateLoanProductCommand
  ): Promise<ResultType<LoanProductResponseDto>> {
    const { isFailure, exception, value } = this._validator.validate(command);
    if (isFailure) return Result.failure(exception);

    if (!(await this._loanProductRepository.isNameUnique(value.tenant.id, value.name))) {
      return Result.failure(LoanProductExceptions.DuplicateName);
    }

    const product = new LoanProduct(
      value.lenderId,
      value.name,
      value.minLoanAmount,
      value.maxLoanAmount,
      value.interestRateInPercentage,
      value.isActive,
      value.upfrontFee,
      value.maxDTIInPercentage,
      value.minTenureInMonths,
      value.maxTenureInMonths,
      value.minIncome,
      value.maxIncome,
      value.minAge,
      value.maxAge,
      value.fees
    );

    await this._loanProductRepository.insert(value.tenant.id, product);

    return Result.success("Loan product created", LoanProductResponseDto.from(product));
  }
}
