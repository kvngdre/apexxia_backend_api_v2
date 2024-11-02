import { Exception } from "@shared-kernel/exception";
import { ExceptionType } from "@shared-kernel/exception-type";

export class TenantExceptions {
  public static readonly NotFound = (identifier: string) =>
    Exception.NotFound(
      "Tenant.NotFound",
      `Failed to find tenant with the given identifier '${identifier}'.`
    );

  public static readonly InvalidTenantID = new Exception(
    ExceptionType.Validation,
    "Tenant.InvalidTenantID",
    "Invalid tenant ID"
  );

  public static readonly AlreadyVerified = Exception.Conflict(
    "Tenant.AlreadyVerified",
    "The tenant has already been verified."
  );

  public static readonly DuplicateName = (name: string) =>
    Exception.Conflict("Tenant.DuplicateName", `A tenant with name ${name} already exists.`);

  public static readonly DuplicateEmail = Exception.Conflict(
    "Tenant.DuplicateEmail",
    "A tenant with this email address already exists."
  );

  public static readonly InvalidApiKey = Exception.Conflict(
    "Tenant.InvalidApiKey",
    "The provided api key is invalid."
  );
}
