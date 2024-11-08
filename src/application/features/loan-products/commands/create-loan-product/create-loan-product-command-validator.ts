import joi from "joi";
import { singleton } from "tsyringe";
import {
  AbstractValidator,
  idRule,
  numberRule,
  ValidationResultType,
  nameRule
} from "@shared-kernel/validation";
import { CreateLoanProductCommand } from "./create-loan-product-command";
import { FeeTypeEnum } from "@domain/loan-product";
import { stringEnumExtension } from "@shared-kernel/validation/extensions/enum-extension";

const extendedJoi = joi.extend(stringEnumExtension);

@singleton()
export class CreateLoanProductCommandValidator extends AbstractValidator<CreateLoanProductCommand> {
  public validate(
    request: CreateLoanProductCommand
  ): ValidationResultType<CreateLoanProductCommand> {
    const schema = joi.object<CreateLoanProductCommand>({
      tenant: joi.any().required(),
      lenderId: idRule.label("Lender").required(),
      name: nameRule.required(),
      minLoanAmount: numberRule.label("Minimum loan amount").required(),
      maxLoanAmount: numberRule
        .label("Maximum loan amount")
        .greater(joi.ref("minLoanAmount"))
        .required(),
      interestRateInPercentage: numberRule
        .label("Interest rate")
        .precision(2)
        .max(100.0)
        .required(),
      isActive: joi.boolean().label("Active status"),
      minTenureInMonths: numberRule.label("Minimum tenure"),
      maxTenureInMonths: numberRule.label("Maximum tenure").greater(joi.ref("minTenureInMonths")),
      upfrontFee: numberRule.label("Upfront fee"),
      maxDTIInPercentage: numberRule.label("Maximum Debt-to-Income(D.T.I) ratio"),
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
      minIncome: numberRule.label("Minimum income").precision(2),
      maxIncome: numberRule.label("Maximum income").min(joi.ref("minIncome")).precision(2),
      minAge: numberRule.label("Minimum age").min(18),
      maxAge: numberRule.label("Minimum age").min(joi.ref("minAge"))
    });

    const result = schema.validate(request);

    return this.mapToValidationResult(result);
  }
}
