import { container } from "tsyringe";
import { type Response } from "express";
import { ResultType } from "@shared-kernel/result";
import { ApiResponse, HttpStatus } from "../web-infrastructure";
import { ISender, Mediator } from "@infrastructure/mediator";

export abstract class BaseController {
  protected readonly sender: ISender = container.resolve(Mediator);

  protected buildHttpResponse<TValue>(
    result: ResultType<TValue>,
    res: Response,
    options?: { code?: HttpStatus }
  ) {
    const code = result.isSuccess
      ? (options?.code as number) || HttpStatus.OK
      : HttpStatus.mapExceptionToHttpStatus(result.exception);

    const payload = result.isSuccess
      ? ApiResponse.success<TValue>(result.message, result.value)
      : ApiResponse.failure(result.exception, res);

    return {
      code,
      payload
    };
  }
}
