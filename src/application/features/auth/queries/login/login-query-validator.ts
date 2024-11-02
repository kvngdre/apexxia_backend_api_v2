import { singleton } from "tsyringe";
import joi from "joi";
import { LoginQuery } from "./login-query";
import {
  AbstractValidator,
  emailRule,
  idRule,
  ValidationResultType
} from "@shared-kernel/validation";

@singleton()
export class LoginQueryValidator extends AbstractValidator<LoginQuery> {
  public validate(request: LoginQuery): ValidationResultType<LoginQuery> {
    const schema = joi.object<LoginQuery>({
      tenantId: idRule.label("Tenant id").required(),
      email: emailRule.required(),
      password: joi.string().max(256)
    });

    const result = schema.validate(request);

    return this.mapToValidationResult(result);
  }
}
