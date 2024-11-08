import joi from "joi";
import { singleton } from "tsyringe";
import {
  AbstractValidator,
  emailRule,
  idRule,
  nameRule,
  personNameRule,
  ValidationResultType
} from "@shared-kernel/validation";
import { CreateUserCommand } from "./create-user-command";

@singleton()
export class CreateUserCommandValidator extends AbstractValidator<CreateUserCommand> {
  public validate(request: CreateUserCommand): ValidationResultType<CreateUserCommand> {
    const schema = joi.object<CreateUserCommand>({
      tenant: joi.any().required(),
      lenderId: idRule.label("Lender").required(),
      firstName: personNameRule.label("First name").required(),
      lastName: personNameRule.label("Last name").required(),
      email: emailRule.required(),
      jobTitle: nameRule.label("Job title")
    });

    const result = schema.validate(request);

    return this.mapToValidationResult(result);
  }
}
