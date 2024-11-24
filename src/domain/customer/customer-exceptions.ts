import { Exception } from "@shared-kernel/exception";

export class CustomerExceptions {
  public static readonly NotFound = Exception.NotFound("Customer.NotFound", "Customer not found");

  public static readonly DuplicateBVN = Exception.Conflict(
    "Customer.DuplicateBVN",
    "Customer with the provided BVN already exists."
  );

  public static readonly DuplicatePhone = Exception.Conflict(
    "Customer.DuplicatePhone",
    "Customer with the provided phone number already exists."
  );

  public static readonly DuplicateIdNumber = Exception.Conflict(
    "Customer.DuplicateIdNumber",
    "Customer with the provided id number already exists."
  );
}
