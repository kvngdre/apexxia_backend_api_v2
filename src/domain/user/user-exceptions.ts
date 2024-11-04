import { Exception } from "@shared-kernel/exception";

export class UserExceptions {
  public static readonly NotFound = Exception.NotFound("User.NotFound", "User account not found");

  public static readonly AlreadyVerified = Exception.Conflict(
    "User.AlreadyVerified",
    "The user email has already been verified."
  );

  public static readonly DuplicateEmail = Exception.Conflict(
    "User.DuplicateEmail",
    "Email address is already in use."
  );

  public static readonly InvalidPassword = Exception.Conflict(
    "User.InvalidPassword",
    "The password you entered is not valid."
  );

  public static readonly PasswordExists = Exception.Conflict(
    "User.PasswordExists",
    "Password exists and cannot be set. Please use change password to update your existing password."
  );

  public static readonly TemporaryPassword = Exception.Unauthorized(
    "User.TemporaryPassword",
    "Password reset is required to continue."
  );
}
