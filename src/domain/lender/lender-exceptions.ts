import { Exception } from "@shared-kernel/exception";
import { ExceptionType } from "@shared-kernel/exception-type";

export class LenderExceptions {
  public static readonly NotFound = Exception.NotFound(
    "Lender.NotFound",
    "Failed to locate lender account"
  );

  public static readonly InvalidLenderID = new Exception(
    ExceptionType.Validation,
    "Lender.InvalidLenderID",
    "Invalid Lender ID"
  );

  public static readonly AlreadyVerified = Exception.Conflict(
    "Lender.AlreadyVerified",
    "Lender has already been verified and cannot be onboarded again."
  );

  public static readonly AlreadyOnboarding = Exception.Conflict(
    "Lender.OnboardingInProgress",
    "An onboarding process has already been initiated for lender."
  );

  public static readonly DuplicateName = (name: string) =>
    Exception.Conflict("Lender.DuplicateName", `A Lender with name ${name} already exists.`);

  public static readonly DuplicateEmail = Exception.Conflict(
    "Lender.DuplicateEmail",
    "A Lender with this email address already exists."
  );

  public static readonly InvalidApiKey = Exception.Conflict(
    "Lender.InvalidApiKey",
    "The provided api key is invalid."
  );
}
