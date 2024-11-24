import { HydratedDocument, Model, Schema, Types } from "mongoose";
import { Entity } from "@shared-kernel/entity";
import { LenderStatus } from "./lender-status-enum";
import { Address } from "@domain/address";
// import { Tenant } from "@domain/tenant";

export class Lender extends Entity {
  public static readonly collectionName: string = "Lender";

  public static readonly schema = new Schema<Lender, LenderModel, ILenderMethods>(
    {
      tenantId: {
        type: Schema.Types.ObjectId,
        required: true
      },

      name: {
        type: String,
        required: true
      },

      addressId: {
        type: Schema.Types.ObjectId,
        default: null
      },

      cacNumber: {
        type: String,
        default: null
      },

      // category: {
      //   type: String,
      //   // enum: LenderCategory,
      //   default: null
      // },

      isVerified: {
        type: Boolean,
        default: false
      },

      status: {
        type: String,
        enum: LenderStatus,
        default: LenderStatus.NEW
      },

      verificationReason: {
        type: String,
        default: null
      },

      logo: {
        type: String,
        default: null
      }

      // documentation: {
      //   type: [
      //     {
      //       name: { type: String, required: true },
      //       type: { type: String, required: true },
      //       url: { type: String, required: true },
      //       expiresAt: { type: Date, default: null }
      //     }
      //   ]
      // },

      // configurations: {
      //   allowUserPasswordReset: {
      //     type: Boolean,
      //     default: false
      //   },

      //   socials: {
      //     type: [
      //       {
      //         platform: { type: String, trim: true, required: true },
      //         url: { type: String, trim: true, required: true }
      //       }
      //     ]
      //   },

      //   support_email: {
      //     type: String,
      //     default: null
      //   },

      //   support_phone: {
      //     type: String,
      //     default: null
      //   },

      //   form: {
      //     type: {
      //       id: {
      //         type: String,
      //         default: null
      //       },

      //       background: {
      //         type: String,
      //         default: "#FFFFFF"
      //       },

      //       font: {
      //         type: String,
      //         default: "Roboto"
      //       },

      //       fontcolor: {
      //         type: String,
      //         default: "#000000"
      //       }
      //     }
      //   }
      // }
    },
    { timestamps: true }
  );

  constructor(
    public tenantId: Types.ObjectId | string,
    public name: string,
    public status: LenderStatus = LenderStatus.NEW
  ) {
    super();
  }

  public addressId: Types.ObjectId | null = null;
  public cacNumber: string | null = null;
  public verificationReason: string | null = null;
  public logo: string | null = null;
  public isVerified: boolean = false;
  public address?: Address;
  public _doc: Lender;
}

export type HydratedLenderDocument = HydratedDocument<Lender, ILenderMethods>;

export interface ILenderMethods {}

export type LenderModel = Model<Lender, object, ILenderMethods>;
