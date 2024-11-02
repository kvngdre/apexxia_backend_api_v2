import { type SignOptions, type JwtPayload } from "jsonwebtoken";

export interface IJwtService {
  generateToken(payload: JwtPayload, options?: IJwtServiceOptions): string;
  decodeToken(token: string, secret?: string | null): JwtPayload | null;
}

export interface IJwtServiceOptions extends SignOptions {
  secret?: string;
}
