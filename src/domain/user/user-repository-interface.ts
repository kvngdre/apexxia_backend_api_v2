import { ClientSession, Types } from "mongoose";
import { HydratedUserDocument, User } from "./user-entity";

export interface IUserRepository {
  findById(tenantId: Types.ObjectId | string, userId: string): Promise<HydratedUserDocument | null>;
  findByEmail(
    tenantId: Types.ObjectId | string,
    email: string
  ): Promise<HydratedUserDocument | null>;
  find(tenantId: Types.ObjectId | string): Promise<HydratedUserDocument[]>;
  insert(
    tenantId: Types.ObjectId | string,
    user: User,
    options?: { session: ClientSession }
  ): Promise<HydratedUserDocument>;
  update(
    user: HydratedUserDocument,
    changes?: Partial<User>,
    options?: { session: ClientSession }
  ): Promise<HydratedUserDocument>;
  delete(user: HydratedUserDocument): Promise<void>;
}
