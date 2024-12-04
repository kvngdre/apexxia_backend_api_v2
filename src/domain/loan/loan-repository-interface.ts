import { ClientSession, Types } from "mongoose";
import { HydratedLoanDocument, Loan } from "./loan-entity";

export interface ILoanRepository {
  findById(tenantId: Types.ObjectId | string, loanId: string): Promise<HydratedLoanDocument | null>;
  find(tenantId: Types.ObjectId | string): Promise<HydratedLoanDocument[]>;
  insert(
    tenantId: Types.ObjectId | string,
    loan: Loan,
    options?: { session: ClientSession }
  ): Promise<HydratedLoanDocument>;
  update(
    loan: HydratedLoanDocument,
    changes?: Partial<Loan>,
    options?: { session: ClientSession }
  ): Promise<HydratedLoanDocument>;
  delete(loan: HydratedLoanDocument, options?: { session: ClientSession }): Promise<void>;
}
