import joi from "joi";
import { ValidationException } from "../validation-exception";
import { Utils } from "../utils";

export abstract class AbstractValidator<TRequest extends object> {
  abstract validate(request: TRequest): ValidationResultType<TRequest>;

  protected mapToValidationResult(
    result: joi.ValidationResult<TRequest>
  ): ValidationResultType<TRequest> {
    if (!result.error) {
      return {
        isSuccess: true,
        isFailure: false,
        value: Utils.omitUndefinedFields(result.value) as TRequest
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
  exception?: never;
}
