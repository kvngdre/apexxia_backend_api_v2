import { Exception } from "./exception";
import { ExceptionType } from "./exception-type";

export class ValidationException extends Exception {
  constructor(
    code: string,
    message: string,
    public readonly path: (string | number)[]
  ) {
    super(ExceptionType.Validation, code, message);
  }
}
