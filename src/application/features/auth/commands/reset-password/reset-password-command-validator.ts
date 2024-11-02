import { singleton } from "tsyringe";
import joi from "joi";
import {
  AbstractValidator,
  emailRule,
  idRule,
  passwordRule,
  ValidationResultType
} from "@shared-kernel/validation";
import { ResetPasswordCommand } from "./reset-password-command";

@singleton()
export class ResetPasswordCommandValidator extends AbstractValidator<ResetPasswordCommand> {
  public validate(request: ResetPasswordCommand): ValidationResultType<ResetPasswordCommand> {
    const schema = joi.object<ResetPasswordCommand>({
      tenantId: idRule.label("Tenant ID").required(),
      email: emailRule.required(),
      tempPassword: joi.string().label("Temporary password").trim().max(256).required(),
      newPassword: passwordRule.label("New password").required(),
      confirmNewPassword: joi
        .string()
        .trim()
        .equal(joi.ref("newPassword"))
        .messages({ "any.only": "Passwords do not match" })
    });

    const result = schema.validate(request);

    return this.mapToValidationResult(result);
  }
}
