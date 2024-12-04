import joi from "joi";
import { singleton } from "tsyringe";
import {
  AbstractValidator,
  objectIdStringRule,
  positiveNumberRule,
  ValidationResultType,
  nameRule
} from "@shared-kernel/validation";
import { UpdateLoanProductCommand } from "./update-loan-product-command";
import { FeeTypeEnum } from "@domain/loan-product";
import { stringEnumExtension } from "@shared-kernel/validation/extensions/enum-extension";

const extendedJoi = joi.extend(stringEnumExtension);

@singleton()
export class UpdateLoanProductCommandValidator extends AbstractValidator<UpdateLoanProductCommand> {
  public validate(
    request: UpdateLoanProductCommand
  ): ValidationResultType<UpdateLoanProductCommand> {
    const schema = joi.object<UpdateLoanProductCommand>({
      tenant: joi.any().required(),
      loanProductId: objectIdStringRule.label("Loan product").required(),
      name: nameRule,
      minLoanAmount: positiveNumberRule.label("Minimum loan amount"),
      maxLoanAmount: positiveNumberRule
        .label("Maximum loan amount")
        .greater(joi.ref("minLoanAmount")),
      interestRateInPercentage: positiveNumberRule.label("Interest rate").precision(2).max(100.0),
      isActive: joi.boolean().label("Active status"),
      minTenureInMonths: positiveNumberRule.label("Minimum tenure"),
      maxTenureInMonths: positiveNumberRule
        .label("Maximum tenure")
        .greater(joi.ref("minTenureInMonths")),
      upfrontFee: positiveNumberRule.label("Upfront fee"),
      maxDTIInPercentage: positiveNumberRule.label("Maximum Debt-to-Income(D.T.I) ratio"),
      fees: joi
        .array()
        .label("Fees")
        .items(
          joi.object({
            name: nameRule.label("Fee name").max(50).trim().required(),
            value: joi.number().label("Fee value").required(),
            type: extendedJoi.string().label("Fee type").enum(FeeTypeEnum).trim().required()
          })
        )
        .min(1),
      minIncome: positiveNumberRule.label("Minimum income").precision(2),
      maxIncome: positiveNumberRule.label("Maximum income").min(joi.ref("minIncome")).precision(2),
      minAge: positiveNumberRule.label("Minimum age").min(18),
      maxAge: positiveNumberRule.label("Minimum age").min(joi.ref("minAge"))
    });

    const result = schema.validate(request);

    return this.mapToValidationResult(result);
  }
}
