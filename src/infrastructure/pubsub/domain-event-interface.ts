import { Types } from "mongoose";

export interface IDomainEvent {
  tenantId: Types.ObjectId | string;
}
