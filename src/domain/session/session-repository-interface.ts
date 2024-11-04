import { ClientSession, Types } from "mongoose";
import { HydratedSessionDocument, Session } from "./session-entity";

export interface ISessionRepository {
  findById(
    tenantId: Types.ObjectId | string,
    sessionId: Types.ObjectId | string
  ): Promise<HydratedSessionDocument | null>;
  findByToken(
    tenantId: Types.ObjectId | string,
    token: string
  ): Promise<HydratedSessionDocument | null>;
  findByUserId(
    tenantId: Types.ObjectId | string,
    userId: Types.ObjectId | string
  ): Promise<HydratedSessionDocument | null>;
  find(tenantId: Types.ObjectId | string): Promise<HydratedSessionDocument[]>;
  insert(
    tenantId: Types.ObjectId | string,
    session: Session,
    options?: { session: ClientSession }
  ): Promise<HydratedSessionDocument>;
  update(
    session: HydratedSessionDocument,
    changes?: Partial<Session>,
    options?: { session: ClientSession }
  ): Promise<HydratedSessionDocument>;
  upsertByUserId(
    tenantId: Types.ObjectId | string,
    session: Session,
    changes?: Partial<Session>,
    options?: { session: ClientSession }
  ): Promise<HydratedSessionDocument>;
  delete(session: Session): Promise<void>;
  isUserIdUnique(tenantId: Types.ObjectId | string, userId: string): Promise<boolean>;
}
