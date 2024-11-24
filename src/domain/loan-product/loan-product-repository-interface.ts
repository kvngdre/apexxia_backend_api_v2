import { ClientSession, Types } from "mongoose";
import { HydratedLoanProductDocument, LoanProduct } from "./loan-product-entity";

export interface ILoanProductRepository {
  findById(
    tenantId: Types.ObjectId | string,
    loanProductId: string
  ): Promise<HydratedLoanProductDocument | null>;
  find(tenantId: Types.ObjectId | string): Promise<HydratedLoanProductDocument[]>;
  insert(
    tenantId: Types.ObjectId | string,
    loanProduct: LoanProduct,
    options?: { session: ClientSession }
  ): Promise<HydratedLoanProductDocument>;
  update(
    loanProduct: HydratedLoanProductDocument,
    changes?: Partial<LoanProduct>,
    options?: { session: ClientSession }
  ): Promise<HydratedLoanProductDocument>;
  delete(
    loanProduct: HydratedLoanProductDocument,
    options?: { session: ClientSession }
  ): Promise<void>;
  isNameUnique(tenantId: string, name: string): Promise<boolean>;
}
