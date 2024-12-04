import joi from "joi";
import { singleton } from "tsyringe";
import {
  AbstractValidator,
  objectIdStringRule,
  positiveNumberRule,
  ValidationResultType,
  nameRule
} from "@shared-kernel/validation";
import { CreateLoanProductCommand } from "./create-loan-product-command";
import { FeeTypeEnum } from "@domain/loan-product";
import {
  JoiStringEnumExtend,
  stringEnumExtension
} from "@shared-kernel/validation/extensions/enum-extension";

const extendedJoi: JoiStringEnumExtend = joi.extend(stringEnumExtension);

@singleton()
export class CreateLoanProductCommandValidator extends AbstractValidator<CreateLoanProductCommand> {
  public validate(
    request: CreateLoanProductCommand
  ): ValidationResultType<CreateLoanProductCommand> {
    const schema = joi.object<CreateLoanProductCommand>({
      tenant: joi.any().required(),
      lenderId: objectIdStringRule.label("Lender").required(),
      name: nameRule.required(),
      minLoanAmount: positiveNumberRule.label("Minimum loan amount").required(),
      maxLoanAmount: positiveNumberRule
        .label("Maximum loan amount")
        .greater(joi.ref("minLoanAmount"))
        .required(),
      interestRateInPercentage: positiveNumberRule
        .label("Interest rate")
        .precision(2)
        .max(100.0)
        .required(),
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
