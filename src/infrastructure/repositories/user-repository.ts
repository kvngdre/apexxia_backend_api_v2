import { ClientSession } from "mongoose";
import { injectable } from "tsyringe";
import { HydratedUserDocument, IUserRepository, User } from "@domain/users";
import { ApplicationDbContext } from "@infrastructure/database/application-db-context";

@injectable()
export class UserRepository implements IUserRepository {
  constructor(private readonly _dbContext: ApplicationDbContext) {}

  public async findById(tenantId: string, userId: string): Promise<HydratedUserDocument | null> {
    return (await this._dbContext.users(tenantId)).findById(userId);
  }

  public async find(tenantId: string): Promise<HydratedUserDocument[]> {
    return (await this._dbContext.users(tenantId)).find();
  }

  public async insert(
    tenantId: string,
    user: User,
    options?: { session: ClientSession }
  ): Promise<HydratedUserDocument> {
    const [newUser] = await (await this._dbContext.users(tenantId)).create([user], options);
    return newUser!;
  }

  public async update(
    User: HydratedUserDocument,
    changes: Partial<User> = {},
    options?: { session: ClientSession }
  ): Promise<HydratedUserDocument> {
    return User.updateOne(Object.assign({ ...User, _id: undefined }, changes), {
      new: true,
      session: options?.session
    });
  }

  public async delete(User: HydratedUserDocument): Promise<void> {
    User.deleteOne();
  }
}
