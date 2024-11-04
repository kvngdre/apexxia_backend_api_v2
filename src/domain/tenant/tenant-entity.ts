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

      email: {
        type: String,
        unique: true,
        required: true
      },

      subdomain: {
        type: String,
        unique: true,
        required: true
      },

      databaseConnectionURI: {
        type: String,
        required: true
      },

      signupDateTime: {
        type: Date,
        default: new Date()
      }
    },
    { timestamps: true }
  );

  constructor(
    public readonly name: string,
    public subdomain: string,
    public email: string,
    public databaseConnectionURI: string
  ) {
    super();
  }

  public signupDateTime: Date = new Date();
  public _doc: Tenant;
}

export type HydratedTenantDocument = HydratedDocument<Tenant, ITenantMethods>;

export interface ITenantMethods {}

export type TenantModel = Model<Tenant, object, ITenantMethods>;
