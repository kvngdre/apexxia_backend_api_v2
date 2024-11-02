import { z } from "zod";
import { AbstractValidator, ValidationResultType } from "./abstract-validator";
import { createIdRule } from "./common-validation-rules";

export class GenericIdValidator<T extends object> extends AbstractValidator<T> {
  constructor(
    private readonly _keys: (keyof T)[],
    private readonly _messages: Record<keyof T, string>
  ) {
    super();
  }

  public validate(request: T): ValidationResultType<T> {
    const obj: Record<keyof T, z.ZodTypeAny> = {} as Record<keyof T, z.ZodTypeAny>;

    for (const key of this._keys) {
      obj[key] = createIdRule(this._messages[key]);
    }

    const schema = z.object(obj);

    const result = schema.safeParse(request) as z.SafeParseReturnType<T, T>;

    return this.mapToValidationResult(result);
  }
}
