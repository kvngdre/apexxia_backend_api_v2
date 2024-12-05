/* eslint-disable @typescript-eslint/no-explicit-any */
import { EventEmitter } from "events";
import { container, singleton } from "tsyringe";
import { sync } from "glob";
import path from "path";
import { IDomainEvent } from "./domain-event-interface";
import { IDomainEventHandler } from "./domain-event-handler-interface";

@singleton()
export class PubSub extends EventEmitter {
  constructor() {
    super();
    this._discoverAndRegisterHandlers();
  }

  private async _discoverAndRegisterHandlers() {
    const pattern = "**/*domain-event-handler.{ts,js}";
    const handlerFiles = sync(pattern, {
      ignore: ["node_modules/**", "dist/**"]
    });

    for (const file of handlerFiles) {
      // Dynamically import the handler file
      const filePath = path.resolve(file);

      const handlerModule = await import(filePath);

      // Iterate over the module's exports to find the handler class
      for (const key of Object.keys(handlerModule)) {
        const handlerClass = handlerModule[key];

        // Check if the handler class implements the IDomainEventHandler interface
        if (this._isDomainEventHandler(handlerClass)) {
          // Resolve the handler instance using tsyringe container
          const handlerInstance =
            container.resolve<IDomainEventHandler<IDomainEvent>>(handlerClass);

          // Extract the event name from the handler
          const eventName = this._geDomainEventName(handlerClass);

          // Register the handler
          this.on(eventName, (event: IDomainEvent) => handlerInstance.handle(event));
        }
      }
    }
  }

  // Helper method to check if a class implements IDomainEventHandler interface
  private _isDomainEventHandler(handlerClass: any): boolean {
    return (
      typeof handlerClass === "function" &&
      handlerClass.prototype &&
      typeof handlerClass.prototype.handle === "function"
    );
  }

  // Helper method to extract the event name
  private _geDomainEventName(handlerClass: any): string {
    // Assuming the handler class follows a naming convention like 'SomeActionDomainEventHandler'
    return handlerClass.name.replace("Handler", "");
  }

  public subscribe<E extends IDomainEvent>(event: E, eventHandler: IDomainEventHandler<E>) {
    const eventName: string = Object.getPrototypeOf(event).constructor.name;
    this.on(eventName, async (event: E) => eventHandler.handle(event));
  }

  /**
   * Unsubscribe from a specific event.
   */
  public unsubscribe<E extends IDomainEvent>(event: E, eventHandler: IDomainEventHandler<E>) {
    const eventName: string = Object.getPrototypeOf(event).constructor.name;
    this.off(eventName, () => eventHandler);
  }

  /**
   * Publish an event to all subscribers.
   */
  public async publish<E extends IDomainEvent>(event: E) {
    const eventName: string = Object.getPrototypeOf(event).constructor.name;
    this.emit(eventName, event);
  }
}
