import { Exception } from "@shared-kernel/exception";

export class LoanProductExceptions {
  public static readonly NotFound = Exception.NotFound(
    "LoanProduct.NotFound",
    "Loan product not found"
  );

  public static readonly DuplicateName = Exception.Conflict(
    "LoanProduct.DuplicateName",
    "A loan product with that name already exists"
  );
}
