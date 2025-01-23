import { HydratedDocument, Model, Schema, Types } from "mongoose";
import { Entity } from "@shared-kernel/entity";
import { Lender } from "@domain/lender";
import { MaritalStatus } from "./marital-status-enum";
import { Address } from "@domain/address/address-entity";
import { IdType } from "./id-type-enum";
import { Gender } from "./gender-enum";
import { INextOfKin } from "./next-of-kin-interface";

export class Customer extends Entity {
  public static readonly collectionName: string = "Customer";

  public static readonly schema = new Schema<Customer, CustomerModel, ICustomerMethods>(
    {
      lenderId: {
        type: Schema.Types.ObjectId,
        ref: Lender.collectionName,
        required: true
      },

      passportPicture: {
        type: String,
        default: null
      },

      firstName: {
        type: String,
        trim: true,
        required: true
      },

      middleName: {
        type: String,
        trim: true,
        default: null
      },

      lastName: {
        type: String,
        trim: true,
        required: true
      },

      gender: {
        type: String,
        enum: Gender,
        required: true
      },

      dateOfBirth: {
        type: Date,
        required: true
      },

      residentialAddressId: {
        type: Schema.Types.ObjectId,
        ref: Address.collectionName,
        required: true
      },

      phone: {
        type: String,
        // unique: true,
        required: true
      },

      email: {
        type: String,
        default: null
      },

      maritalStatus: {
        type: String,
        enum: MaritalStatus,
        required: true
      },

      bvn: {
        type: Number,
        unique: true,
        required: true
      },

      idType: {
        type: String,
        enum: IdType,
        required: true
      },

      idNumber: {
        type: String,
        unique: true,
        required: true
      },

      idExpiration: {
        type: Date,
        required: true
      },

      //   segment: {
      //     type: Schema.Types.ObjectId,
      //     ref: "Segment",
      //     required: true
      //   },

      //   segmentId: {
      //     type: String,
      //     uppercase: true,
      //     trim: true,
      //     required: true
      //   },

      //   command: {
      //     type: String,
      //     trim: true,
      //     default: null
      //   },

      //   dateOfEnlistment: {
      //     type: Date,
      //     required: true
      //   },

      income: {
        type: Number,
        required: true
      },

      nextOfKin: {
        type: {
          name: { type: String, required: true },
          relationship: { type: String, required: true },
          address: { type: String, required: true },
          phone: { type: String, required: true }
        },
        required: true
      },

      accountName: {
        type: String,
        required: true
      },

      accountNumber: {
        type: String,
        unique: true,
        required: true
      },

      bank: {
        type: String,
        required: true
      }
    },
    { timestamps: true }
  );

  constructor(
    public lenderId: Types.ObjectId | string,
    public firstName: string,
    public middleName: string | null,
    public lastName: string,
    public gender: Gender,
    public dateOfBirth: Date,
    public residentialAddressId: Types.ObjectId | string,
    public phone: string,
    public email: string,
    public maritalStatus: MaritalStatus,
    public bvn: number,
    public idType: IdType,
    public idNumber: string,
    public idExpiration: Date,
    public nextOfKin: INextOfKin,
    public income: number,
    public accountName: string,
    public accountNumber: string,
    public bank: string
  ) {
    super();
    this.fullName = `${this.firstName} ${this.middleName ? this.middleName : ""} ${this.lastName}`;
  }

  public passportPicture: string | null = null;
  //   public isPhoneVerified: boolean = false;
  public fullName: string;
  public lender?: Lender;
  public residentialAddress?: Address;
  public _doc: Customer;
}

Customer.schema.virtual("fullName").get(function (this: Customer) {
  return `${this.firstName} ${this.middleName ? this.middleName : ""} ${this.lastName}`;
});

// Ensure virtual fields are included in JSON output
Customer.schema.set("toJSON", { virtuals: true });
Customer.schema.set("toObject", { virtuals: true });

export type HydratedCustomerDocument = HydratedDocument<Customer, ICustomerMethods>;

export interface ICustomerMethods {}

export type CustomerModel = Model<Customer, object, ICustomerMethods>;
