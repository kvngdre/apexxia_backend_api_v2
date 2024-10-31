import { Types } from "mongoose";
import { User } from "@domain/users/user-entity";

export class AuthenticationResponseDto {
  private constructor(
    public readonly id: string,
    public readonly tenantId: string,
    public readonly lenderId: string,
    public readonly displayName: string,
    public readonly email: string,
    public readonly isEmailVerified: boolean,
    // public readonly role: string,
    public readonly token?: string
  ) {}

  public static from(user: User, tenantId: Types.ObjectId | string, token?: string) {
    return new AuthenticationResponseDto(
      user.id,
      tenantId.toString(),
      user.lenderId.toString(),
      user.displayName,
      user.email,
      user.isEmailVerified,
      //   user.role,
      token
    );
  }
}
