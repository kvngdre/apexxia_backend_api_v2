import { type Request, type Response, type NextFunction } from "express";
import { Lifecycle, scoped } from "tsyringe";
import { AbstractErrorMiddleware } from "@web/abstractions/types/abstract-error-middleware.shared";
import { ApiResponse } from "@web/infrastructure/api-response";
import { GlobalErrorHandler } from "@web/infrastructure/global-error-handler";
import { Exception, ValidationException } from "@shared-kernel/index";

@scoped(Lifecycle.ResolutionScoped)
export class ErrorHandlingMiddleware extends AbstractErrorMiddleware {
  constructor(private readonly _globalErrorHandler: GlobalErrorHandler) {
    super();
  }

  public async execute(err: Error, req: Request, res: Response, next: NextFunction): Promise<void> {
    // Handle JSON syntax errors in payload.
    if (err instanceof SyntaxError && "body" in err) {
      const exception = new ValidationException(
        "Validation.MalformedJSON",
        "An error occurred while parsing request JSON payload.",
        []
      );

      res.status(400).json(ApiResponse.failure(exception, res));

      return next();
    }

    await this._globalErrorHandler.handle(err);

    res.status(500).json(ApiResponse.failure(Exception.Unexpected, res));

    next();
  }
}
