import { type NextFunction, type Request, type Response } from "express";

export abstract class AbstractErrorMiddleware {
  constructor() {
    this.execute = this.execute.bind(this);
  }

  abstract execute(
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
  ): void | Promise<void>;
}
