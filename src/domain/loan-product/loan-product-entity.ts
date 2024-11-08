import { HydratedDocument, Schema, Types, Model } from "mongoose";
import { Lender } from "@domain/lender";
import { Entity } from "@shared-kernel/entity";
import { Fee, FeeTypeEnum } from "./fee";

export class LoanProduct extends Entity {
  public static readonly collectionName = "Loan_Product";

  public static readonly schema = new Schema<LoanProduct, LoanProductModel, ILoanProductMethods>(
    {
      lenderId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: Lender.collectionName
      },

      name: {
        type: String,
        unique: true,
        required: true
      },

      isActive: {
        type: Boolean,
        default: false
      },

      minLoanAmount: {
        type: Number,
        required: true
      },

      maxLoanAmount: {
        type: Number,
        required: true
      },

      minTenureInMonths: {
        type: Number,
        default: 1
      },

      maxTenureInMonths: {
        type: Number,
        default: 12
      },

      upfrontFee: {
        type: Number,
        default: 0
      },

      maxDTIInPercentage: { type: Number, default: 33 },

      interestRateInPercentage: {
        type: Number,
        required: true
      },

      fees: {
        type: [
          {
            name: { type: String, required: true },
            value: { type: Number, required: true },
            type: { type: String, required: true, enum: FeeTypeEnum }
          }
        ],
        default: function (this: LoanProduct) {
          return [];
        }
      },

      minIncome: {
        type: Number,
        default: 0
      },

      maxIncome: {
        type: Number,
        default: 1_000_000
      },

      minAge: {
        type: Number,
        default: 18
      },

      maxAge: {
        type: Number,
        default: 60
      },

      createdAt: Date,

      updatedAt: Date
    },
    { timestamps: true }
  );

  constructor(
    public lenderId: Types.ObjectId | string,
    public name: string,
    public minLoanAmount: number,
    public maxLoanAmount: number,
    public interestRateInPercentage: number,
    public isActive: boolean = false,
    public upfrontFee: number = 0,
    public maxDTIInPercentage: number = 33,
    public minTenureInMonths: number = 1,
    public maxTenureInMonths: number = 12,
    public minIncome: number = 0,
    public maxIncome: number = 1_000_000,
    public minAge: number = 18,
    public maxAge: number = 60,
    public fees: Fee[] = []
  ) {
    super();
  }

  public _doc: LoanProduct;
}

export type HydratedLoanProductDocument = HydratedDocument<LoanProduct, ILoanProductMethods>;

export interface ILoanProductMethods {}

export type LoanProductModel = Model<LoanProduct, object, ILoanProductMethods>;
