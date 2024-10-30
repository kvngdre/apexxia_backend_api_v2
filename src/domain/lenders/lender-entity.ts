import { Entity } from "@shared-kernel/entity";
import { HydratedDocument, Model, Schema } from "mongoose";

export class Lender extends Entity {
  public static readonly collectionName: string = "Lender";

  public static readonly schema = new Schema<Lender, LenderModel, ILenderMethods>({}, { timestamps: true });

  public _doc: Lender;
}

export type HydratedLenderDocument = HydratedDocument<Lender, ILenderMethods>;

export interface ILenderMethods {}

export type LenderModel = Model<Lender, object, ILenderMethods>;
