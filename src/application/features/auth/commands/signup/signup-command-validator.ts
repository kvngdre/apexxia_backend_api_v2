import { singleton } from "tsyringe";
import joi from "joi";
import {
  AbstractValidator,
  emailRule,
  lenderNameRule,
  subdomainRule,
  personNameRule,
  ValidationResultType
} from "@shared-kernel/validation";
import { SignupCommand } from "./signup-command";

@singleton()
export class SignupCommandValidator extends AbstractValidator<SignupCommand> {
  public validate(request: SignupCommand): ValidationResultType<SignupCommand> {
    const schema = joi.object<SignupCommand>({
      lenderName: lenderNameRule.required(),
      subdomain: subdomainRule.required(),
      firstName: personNameRule.label("First name").required(),
      lastName: personNameRule.label("Last name").required(),
      email: emailRule.required()
    });

    const result = schema.validate(request);

    return this.mapToValidationResult(result);
  }
}
