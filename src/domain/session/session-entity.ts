import { HydratedDocument, Model, Schema, Types } from "mongoose";
import { User } from "@domain/user";
import { Entity } from "@shared-kernel/entity";

export class Session extends Entity {
  public static readonly collectionName = "Session";

  public static readonly schema = new Schema<Session, SessionModel, ISessionMethods>(
    {
      userId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: User.collectionName,
        unique: true
      },

      hashedToken: {
        type: String,
        required: true
      },

      lastLoginDateTime: {
        type: Date,
        default: null
      },

      expiresAt: {
        type: Date,
        required: true
      },

      createdAt: Date,

      updatedAt: Date
    },
    { timestamps: true }
  );

  constructor(
    public userId: Types.ObjectId,
    public hashedToken: string,
    public expiresAt: Date
  ) {
    super();
  }

  public lastLoginDateTime: Date | null = new Date();
  public user?: User;
  public _doc: Session = this;
}

Session.schema.methods.isExpired = function () {
  const expirationInMilliseconds = new Date(this.expiresAt).getTime();

  return Date.now() > expirationInMilliseconds;
};

export type HydratedSessionDocument = HydratedDocument<Session, ISessionMethods>;

export interface ISessionMethods {
  isExpired(): boolean;
}

export type SessionModel = Model<Session, object, ISessionMethods>;
