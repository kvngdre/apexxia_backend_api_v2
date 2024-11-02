import { IRequest } from "@infrastructure/mediator";

export abstract class Command<T = unknown> implements IRequest<T> {
  constructor(public tenantId: string) {}
}
