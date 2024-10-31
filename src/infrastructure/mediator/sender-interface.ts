import { ResultType } from "@shared-kernel/result";
import { IRequest } from "./request-interface";

export interface ISender {
  send<TValue>(request: IRequest<TValue>): Promise<ResultType<TValue>>;
}
