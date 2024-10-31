import { ClientSession } from "mongoose";
import { injectable } from "tsyringe";
import { HydratedLenderDocument, ILenderRepository, Lender } from "@domain/lenders";
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
    Lender: HydratedLenderDocument,
    changes: Partial<Lender> = {},
    options?: { session: ClientSession }
  ): Promise<HydratedLenderDocument> {
    return Lender.updateOne(Object.assign({ ...Lender, _id: undefined }, changes), {
      new: true,
      session: options?.session
    });
  }

  public async delete(Lender: HydratedLenderDocument): Promise<void> {
    Lender.deleteOne();
  }
}
