import { HydratedDocument, Model, Schema, Types } from "mongoose";
import { Entity } from "@shared-kernel/entity";
import { Lender } from "@domain/lender";

export class User extends Entity {
  public static readonly collectionName: string = "User";

  public static readonly schema = new Schema<User, UserModel, IUserMethods>(
    {
      lenderId: {
        type: Schema.Types.ObjectId,
        ref: Lender.collectionName,
        required: true
      },

      avatar: {
        type: String,
        default: "http://random.img"
      },

      firstName: {
        type: String,
        trim: true,
        required: true
      },

      lastName: {
        type: String,
        trim: true,
        required: true
      },

      displayName: {
        type: String,
        trim: true,
        default(this: User) {
          return `${this.firstName} ${this.lastName}`;
        }
      },

      jobTitle: {
        type: String,
        default: null
      },

      email: {
        type: String,
        lowercase: true,
        trim: true,
        unique: true,
        required: true
      },

      isEmailVerified: {
        type: Boolean,
        default: false
      },

      hashedPassword: {
        type: String,
        required: true
      },

      isTemporaryPassword: {
        type: Boolean,
        default: true
      }

      //   role: {
      //     type: Schema.Types.ObjectId,
      //     ref: "Role",
      //     required: true,
      //   },

      //   status: {
      //     type: String,
      //     default: userStatus.PENDING
      //   },
    },
    { timestamps: true }
  );

  constructor(
    public lenderId: Types.ObjectId,
    public firstName: string,
    public lastName: string,
    public email: string,
    public hashedPassword: string
  ) {
    super();
    this.displayName = `${this.firstName} ${this.lastName}`;
  }

  public isTemporaryPassword: boolean = true;
  public avatar: string = "";
  public jobTitle: string | null = null;
  public isEmailVerified: boolean = false;
  public displayName: string;
  public _doc: User;
}

User.schema.virtual("fullName").get(function (this: User) {
  return `${this.firstName} ${this.lastName}`;
});

// Ensure virtual fields are included in JSON output
User.schema.set("toJSON", { virtuals: true });
User.schema.set("toObject", { virtuals: true });

export type HydratedUserDocument = HydratedDocument<User, IUserMethods>;

export interface IUserMethods {}

export type UserModel = Model<User, object, IUserMethods>;
