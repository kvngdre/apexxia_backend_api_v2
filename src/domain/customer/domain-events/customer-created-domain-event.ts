import { Types } from "mongoose";
import { IDomainEvent } from "@infrastructure/pubsub/domain-event-interface";
import { Customer } from "../customer-entity";

export default class CustomerCreatedDomainEvent implements IDomainEvent {
  constructor(
    public readonly tenantId: Types.ObjectId | string,
    public readonly customer: Customer,
    public readonly performedBy: Types.ObjectId | string,
    public readonly timestamp: Date = new Date()
  ) {}
}
