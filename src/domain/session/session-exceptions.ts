import { Exception } from "@shared-kernel/exception";

export class SessionExceptions {
  public static readonly NotFound = Exception.NotFound(
    "Session.NotFound",
    "User session not found"
  );

  public static readonly DuplicateUserId = Exception.Conflict(
    "Session.DuplicateUserId",
    "Session with the user id already exists"
  );
}
