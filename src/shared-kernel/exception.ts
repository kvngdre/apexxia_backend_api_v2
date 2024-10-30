import { ExceptionType } from "./exception-type";

export class Exception {
  constructor(
    public readonly exceptionType: ExceptionType,
    public readonly code: string,
    public readonly description: string
  ) {}

  public static Conflict(code: string, description: string) {
    return new Exception(ExceptionType.Conflict, code, description);
  }

  public static Failure(code: string, description: string, statusCode?: number) {
    return new Exception(ExceptionType.Failure, code, description);
  }

  public static NotFound(code: string, description: string) {
    return new Exception(ExceptionType.NotFound, code, description);
  }

  public static Unauthenticated(code: string, description: string) {
    return new Exception(ExceptionType.Unauthenticated, code, description);
  }

  public static Unauthorized(code: string, description: string) {
    return new Exception(ExceptionType.Unauthorized, code, description);
  }

  public static get Unexpected() {
    return new Exception(ExceptionType.Unexpected, "General.Unexpected", "Something went wrong");
  }
}
