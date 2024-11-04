import { ClientSession } from "mongoose";
import { injectable } from "tsyringe";
import { HydratedUserDocument, IUserRepository, User } from "@domain/user";
import { ApplicationDbContext } from "@infrastructure/database/application-db-context";

@injectable()
export class UserRepository implements IUserRepository {
  constructor(private readonly _dbContext: ApplicationDbContext) {}

  public async findById(tenantId: string, userId: string): Promise<HydratedUserDocument | null> {
    return (await this._dbContext.users(tenantId)).findById(userId);
  }

  public async findByEmail(
    tenantId: string,
    email: string,
    options?: { session?: ClientSession }
  ): Promise<HydratedUserDocument | null> {
    return (await this._dbContext.users(tenantId)).findOne({ email });
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
    user: HydratedUserDocument,
    changes: Partial<User> = {},
    options?: { session: ClientSession }
  ): Promise<HydratedUserDocument> {
    return user.updateOne(Object.assign({ ...user._doc, _id: undefined }, changes), {
      new: true,
      session: options?.session
    });
  }

  public async delete(User: HydratedUserDocument): Promise<void> {
    User.deleteOne();
  }
}
