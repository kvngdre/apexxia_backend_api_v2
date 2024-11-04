import { singleton } from "tsyringe";
import joi from "joi";
import { LoginQuery } from "./login-query";
import { AbstractValidator, emailRule, ValidationResultType } from "@shared-kernel/validation";

@singleton()
export class LoginQueryValidator extends AbstractValidator<LoginQuery> {
  public validate(request: LoginQuery): ValidationResultType<LoginQuery> {
    const schema = joi.object<LoginQuery>({
      tenant: joi.any(),
      email: emailRule.required(),
      password: joi.string().max(256).required()
    });

    const result = schema.validate(request);

    return this.mapToValidationResult(result);
  }
}
