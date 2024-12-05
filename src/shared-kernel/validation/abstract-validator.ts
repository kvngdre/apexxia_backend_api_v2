import joi from "joi";
import { omitBy, isUndefined } from "lodash";
import { ValidationException } from "../validation-exception";

export abstract class AbstractValidator<TRequest extends object> {
  abstract validate(
    request: TRequest
  ): ValidationResultType<TRequest> | Promise<ValidationResultType<TRequest>>;

  protected mapToValidationResult(
    result: joi.ValidationResult<TRequest>
  ): ValidationResultType<TRequest> {
    if (!result.error) {
      return {
        isSuccess: true,
        isFailure: false,
        value: omitBy(result.value, isUndefined) as TRequest
      };
    }

    return {
      isSuccess: false,
      isFailure: true,
      exception: new ValidationException(
        "Validation.Error",
        this._formatErrorMessage(result.error.details[0]!.message),
        result.error.details[0]!.path
      )
    };
  }

  private _formatErrorMessage(msg: string) {
    const message = msg;
    // Regex to locate the appropriate space for inserting
    // commas in numbers in thousands or millions.
    const regex = /(?<!.*ISO \d)\B(?=(\d{3})+(?!\d))/g;

    // Remove quotation marks and insert comma to number if a number is present in the error message.
    const formattedMessage = `${message.replaceAll('"', "")}`.replace(regex, ",");
    return formattedMessage;
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
  exception?: never;
}
