import { ResultType } from "@shared-kernel/result";
import { IRequest } from "./request-interface";
import { IRequestHandler } from "./request-handler-interface";

export interface IMediator {
  send<TValue>(request: IRequest<TValue>): Promise<ResultType<TValue>>;
  registerHandler<T extends IRequest>(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    request: new (...args: any[]) => T,
    handler: IRequestHandler<T, unknown>
  ): void;
}
