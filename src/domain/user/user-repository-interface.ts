import { ClientSession, Types } from "mongoose";
import { HydratedUserDocument, User } from "./user-entity";

export interface IUserRepository {
  findById(lenderId: Types.ObjectId | string, userId: string): Promise<HydratedUserDocument | null>;
  findByEmail(
    lenderId: Types.ObjectId | string,
    email: string,
    options?: { session?: ClientSession }
  ): Promise<HydratedUserDocument | null>;
  find(lenderId: Types.ObjectId | string): Promise<HydratedUserDocument[]>;
  insert(
    lenderId: Types.ObjectId | string,
    user: User,
    options?: { session: ClientSession }
  ): Promise<HydratedUserDocument>;
  update(
    user: HydratedUserDocument,
    changes?: Partial<User>,
    options?: { session: ClientSession }
  ): Promise<HydratedUserDocument>;
  delete(user: HydratedUserDocument, options?: { session: ClientSession }): Promise<void>;
}
