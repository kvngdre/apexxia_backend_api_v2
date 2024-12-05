import Joi from "joi";
import { singleton } from "tsyringe";
import {
  AbstractValidator,
  objectIdStringRule,
  personNameRule,
  ValidationResultType
} from "@shared-kernel/validation";
import { UpdateUserCommand } from "./update-user-command";

@singleton()
export class UpdateUserCommandValidator extends AbstractValidator<UpdateUserCommand> {
  public validate(request: UpdateUserCommand): ValidationResultType<UpdateUserCommand> {
    const schema = Joi.object({
      tenant: Joi.any(),
      user: Joi.any(),
      userId: objectIdStringRule.label("User Id").required(),
      firstName: personNameRule.label("First name"),
      middleName: personNameRule.label("Middle name").allow(null),
      lastName: personNameRule.label("Last name"),
      jobTitle: Joi.string().label("Job Title").trim().min(1).max(50)
    });

    const result = schema.validate(request);

    return this.mapToValidationResult(result);
  }
}
