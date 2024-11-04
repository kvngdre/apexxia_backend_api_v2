import { inject, injectable } from "tsyringe";
import { sign, verify, type SignOptions, type JwtPayload, JsonWebTokenError } from "jsonwebtoken";
import { IJwtService, IJwtServiceOptions } from "@application/abstractions/services";
import { ILogger } from "@application/abstractions/logging";

@injectable()
export class JwtService implements IJwtService {
  private readonly _secreteKey = process.env.JWT_SECRET_KEY;
  private readonly _tokenExpirationTimeInMilliseconds = process.env.JWT_EXPIRATION_IN_MS.toString();
  private readonly _issuer = process.env.JWT_ISSUER;
  private readonly _audience = process.env.JWT_AUDIENCE;

  constructor(@inject("Logger") private readonly _logger: ILogger) {
    if (!this._tokenExpirationTimeInMilliseconds) {
      throw new Error("Missing required arguments");
    }
  }

  public readonly generateToken = (
    payload: JwtPayload,
    options: IJwtServiceOptions = {}
  ): { token: string; expiresAt: number } => {
    const signingOptions: SignOptions = Object.assign(
      {
        issuer: this._issuer,
        audience: this._audience,
        expiresIn: this._tokenExpirationTimeInMilliseconds
      },
      options
    );

    const secretKey = options.secret ? options.secret : this._secreteKey;

    return {
      token: sign(payload, secretKey, signingOptions),
      expiresAt: Date.now() + Number(this._tokenExpirationTimeInMilliseconds)
    };
  };

  public readonly decodeToken = (
    token: string,
    secret: string | null = null
  ): JwtPayload | null => {
    const secretKey = !secret ? this._secreteKey : secret;

    try {
      const decoded = verify(token, secretKey, {
        issuer: this._issuer,
        audience: this._audience
      });

      return decoded as JwtPayload;
    } catch (error) {
      if (error instanceof JsonWebTokenError) {
        this._logger.logDebug(error.message, error.stack);
      }

      return null;
    }
  };
}
