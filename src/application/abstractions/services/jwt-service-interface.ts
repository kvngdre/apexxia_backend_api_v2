import { type SignOptions, type JwtPayload } from "jsonwebtoken";

export interface IJwtService {
  generateToken(
    payload: JwtPayload,
    options?: IJwtServiceOptions
  ): { token: string; expiresAt: number };
  decodeToken(token: string, secret?: string | null): JwtPayload | null;
}

export interface IJwtServiceOptions extends SignOptions {
  secret?: string;
}
