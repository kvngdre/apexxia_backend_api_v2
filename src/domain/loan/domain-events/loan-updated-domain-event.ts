import { Types } from "mongoose";
import { Loan } from "../loan-entity";
import { IDomainEvent } from "@infrastructure/pubsub/domain-event-interface";

export class LoanUpdatedDomainEvent implements IDomainEvent {
  constructor(
    public readonly tenantId: Types.ObjectId | string,
    public readonly updatedBy: Types.ObjectId | string,
    public readonly oldData: Loan,
    public readonly newData: Partial<Loan>
  ) {}
}
