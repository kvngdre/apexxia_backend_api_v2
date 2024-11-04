import { ClientSession } from "mongoose";
import { injectable } from "tsyringe";
import { CentralDbContext } from "@infrastructure/database/central-db-context";
import { HydratedTenantDocument, ITenantRepository, Tenant } from "@domain/tenant";

@injectable()
export class TenantRepository implements ITenantRepository {
  constructor(private readonly _dbContext: CentralDbContext) {}

  public async findById(tenantId: string): Promise<HydratedTenantDocument | null> {
    return this._dbContext.tenants.findById(tenantId);
  }

  public async findBySubdomain(subdomain: string): Promise<HydratedTenantDocument | null> {
    return this._dbContext.tenants.findOne({ subdomain });
  }

  public async find(): Promise<HydratedTenantDocument[]> {
    return this._dbContext.tenants.find();
  }

  public async insert(
    tenant: Tenant,
    options?: { session: ClientSession }
  ): Promise<HydratedTenantDocument> {
    const [newTenant] = await this._dbContext.tenants.create([tenant], options);
    return newTenant!;
  }

  public async update(
    tenant: HydratedTenantDocument,
    changes: Partial<Tenant> = {},
    options?: { session: ClientSession }
  ): Promise<HydratedTenantDocument> {
    return tenant.updateOne(Object.assign({ ...tenant._doc, _id: undefined }, changes), {
      new: true,
      session: options?.session
    });
  }

  public async delete(tenant: HydratedTenantDocument): Promise<void> {
    tenant.deleteOne();
  }

  public async isEmailUnique(email: string): Promise<boolean> {
    const matches = await this._dbContext.tenants.find({ email });

    return matches.length < 1;
  }

  public async isSubdomainUnique(email: string): Promise<boolean> {
    const matches = await this._dbContext.tenants.find({ email });

    return matches.length < 1;
  }
}
