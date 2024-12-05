import { Types } from "mongoose";
import { Loan } from "../loan-entity";
import { Tenant } from "@domain/tenant";
import { IDomainEvent } from "@infrastructure/pubsub/domain-event-interface";

export class LoanCreatedDomainEvent implements IDomainEvent {
  constructor(
    // public readonly sender: any,
    public readonly tenant: Tenant,
    public readonly loan: Loan,
    public readonly createdBy: Types.ObjectId | string
  ) {}
}
