import joi from "joi";
import { idRule } from "./common-validation-rules";
import { AbstractValidator, ValidationResultType } from "./abstract-validator";

export class GenericIdValidator<T extends object> extends AbstractValidator<T> {
  constructor(private readonly _keys: (keyof T)[]) {
    super();
  }

  public validate(request: T): ValidationResultType<T> {
    const obj: Record<keyof T, joi.StringSchema> = {} as Record<keyof T, joi.StringSchema>;

    for (const key of this._keys) {
      obj[key] = idRule;
    }

    const schema = joi.object(obj);

    const result = schema.validate(request);

    return this.mapToValidationResult(result);
  }
}
