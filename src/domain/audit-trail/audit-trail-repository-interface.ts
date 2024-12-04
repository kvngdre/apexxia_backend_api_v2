import { ClientSession, Types } from "mongoose";
import { AuditTrail, HydratedAuditTrailDocument } from "./audit-trail-entity";

export interface IAuditTrailRepository {
  findById(
    tenantId: Types.ObjectId | string,
    auditTrailId: string
  ): Promise<HydratedAuditTrailDocument | null>;
  find(tenantId: Types.ObjectId | string): Promise<HydratedAuditTrailDocument[]>;
  insert(
    tenantId: Types.ObjectId | string,
    auditTrail: AuditTrail,
    options?: { session: ClientSession }
  ): Promise<HydratedAuditTrailDocument>;
  update(
    auditTrail: HydratedAuditTrailDocument,
    changes?: Partial<AuditTrail>,
    options?: { session: ClientSession }
  ): Promise<HydratedAuditTrailDocument>;
  delete(
    auditTrail: HydratedAuditTrailDocument,
    options?: { session: ClientSession }
  ): Promise<void>;
}
