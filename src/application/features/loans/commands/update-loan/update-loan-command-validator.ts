import Joi from "joi";
import { singleton } from "tsyringe";
import {
  AbstractValidator,
  objectIdStringRule,
  positiveNumberRule,
  ValidationResultType
} from "@shared-kernel/validation";
import { UpdateLoanCommand } from "./update-loan-command";

@singleton()
export class UpdateLoanCommandValidator extends AbstractValidator<UpdateLoanCommand> {
  public validate(request: UpdateLoanCommand): ValidationResultType<UpdateLoanCommand> {
    const schema = Joi.object({
      tenant: Joi.any(),
      user: Joi.any(),
      loanId: objectIdStringRule.label("Loan id").required(),
      loanAmount: positiveNumberRule.precision(2).label("Loan amount"),
      loanTenureInMonths: positiveNumberRule.label("Loan tenure (months)")
    });

    const result = schema.validate(request);

    return this.mapToValidationResult(result);
  }
}
