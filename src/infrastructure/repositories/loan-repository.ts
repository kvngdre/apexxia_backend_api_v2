import { ClientSession } from "mongoose";
import { injectable } from "tsyringe";
import { ApplicationDbContext } from "@infrastructure/database";
import { HydratedLoanDocument, ILoanRepository, Loan } from "@domain/loan";

@injectable()
export class LoanRepository implements ILoanRepository {
  constructor(private readonly _dbContext: ApplicationDbContext) {}

  public async findById(tenantId: string, loanId: string): Promise<HydratedLoanDocument | null> {
    return (await this._dbContext.loans(tenantId))
      .findById(loanId)
      .populate({ path: "auditTrail", strictPopulate: false });
  }

  public async find(tenantId: string): Promise<HydratedLoanDocument[]> {
    return (await this._dbContext.loans(tenantId))
      .find()
      .populate({ path: "auditTrail", strictPopulate: false });
  }

  public async insert(
    tenantId: string,
    loan: Loan,
    options?: { session: ClientSession }
  ): Promise<HydratedLoanDocument> {
    const [newLoan] = await (await this._dbContext.loans(tenantId)).create([loan], options);
    return newLoan!;
  }

  public async update(
    loan: HydratedLoanDocument,
    changes: Partial<Loan> = {},
    options?: { session: ClientSession }
  ): Promise<HydratedLoanDocument> {
    return loan.updateOne(Object.assign({ ...Loan, _id: undefined }, changes), {
      new: true,
      session: options?.session
    });
  }

  public async delete(
    loan: HydratedLoanDocument,
    options?: { session: ClientSession }
  ): Promise<void> {
    await loan.deleteOne({ session: options?.session });
  }
}
