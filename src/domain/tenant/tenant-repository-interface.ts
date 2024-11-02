import { ClientSession, Types } from "mongoose";
import { HydratedTenantDocument, Tenant } from "./tenant-entity";

export interface ITenantRepository {
  findById(tenantId: Types.ObjectId | string): Promise<HydratedTenantDocument | null>;
  findBySubdomain(subdomain: string): Promise<HydratedTenantDocument | null>;
  find(): Promise<HydratedTenantDocument[]>;
  insert(Tenant: Tenant, options?: { session: ClientSession }): Promise<HydratedTenantDocument>;
  update(
    tenant: HydratedTenantDocument,
    changes: Partial<Tenant>,
    options?: { session: ClientSession }
  ): Promise<HydratedTenantDocument>;
  delete(tenant: HydratedTenantDocument): Promise<void>;
  isEmailUnique(email: string): Promise<boolean>;
  isSubdomainUnique(subdomain: string): Promise<boolean>;
}
