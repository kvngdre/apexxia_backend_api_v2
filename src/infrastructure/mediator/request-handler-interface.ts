import { ResultType } from "@shared-kernel/index";
import { IRequest } from "./request-interface";

export interface IRequestHandler<TRequest extends IRequest, TValue = unknown> {
  handle(request: TRequest): Promise<ResultType<TValue>>;
}
