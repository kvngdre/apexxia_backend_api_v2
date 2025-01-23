import { ClientSession } from "mongoose";
import { injectable } from "tsyringe";
import { HydratedUserDocument, IUserRepository, User } from "@domain/user";
import { ApplicationDbContext } from "@infrastructure/database/application-db-context";

@injectable()
export class UserRepository implements IUserRepository {
  constructor(private readonly _dbContext: ApplicationDbContext) {}

  public async findById(lenderId: string, userId: string): Promise<HydratedUserDocument | null> {
    return (await this._dbContext.users(lenderId)).findById(userId);
  }

  public async findByEmail(
    lenderId: string,
    email: string,
    options?: { session?: ClientSession }
  ): Promise<HydratedUserDocument | null> {
    return (await this._dbContext.users(lenderId)).findOne({ email });
  }

  public async find(lenderId: string): Promise<HydratedUserDocument[]> {
    return (await this._dbContext.users(lenderId)).find();
  }

  public async insert(
    lenderId: string,
    user: User,
    options?: { session: ClientSession }
  ): Promise<HydratedUserDocument> {
    const [newUser] = await (await this._dbContext.users(lenderId)).create([user], options);
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

  public async delete(
    user: HydratedUserDocument,
    options?: { session: ClientSession }
  ): Promise<void> {
    await user.deleteOne({ session: options?.session });
  }
}
