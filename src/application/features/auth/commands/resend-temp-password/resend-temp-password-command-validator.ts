import { singleton } from "tsyringe";
import joi from "joi";
import { AbstractValidator, emailRule, ValidationResultType } from "@shared-kernel/validation";
import { ResendTempPasswordCommand } from "./resend-temp-password-command";

@singleton()
export class ResendTempPasswordCommandValidator extends AbstractValidator<ResendTempPasswordCommand> {
  public validate(
    request: ResendTempPasswordCommand
  ): ValidationResultType<ResendTempPasswordCommand> {
    const schema = joi.object<ResendTempPasswordCommand>({
      tenant: joi.any(),
      email: emailRule.required()
    });

    const result = schema.validate(request);

    return this.mapToValidationResult(result);
  }
}
