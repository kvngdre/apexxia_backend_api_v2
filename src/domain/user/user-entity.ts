import { HydratedDocument, Model, Schema, Types } from "mongoose";
import { Entity } from "@shared-kernel/entity";
import { UserStatus } from "./user-status-enum";
import { Lender } from "@domain/lender";
// import { UserRole } from "./user-role-enum";

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
        required: true
      },

      lastName: {
        type: String,
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
      },

      // role: {
      //   type: [String],
      //   required: true
      // }

      status: {
        type: String,
        enum: UserStatus,
        default: UserStatus.NEW
      }
    },
    { timestamps: true }
  );

  constructor(
    public lenderId: Types.ObjectId | string,
    public firstName: string,
    public lastName: string,
    public email: string,
    public hashedPassword: string,
    public status: UserStatus = UserStatus.NEW
    // public roles: UserRole[]
  ) {
    super();
    this.displayName = `${this.firstName} ${this.lastName}`;
    this.fullName = `${this.firstName} ${this.lastName}`;
  }

  public isTemporaryPassword: boolean = true;
  public avatar: string = "http://random.img";
  public jobTitle: string | null = null;
  public isEmailVerified: boolean = false;
  public displayName: string;
  public fullName: string;
  public lender?: Lender;
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
