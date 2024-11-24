import { HydratedDocument, Model, Schema, Types } from "mongoose";
import { Entity } from "@shared-kernel/entity";
import { Lender } from "@domain/lender";

export class Segment extends Entity {
  public static readonly collectionName = "Segment";

  public static readonly schema = new Schema<Segment, SegmentModel, ISegmentMethods>(
    {
      lenderId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: Lender.collectionName,
        unique: true
      },

      name: {
        type: String,
        required: true
      },

      isActive: {
        type: Boolean,
        default: true
      },

      createdAt: Date,

      updatedAt: Date
    },
    { timestamps: true }
  );

  constructor(
    public lenderId: Types.ObjectId,
    public name: string,
    public isActive: boolean = true
  ) {
    super();
  }

  public lender?: Lender;
  public _doc: Segment;
}

export type HydratedSegmentDocument = HydratedDocument<Segment, ISegmentMethods>;

export interface ISegmentMethods {}

export type SegmentModel = Model<Segment, object, ISegmentMethods>;
