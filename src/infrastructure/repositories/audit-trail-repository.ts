import { ClientSession } from "mongoose";
import { injectable } from "tsyringe";
import { ApplicationDbContext } from "@infrastructure/database";
import { AuditTrail, HydratedAuditTrailDocument, IAuditTrailRepository } from "@domain/audit-trail";

@injectable()
export class AuditTrailRepository implements IAuditTrailRepository {
  constructor(private readonly _dbContext: ApplicationDbContext) {}

  public async findById(
    tenantId: string,
    auditTrailId: string
  ): Promise<HydratedAuditTrailDocument | null> {
    return (await this._dbContext.auditTrails(tenantId)).findById(auditTrailId);
  }

  public async find(tenantId: string): Promise<HydratedAuditTrailDocument[]> {
    return (await this._dbContext.auditTrails(tenantId)).find();
  }

  public async insert(
    tenantId: string,
    auditTrail: AuditTrail,
    options?: { session: ClientSession }
  ): Promise<HydratedAuditTrailDocument> {
    const [newAuditTrail] = await (
      await this._dbContext.auditTrails(tenantId)
    ).create([auditTrail], options);
    return newAuditTrail!;
  }

  public async update(
    auditTrail: HydratedAuditTrailDocument,
    changes: Partial<AuditTrail> = {},
    options?: { session: ClientSession }
  ): Promise<HydratedAuditTrailDocument> {
    return auditTrail.updateOne(Object.assign({ ...auditTrail._doc, _id: undefined }, changes), {
      new: true,
      session: options?.session
    });
  }

  public async delete(
    auditTrail: HydratedAuditTrailDocument,
    options?: { session: ClientSession }
  ): Promise<void> {
    await auditTrail.deleteOne({ session: options?.session });
  }
}
