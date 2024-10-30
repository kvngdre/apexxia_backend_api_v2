import { Types, Schema } from "mongoose";

export abstract class Entity {
  public static collectionName: string;
  public static schema: Schema;
  public readonly _id: Types.ObjectId = new Types.ObjectId();
  public readonly id: string = this._id.toString();
  public createdAt: Date = new Date();
  public updatedAt: Date = new Date();
}
