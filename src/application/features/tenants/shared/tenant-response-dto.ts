import { ResponseDtoType } from "@application/shared/response-dto-type";
import { Tenant } from "@domain/tenant";

export class TenantResponseDto {
  constructor(
    public readonly tenantId: string,
    public readonly name: string,
    public readonly email: string,
    public readonly subdomain: string,
    public readonly signupDateTime: Date
  ) {}

  public static from<T extends Tenant | null>(tenant?: T): ResponseDtoType<T, TenantResponseDto> {
    return (
      !tenant
        ? null
        : new TenantResponseDto(
            tenant._id.toString(),
            tenant.name,
            tenant.email,
            tenant.subdomain,
            tenant.signupDateTime
          )
    ) as ResponseDtoType<T, TenantResponseDto>;
  }

  public static fromMany(tenants: Tenant[]) {
    return tenants.map((s) => TenantResponseDto.from(s));
  }
}
