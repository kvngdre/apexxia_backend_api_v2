import { Exception } from "@shared-kernel/exception";
import { ExceptionType } from "@shared-kernel/exception-type";

export class LoanExceptions {
  public static readonly NotFound = Exception.NotFound("Loan.NotFound", "Loan not found");

  public static readonly InvalidLoanID = new Exception(
    ExceptionType.Validation,
    "Loan.InvalidLoanID",
    "Invalid Loan ID"
  );
}
