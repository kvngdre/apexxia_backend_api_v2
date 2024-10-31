import { IRequest } from "./request-interface";
import { IRequestHandler } from "./request-handler-interface";
import { ISender } from "./sender-interface";

export interface IMediator extends ISender {
  registerHandler<T extends IRequest>(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    request: new (...args: any[]) => T,
    handler: IRequestHandler<T, unknown>
  ): void;
}
