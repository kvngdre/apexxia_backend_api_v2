import { User } from "@domain/user/user-entity";
import { Tenant } from "@domain/tenant";

export class AuthenticationResponseDto {
  private constructor(
    public readonly id: string,
    public readonly tenantId: string,
    public readonly lenderId: string,
    public readonly baseUrl: string,
    public readonly displayName: string,
    public readonly email: string,
    public readonly isEmailVerified: boolean,
    // public readonly role: string,
    public readonly token?: string
  ) {}

  public static from(user: User, tenant?: Tenant, token?: string) {
    return new AuthenticationResponseDto(
      user.id,
      tenant!._id!.toString(),
      user.lenderId.toString(),
      "http://".concat(tenant!.subdomain).concat(".localhost:4048/api/v1"),
      user.displayName,
      user.email,
      user.isEmailVerified,
      //   user.role,
      token
    );
  }
}
