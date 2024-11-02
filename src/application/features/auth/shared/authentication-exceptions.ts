import { Exception } from "@shared-kernel/exception";

export class AuthenticationExceptions {
  public static readonly InvalidOrExpiredToken = Exception.Unauthenticated(
    "Auth.InvalidOrExpiredToken",
    "The provided token is either invalid or has expired."
  );

  public static readonly InvalidCredentials = Exception.Unauthenticated(
    "Auth.InvalidCredentials",
    "Invalid email and password combination."
  );

  public static readonly InvalidApiKey = Exception.Unauthenticated(
    "Auth.InvalidAPIKey",
    "The provided API key is not recognized. Please verify your API key and try again."
  );

  public static readonly InvalidCSRFToken = Exception.Unauthenticated(
    "Auth.InvalidCSRFToken",
    "The provided CSRF Token is not recognized."
  );

  public static readonly MissingAuthorizationToken = Exception.Unauthenticated(
    "Auth.MissingAuthorizationToken",
    "The request is missing the required authorization token."
  );

  public static readonly UnsupportedAuthorizationScheme = Exception.Unauthenticated(
    "Auth.UnsupportedAuthorizationScheme",
    "The authorization scheme in the request header is not supported."
  );

  public static readonly MissingOrMalformedAuthToken = Exception.Unauthenticated(
    "Auth.MissingOrMalformedAuthToken",
    "The Authorization header is present, but the token is either missing or malformed."
  );

  public static readonly MissingOrMalformedAPIKey = Exception.Unauthenticated(
    "Auth.MissingOrMalformedAPIKey",
    "The API key is missing or malformed. Please provide a valid API key to proceed."
  );

  public static readonly SessionExpired = Exception.Unauthenticated(
    "Auth.SessionExpired",
    "Session timeout."
  );
}
