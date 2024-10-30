import { Exception, ExceptionType } from "@shared-kernel/index";

export class HttpStatus {
  public static readonly OK = 200;

  public static readonly CREATED = 201;

  public static readonly NO_CONTENT = 204;

  public static readonly BAD_REQUEST = 400;

  public static readonly UNAUTHORIZED = 401;

  public static readonly FORBIDDEN = 403;

  public static readonly NOT_FOUND = 404;

  public static readonly CONFLICT = 409;

  public static readonly INTERNAL_SERVER_ERROR = 500;

  public static readonly mapExceptionToHttpStatus = (exception: Exception) => {
    switch (exception.exceptionType) {
      case ExceptionType.Conflict:
        return HttpStatus.CONFLICT;

      case ExceptionType.NotFound:
        return HttpStatus.NOT_FOUND;

      case ExceptionType.Unauthorized:
        return HttpStatus.FORBIDDEN;

      case ExceptionType.Unauthenticated:
        return HttpStatus.UNAUTHORIZED;

      case ExceptionType.Validation:
        return HttpStatus.BAD_REQUEST;

      default:
        return HttpStatus.INTERNAL_SERVER_ERROR;
    }
  };
}
