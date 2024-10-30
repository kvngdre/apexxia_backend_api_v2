import { type Response } from "express";
import { Exception } from "@shared-kernel/exception";
import { ExceptionType } from "@shared-kernel/exception-type";
import { HttpStatus } from "./http-status";

type MessageType<T extends boolean> = T extends true ? string : never;
type DataType<T extends boolean, TData> = T extends true ? TData : never;
type ErrorType<T extends boolean> = T extends true
  ? never
  : Omit<Exception, "exceptionType"> & { errorType: string; path?: (string | number)[] };

/**
 * Represents the response payload for HTTP requests.
 */
export class ApiResponse<TData, TSuccess extends boolean> {
  private constructor(
    public readonly success: TSuccess,
    public readonly status: number,
    public readonly message: MessageType<TSuccess>,
    public readonly data: DataType<TSuccess, TData>,
    public readonly error: ErrorType<TSuccess>
  ) {}

  /**
   * Creates a successful response payload.
   * @param message - The message to include in the payload.
   * @param data - The data to include in the payload.
   * @returns An instance of ApiResponse with success status.
   */
  public static success<T>(message: string, data: T | undefined, status: number = 200) {
    return new ApiResponse(true, status, message, data, undefined as never);
  }

  /**
   * Creates a failure response payload.
   * @param exception - The exception to include in the payload.
   * @returns An instance of ApiResponse with failure status.
   */
  public static failure(exception: Exception & { path?: (string | number)[] }, res: Response) {
    res.setHeader("Content-Type", "application/problem+json");

    return new ApiResponse(
      false,
      ApiResponse._getStatusCode(exception),
      undefined as never,
      undefined as never,
      {
        errorType: exception.exceptionType,
        code: exception.code,
        description: exception.description,
        path: exception.path
      }
    );
  }

  private static _getStatusCode(exception: Exception) {
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
  }
}

export type ApiResponseType<TData> = ApiResponse<TData, true> | ApiResponse<never, false>;
// export type ApiResponseType<TData> = ISuccessApiResponse<TData> | IFailureApiResponse;

// interface ISuccessApiResponse<TData> {
//   success: true;
//   message: string;
//   data: TData | undefined;
//   exception: never;
// }

// interface IFailureApiResponse {
//   success: false;
//   message: never;
//   data: never;
//   exception: Exception;
// }
