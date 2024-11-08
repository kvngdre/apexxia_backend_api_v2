import { User } from "@domain/user/user-entity";
import { Tenant } from "@domain/tenant";

export class AuthenticationResponseDto {
  private constructor(
    public readonly tenantId: string,
    public readonly subdomain: string,
    public readonly lenderId: string,
    public readonly userId: string,
    public readonly displayName: string,
    public readonly email: string,
    // public readonly role: string,
    public readonly status: string,
    public readonly accessToken?: string
  ) {}

  public static from(user: User, tenant: Tenant, token?: string) {
    return new AuthenticationResponseDto(
      tenant._id!.toString(),
      tenant!.subdomain.concat(".localhost:4048/api/v1"),
      user.lenderId.toString(),
      user._id.toString(),
      user.displayName,
      user.email,
      //   user.role,
      user.status,
      token
    );
  }
}
