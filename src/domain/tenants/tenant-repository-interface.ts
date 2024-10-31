import { ClientSession } from "mongoose";
import { HydratedTenantDocument, Tenant } from "./tenant-entity";

export interface ITenantRepository {
  findById(tenantId: string): Promise<HydratedTenantDocument | null>;
  find(): Promise<HydratedTenantDocument[]>;
  insert(Tenant: Tenant, options?: { session: ClientSession }): Promise<HydratedTenantDocument>;
  update(
    tenant: HydratedTenantDocument,
    changes: Partial<Tenant>,
    options?: { session: ClientSession }
  ): Promise<HydratedTenantDocument>;
  delete(tenant: HydratedTenantDocument): Promise<void>;
}
