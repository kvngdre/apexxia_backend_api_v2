import { ClientSession } from "mongoose";
import { injectable } from "tsyringe";
import { HydratedSessionDocument, ISessionRepository, Session } from "@domain/session";
import { ApplicationDbContext } from "@infrastructure/database";

@injectable()
export class SessionRepository implements ISessionRepository {
  constructor(private readonly _dbContext: ApplicationDbContext) {}

  public async findById(tenantId: string, sessionId: string) {
    return (await this._dbContext.sessions(tenantId)).findById(sessionId);
  }

  public async findByToken(tenantId: string, token: string) {
    return (await this._dbContext.sessions(tenantId)).findOne({ token });
  }

  public readonly findByUserId = async (tenantId: string, userId: string) => {
    return (await this._dbContext.sessions(tenantId)).findOne({ userId });
  };

  public async find(tenantId: string): Promise<HydratedSessionDocument[]> {
    return (await this._dbContext.sessions(tenantId)).find().sort({ createdAt: -1 });
  }

  public async insert(tenantId: string, session: Session, options?: { session: ClientSession }) {
    const [newSession] = await (
      await this._dbContext.sessions(tenantId)
    ).create([session], options);

    return newSession!;
  }

  public async update(
    session: HydratedSessionDocument,
    changes: Partial<Session> = {},
    options?: { session: ClientSession }
  ): Promise<HydratedSessionDocument> {
    return session.updateOne(Object.assign({ ...session._doc, _id: undefined }, changes), {
      new: true,
      session: options?.session
    });
  }

  public async upsertByUserId(
    tenantId: string,
    session: Session,
    changes: Partial<Session> = {},
    options?: { session: ClientSession }
  ) {
    return (await this._dbContext.sessions(tenantId)).findOneAndUpdate(
      { userId: session.userId },
      Object.assign({ ...session._doc, _id: undefined }, changes),
      {
        upsert: true,
        new: true,
        session: options?.session
      }
    );
  }

  public async delete(session: HydratedSessionDocument) {
    await session.deleteOne();
  }

  public async isUserIdUnique(tenantId: string, userId: string) {
    const matches = await (await this._dbContext.sessions(tenantId)).find({ userId });

    return matches.length < 1;
  }
}
