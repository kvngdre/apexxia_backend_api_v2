import { ClientSession } from "mongoose";
import { injectable } from "tsyringe";
import { HydratedLenderDocument, ILenderRepository, Lender } from "@domain/lender";
import { ApplicationDbContext } from "@infrastructure/database";

@injectable()
export class LenderRepository implements ILenderRepository {
  constructor(private readonly _dbContext: ApplicationDbContext) {}

  public async findById(
    tenantId: string,
    lenderId: string
  ): Promise<HydratedLenderDocument | null> {
    return (await this._dbContext.lenders(tenantId)).findById(lenderId);
  }

  public async find(tenantId: string): Promise<HydratedLenderDocument[]> {
    return (await this._dbContext.lenders(tenantId)).find();
  }

  public async insert(
    tenantId: string,
    lender: Lender,
    options?: { session: ClientSession }
  ): Promise<HydratedLenderDocument> {
    const [newLender] = await (await this._dbContext.lenders(tenantId)).create([lender], options);
    return newLender!;
  }

  public async update(
    lender: HydratedLenderDocument,
    changes: Partial<Lender> = {},
    options?: { session: ClientSession }
  ): Promise<HydratedLenderDocument> {
    return lender.updateOne(Object.assign({ ...Lender, _id: undefined }, changes), {
      new: true,
      session: options?.session
    });
  }

  public async delete(
    lender: HydratedLenderDocument,
    options?: { session: ClientSession }
  ): Promise<void> {
    await lender.deleteOne({ session: options?.session });
  }
}
