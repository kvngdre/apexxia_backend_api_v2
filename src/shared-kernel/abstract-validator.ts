import _, { isUndefined } from "lodash";
import { z } from "zod";
import { ValidationException } from "./validation-exception";

export abstract class AbstractValidator<TRequest extends object> {
  abstract validate(request: TRequest): ValidationResultType<TRequest>;

  protected mapToValidationResult(
    result: z.SafeParseReturnType<TRequest, TRequest>
  ): ValidationResultType<TRequest> {
    if (result.success) {
      return {
        isSuccess: result.success,
        isFailure: !result.success,
        value: _.omitBy(result.data, isUndefined) as TRequest
      };
    }
    return {
      isSuccess: result.success,
      isFailure: !result.success,
      exception: new ValidationException(
        this._formatCode(result.error.issues[0]!.code),
        result.error.issues[0]!.message,
        result.error.issues[0]!.path
      )
    };
  }

  private _formatCode(code: string) {
    let codeParts: string[] = code.replace(/_/g, " ").split(" ");
    codeParts = codeParts.map((p) => p.charAt(0).toUpperCase() + p.slice(1));

    return "Validation.".concat(codeParts.join(""));
  }
}

export type ValidationResultType<T> = IValidationSuccess<T> | IValidationFailure;

interface IValidationFailure {
  isSuccess: false;
  isFailure: true;
  value?: never;
  exception: ValidationException;
}

interface IValidationSuccess<TData> {
  isSuccess: true;
  isFailure: false;
  value: TData;
  exception?: undefined;
}
