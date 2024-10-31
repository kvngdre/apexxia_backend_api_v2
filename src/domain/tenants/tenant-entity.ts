import { HydratedDocument, Model, Schema } from "mongoose";
import { Entity } from "@shared-kernel/entity";

export class Tenant extends Entity {
  public static readonly collectionName: string = "Tenant";

  public static readonly schema = new Schema<Tenant, TenantModel, ITenantMethods>(
    {
      name: {
        type: String,
        required: true
      },

      databaseConnectionURI: {
        type: String,
        required: true
      }
    },
    { timestamps: true }
  );

  constructor(
    public readonly name: string,
    public databaseConnectionURI: string
  ) {
    super();
  }

  public _doc: Tenant;
}

export type HydratedTenantDocument = HydratedDocument<Tenant, ITenantMethods>;

export interface ITenantMethods {}

export type TenantModel = Model<Tenant, object, ITenantMethods>;
