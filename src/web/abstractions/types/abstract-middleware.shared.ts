import { type NextFunction, type Request, type Response } from "express";

export abstract class AbstractMiddleware {
  constructor() {
    this.execute = this.execute.bind(this);
  }

  abstract execute(req: Request, res: Response, next: NextFunction): void | Promise<void>;
}
