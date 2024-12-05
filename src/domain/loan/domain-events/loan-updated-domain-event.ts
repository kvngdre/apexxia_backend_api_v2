import { Types } from "mongoose";
import { Loan } from "../loan-entity";
import { Tenant } from "@domain/tenant";
import { IDomainEvent } from "@infrastructure/pubsub/domain-event-interface";

export class LoanUpdatedDomainEvent implements IDomainEvent {
  constructor(
    public readonly tenant: Tenant,
    public readonly updatedBy: Types.ObjectId | string,
    public readonly oldData: Loan,
    public readonly newData: Partial<Loan>
  ) {}
}
