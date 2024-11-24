import { HydratedDocument, Model, Schema, Types } from "mongoose";
import { User } from "@domain/user";
import { Entity } from "@shared-kernel/entity";
import { DateTimeProvider } from "@shared-kernel/date-time-provider";

export class AuditTrail extends Entity {
  public static readonly collectionName = "Audit_Trail";

  public static readonly schema = new Schema<AuditTrail, AuditTrailModel, IAuditTrailMethods>({
    entityId: {
      type: Schema.Types.ObjectId,
      required: true
      // ref: User.collectionName,
    },

    entityType: {
      type: String,
      required: true
    },

    timestamp: {
      type: Date,
      required: true
    },

    action: {
      type: String,
      default: null
    },

    performedBy: {
      type: String,
      required: true
    },

    previousData: {
      type: Schema.Types.Mixed,
      default: null
    },

    newData: {
      type: Schema.Types.Mixed,
      default: null
    }
  });

  constructor(
    public entityId: Types.ObjectId | string,
    public entityType: string,
    public action: string,
    public performedBy: string
  ) {
    super();
  }

  public timestamp: Date = DateTimeProvider.utcNow();
  public previousData: unknown = null;
  public newData: unknown = null;
  public user?: User;
  public _doc: AuditTrail;
}

export type HydratedAuditTrailDocument = HydratedDocument<AuditTrail, IAuditTrailMethods>;

export interface IAuditTrailMethods {}

export type AuditTrailModel = Model<AuditTrail, object, IAuditTrailMethods>;
