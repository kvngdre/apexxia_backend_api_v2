/* eslint-disable @typescript-eslint/no-explicit-any */
import { container, singleton } from "tsyringe";
// import { sync } from "glob";
// import path from "path";
import { ResultType } from "@shared-kernel/index";
import { IRequestHandler } from "./request-handler-interface";
import { IRequest } from "./request-interface";
import { Logger } from "@infrastructure/logging";
import { IMediator } from "./mediator-interface";
import {
  GetCustomersQuery,
  GetCustomersQueryHandler
} from "@application/features/customers/queries/get-customers";

@singleton()
export class Mediator implements IMediator {
  private _handlers: Map<string, IRequestHandler<IRequest, unknown>> = new Map();

  constructor(private readonly _logger: Logger) {
    this.registerHandler.bind(this);

    // this._discoverAndRegisterHandlers();
    this._logger.logInfo("reg...");

    this.registerHandler(GetCustomersQuery, container.resolve(GetCustomersQueryHandler));
  }

  public async send<TValue>(request: IRequest<TValue>): Promise<ResultType<TValue>> {
    const requestName: string = Object.getPrototypeOf(request).constructor.name;

    const handler = this._handlers.get(requestName) as IRequestHandler<IRequest<TValue>, TValue>;

    if (!handler) {
      throw new Error(`No request handler found for request: ${requestName}`);
    }

    const result = await handler.handle(request);

    return result;
  }

  public registerHandler<T extends IRequest>(
    requestClass: new (...args: any[]) => T,
    handler: IRequestHandler<T, any>
  ): void {
    this._handlers.set(requestClass.name, handler);
  }

  // private async _discoverAndRegisterHandlers() {
  //   const pattern = "**/*-handler.{ts,js}";
  //   const handlerFiles = sync(pattern, {
  //     ignore: ["node_modules/**", "dist/**"]
  //   });

  //   for (const file of handlerFiles) {
  //     // Dynamically import the handler file
  //     const filePath = path.resolve(file);

  //     const handlerModule = await import(filePath);

  //     // Iterate over the module's exports to find the handler class
  //     for (const key of Object.keys(handlerModule)) {
  //       const handlerClass = handlerModule[key];

  //       // Check if the handler class implements the IRequestHandler interface
  //       if (this._isRequestHandler(handlerClass)) {
  //         // Resolve the handler instance using tsyringe container
  //         const handlerInstance =
  //           container.resolve<IRequestHandler<IRequest, unknown>>(handlerClass);

  //         // Extract the request type from the handler (optional: based on naming convention or custom logic)
  //         const requestName = this._getRequestName(handlerClass);

  //         // Register the handler in the _handlers map
  //         this._handlers.set(requestName, handlerInstance);
  //       }
  //     }
  //   }

  //   this._logger.logDebug("Request handlers registered...✅");
  // }

  // // Helper method to check if a class implements IRequestHandler
  // private _isRequestHandler(handlerClass: any): boolean {
  //   return (
  //     typeof handlerClass === "function" &&
  //     handlerClass.prototype &&
  //     typeof handlerClass.prototype.handle === "function"
  //   );
  // }

  // // Helper method to extract the request type or name
  // private _getRequestName(handlerClass: any): string {
  //   // Assuming the handler class follows a naming convention like SomeRequestHandler
  //   return handlerClass.name.replace("Handler", "");
  // }
}
