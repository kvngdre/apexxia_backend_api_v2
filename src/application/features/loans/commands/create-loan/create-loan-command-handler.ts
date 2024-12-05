import { inject, Lifecycle, scoped } from "tsyringe";
import { IRequestHandler } from "@infrastructure/mediator";
import { CreateLoanCommand } from "./create-loan-command";
import { LoanResponseDto } from "../../shared";
import { Result, ResultType } from "@shared-kernel/result";
import { ILoanRepository, Loan } from "@domain/loan";
import { ILoanProductRepository, LoanProductExceptions } from "@domain/loan-product";
import { CreateLoanCommandValidator } from "./create-loan-command-validator";
import { CustomerExceptions, ICustomerRepository } from "@domain/customer";
import { Publisher } from "@infrastructure/pubsub/publisher";
import { LoanCreatedDomainEvent } from "@domain/loan/domain-events";

@scoped(Lifecycle.ResolutionScoped)
export class CreateLoanCommandHandler
  extends Publisher
  implements IRequestHandler<CreateLoanCommand, LoanResponseDto>
{
  constructor(
    @inject("LoanRepository") private readonly _loanRepository: ILoanRepository,
    @inject("CustomerRepository") private readonly _customerRepository: ICustomerRepository,
    @inject("CreateLoanCommandValidator") private readonly _validator: CreateLoanCommandValidator,
    @inject("LoanProductRepository")
    private readonly _loanProductRepository: ILoanProductRepository
  ) {
    super();
  }

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
      loanProduct.interestRateInPercentage
    );

    await this._loanRepository.insert(value.tenant._id, loan);

    this.raiseDomainEvent(new LoanCreatedDomainEvent(value.tenant, loan, value.user._id));

    return Result.success("Loan Created", LoanResponseDto.from(loan));
  }
}
