import { HydratedDocument, Model, Schema } from "mongoose";
import { Entity } from "@shared-kernel/entity";

export class Address extends Entity {
  public static readonly collectionName: string = "Address";

  public static readonly schema = new Schema<Address, AddressModel, IAddressMethods>(
    {
      // * A custom label or name for the address.
      label: {
        type: String,
        default: null
      },

      // The first line of the street address (e.g., "123 Main Street").
      addressLine1: {
        type: String,
        required: true
      },

      // The second line of the street address (for apartment or suite numbers).
      addressLine2: {
        type: String,
        default: null
      },

      city: {
        type: String,
        required: true
      },

      state: {
        type: String,
        required: true
      },

      country: {
        type: String,
        default: "Nigeria"
      },

      fullAddress: {
        type: String,
        default: function (this: Address) {
          return `${this.addressLine1} ${this.addressLine2 || ""}, ${this.city}, ${this.state}, ${this.country}`;
        }
      },

      latitude: {
        type: Number,
        required: true
      },

      longitude: {
        type: Number,
        required: true
      }
    },
    { timestamps: true }
  );

  constructor(
    public addressLine1: string,
    public city: string,
    public state: string,
    public latitude: number,
    public longitude: number,
    public addressLine2: string | null = null,
    public label: string | null = null
  ) {
    super();
    this.fullAddress = `${addressLine1} ${addressLine2 ? addressLine2 : ""}, ${city}, ${state}, ${this.country}`;
  }

  public fullAddress: string;
  public country: string = "Nigeria";
  public _doc: Address;
}

export type HydratedAddressDocument = HydratedDocument<Address, IAddressMethods>;

export interface IAddressMethods {}

export type AddressModel = Model<Address, object, IAddressMethods>;
