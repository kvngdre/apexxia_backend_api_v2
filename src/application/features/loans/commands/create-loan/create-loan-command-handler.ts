import { inject, Lifecycle, scoped } from "tsyringe";
import { IRequestHandler } from "@infrastructure/mediator";
import { CreateLoanCommand } from "./create-loan-command";
import { LoanResponseDto } from "../../shared";
import { Result, ResultType } from "@shared-kernel/result";
import { ILoanRepository, Loan } from "@domain/loan";
import { ILoanProductRepository, LoanProductExceptions } from "@domain/loan-product";
import { CreateLoanCommandValidator } from "./create-loan-command-validator";
import { CustomerExceptions, ICustomerRepository } from "@domain/customer";
import { AuditTrailAction } from "@domain/audit-trail/audit-trail-action-enum";
import { ApplicationDbContext } from "@infrastructure/database";

@scoped(Lifecycle.ResolutionScoped)
export class CreateLoanCommandHandler
  implements IRequestHandler<CreateLoanCommand, LoanResponseDto>
{
  constructor(
    @inject("LoanRepository") private readonly _loanRepository: ILoanRepository,
    @inject("CustomerRepository") private readonly _customerRepository: ICustomerRepository,
    @inject("CreateLoanCommandValidator") private readonly _validator: CreateLoanCommandValidator,
    @inject("LoanProductRepository")
    private readonly _loanProductRepository: ILoanProductRepository,
    private readonly _appDbContext: ApplicationDbContext
  ) {}

  public async handle(command: CreateLoanCommand): Promise<ResultType<LoanResponseDto>> {
    const { isFailure, exception, value } = await this._validator.validate(command);
    if (isFailure) return Result.failure(exception);

    const customer = await this._customerRepository.findById(value.tenant._id, value.customerId);
    if (!customer) {
      return Result.failure(CustomerExceptions.NotFound);
    }

    const loanProduct = await this._loanProductRepository.findById(
      value.tenant._id,
      value.loanProductId
    );
    if (!loanProduct) {
      return Result.failure(LoanProductExceptions.NotFound);
    } else if (!loanProduct.isActive) {
      return Result.failure(LoanProductExceptions.ProductNotActive);
    }

    const loan = new Loan(
      value.customerId,
      value.user.lenderId,
      value.loanProductId,
      value.loanAmount,
      value.loanTenureInMonths,
      loanProduct.interestRateInPercentage,
      {
        tenantId: value.tenant._id.toString(),
        performedBy: value.user._id.toString(),
        action: AuditTrailAction.CREATED
      }
    );

    await this._loanRepository.insert(value.tenant._id, loan);

    return Result.success("Loan Created", LoanResponseDto.from(loan));
  }
}
