import { Types } from "mongoose";
import { Loan } from "../loan-entity";
import { IDomainEvent } from "@infrastructure/pubsub/domain-event-interface";

export class LoanCreatedDomainEvent implements IDomainEvent {
  constructor(
    public readonly tenantId: Types.ObjectId | string,
    public readonly loan: Loan,
    public readonly createdBy: Types.ObjectId | string
  ) {}
}
