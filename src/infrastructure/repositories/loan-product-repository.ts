import { ClientSession } from "mongoose";
import { injectable } from "tsyringe";
import {
  HydratedLoanProductDocument,
  ILoanProductRepository,
  LoanProduct
} from "@domain/loan-product";
import { ApplicationDbContext } from "@infrastructure/database";

@injectable()
export class LoanProductRepository implements ILoanProductRepository {
  constructor(private readonly _dbContext: ApplicationDbContext) {}

  public async findById(tenantId: string, loanProductId: string) {
    return (await this._dbContext.loanProducts(tenantId)).findById(loanProductId);
  }

  public async findByToken(tenantId: string, token: string) {
    return (await this._dbContext.loanProducts(tenantId)).findOne({ token });
  }

  public readonly findByUserId = async (tenantId: string, userId: string) => {
    return (await this._dbContext.loanProducts(tenantId)).findOne({ userId });
  };

  public async find(tenantId: string): Promise<HydratedLoanProductDocument[]> {
    return (await this._dbContext.loanProducts(tenantId)).find().sort({ createdAt: -1 });
  }

  public async insert(
    tenantId: string,
    loanProduct: LoanProduct,
    options?: { session: ClientSession }
  ) {
    const [newLoanProduct] = await (
      await this._dbContext.loanProducts(tenantId)
    ).create([loanProduct], options);

    return newLoanProduct!;
  }

  public async update(
    loanProduct: HydratedLoanProductDocument,
    changes: Partial<LoanProduct> = {},
    options?: { session: ClientSession }
  ): Promise<HydratedLoanProductDocument> {
    return loanProduct.updateOne(Object.assign({ ...loanProduct._doc, _id: undefined }, changes), {
      new: true,
      loanProduct: options?.session
    });
  }

  public async delete(loanProduct: HydratedLoanProductDocument) {
    await loanProduct.deleteOne();
  }

  public async isNameUnique(tenantId: string, name: string) {
    const matches = await (await this._dbContext.loanProducts(tenantId)).find({ name });

    return matches.length < 1;
  }
}
