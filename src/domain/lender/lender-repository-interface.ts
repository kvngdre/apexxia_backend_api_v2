import { ClientSession, Types } from "mongoose";
import { HydratedLenderDocument, Lender } from "./lender-entity";

export interface ILenderRepository {
  findById(
    tenantId: Types.ObjectId | string,
    lenderId: string
  ): Promise<HydratedLenderDocument | null>;
  find(tenantId: Types.ObjectId | string): Promise<HydratedLenderDocument[]>;
  insert(
    tenantId: Types.ObjectId | string,
    lender: Lender,
    options?: { session: ClientSession }
  ): Promise<HydratedLenderDocument>;
  update(
    lender: HydratedLenderDocument,
    changes?: Partial<Lender>,
    options?: { session: ClientSession }
  ): Promise<HydratedLenderDocument>;
  delete(lender: HydratedLenderDocument): Promise<void>;
}
