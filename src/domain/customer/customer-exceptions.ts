import { Exception } from "@shared-kernel/exception";
import { ExceptionType } from "@shared-kernel/exception-type";

export class CustomerExceptions {
  public static readonly NotFound = Exception.NotFound("Customer.NotFound", "Customer not found");

  public static readonly DuplicateAccountNumber = Exception.Conflict(
    "Customer.DuplicateAccountNumber",
    "A customer with the provided account number already exists."
  );

  public static readonly DuplicateBVN = Exception.Conflict(
    "Customer.DuplicateBVN",
    "A customer with the provided BVN already exists."
  );

  public static readonly DuplicatePhone = Exception.Conflict(
    "Customer.DuplicatePhone",
    "A customer with the provided phone number already exists."
  );

  public static readonly DuplicateIdNumber = Exception.Conflict(
    "Customer.DuplicateIdNumber",
    "A customer with the provided id number already exists."
  );

  public static readonly IncomeBelowMinimum = (minIncome: number) =>
    Exception.Conflict(
      "Customer.IncomeBelowMinimum",
      `A customer with the provided id number already exists.`
    );

  public static readonly IncomeExceedsMaximum = (maxIncome: number) =>
    new Exception(
      ExceptionType.Validation,
      "Customer.IncomeExceedsMaximum",
      `Customer income exceeds the maximum allowed income of ${maxIncome.toLocaleString()}.`
    );
}
