import { container } from "tsyringe";
import { PubSub } from "./pubsub";
import { IDomainEvent } from "./domain-event-interface";

export abstract class Publisher {
  private readonly _publisher = container.resolve(PubSub);

  protected async raiseDomainEvent(event: IDomainEvent): Promise<void> {
    await this._publisher.publish(event);
  }
}
