import { Exception } from "@shared-kernel/exception";
import { ExceptionType } from "@shared-kernel/exception-type";

export class LoanExceptions {
  public static readonly NotFound = Exception.NotFound("Loan.NotFound", "Loan not found");

  public static readonly InvalidLoanID = new Exception(
    ExceptionType.Validation,
    "Loan.InvalidLoanID",
    "Invalid Loan ID"
  );

  public static readonly LoanAmountExceedsMaximum = (maxAmount: number) =>
    new Exception(
      ExceptionType.Validation,
      "Loan.Amount.ExceedsMax",
      `Loan amount must be less than or equal to ${maxAmount.toLocaleString("EN")}`
    );

  public static readonly LoanAmountBelowMinimum = (minAmount: number) =>
    new Exception(
      ExceptionType.Validation,
      "Loan.Amount.BelowMin",
      `Loan amount cannot be less than ${minAmount}`
    );

  public static readonly LoanTenureExceedsMaximum = (maxTenure: number) =>
    new Exception(
      ExceptionType.Validation,
      "Loan.Tenure.ExceedsMax",
      `Loan tenure must be less than or equal to ${maxTenure} months.`
    );

  public static readonly LoanTenureBelowMinimum = (minTenure: number) =>
    new Exception(
      ExceptionType.Validation,
      "Loan.Tenure.BelowMin",
      `Loan tenure cannot be less than ${minTenure} months.`
    );

  public static readonly DTIGreaterThanMaximum = (maxDTI: number) =>
    new Exception(
      ExceptionType.Validation,
      "Loan.DTI.ExceedsMax",
      `Debt To Income ratio must be less than or equal to ${maxDTI}%.`
    );
}
