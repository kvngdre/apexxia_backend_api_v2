import { IDomainEvent } from "./domain-event-interface";

export interface IDomainEventHandler<E extends IDomainEvent> {
  handle(event: E): Promise<void>;
}
