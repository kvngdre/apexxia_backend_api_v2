import Joi from "joi";
import { inject, Lifecycle, scoped } from "tsyringe";
import { CreateCustomerLoanCommand } from "./create-customer-loan-command";
import {
  AbstractValidator,
  positiveNumberRule,
  objectIdStringRule,
  ValidationResultType
} from "@shared-kernel/validation";
import { ILoanProductRepository, LoanProductExceptions } from "@domain/loan-product";
import { ValidationException } from "@shared-kernel/validation-exception";

@scoped(Lifecycle.ResolutionScoped)
export class CreateCustomerLoanCommandValidator extends AbstractValidator<CreateCustomerLoanCommand> {
  constructor(
    @inject("LoanProductRepository") private readonly _loanProductRepository: ILoanProductRepository
  ) {
    super();
  }

  public async validate(
    request: CreateCustomerLoanCommand
  ): Promise<ValidationResultType<CreateCustomerLoanCommand>> {
    const loanProduct = await this._loanProductRepository.findById(
      request.tenant._id,
      request.loanProductId
    );
    if (!loanProduct || !loanProduct.isActive) {
      const ex = !loanProduct?.isActive
        ? LoanProductExceptions.ProductNotActive
        : LoanProductExceptions.NotFound;
      return {
        isSuccess: false,
        isFailure: true,
        exception: new ValidationException(ex.code, ex.description, ["loanProductId"])
      };
    }

    const schema = Joi.object({
      tenant: Joi.any(),
      user: Joi.any(),
      customerId: objectIdStringRule.label("Customer ID").required(),
      loanProductId: objectIdStringRule.label("Loan product ID").required(),
      loanAmount: positiveNumberRule
        .label("Loan amount")
        .precision(2)
        .min(loanProduct.minLoanAmount)
        .max(loanProduct.maxLoanAmount)
        .required(),
      loanTenureInMonths: positiveNumberRule
        .label("Loan tenure (months)")
        .min(loanProduct.minTenureInMonths)
        .max(loanProduct.maxTenureInMonths)
        .required()
    });

    const result = schema.validate(request);

    return this.mapToValidationResult(result);
  }
}
