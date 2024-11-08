import { ResponseDtoType } from "@application/shared/response-dto-type";
import { Address } from "@domain/address";
import { Lender } from "@domain/lender";

export class LenderResponseDto {
  constructor(
    public readonly tenantId: string,
    public readonly lenderId: string,
    public readonly logo: string | null,
    public readonly name: string,
    public readonly cacNumber: string | null,
    public readonly status: string,
    public readonly addressId: string | null,
    public readonly address?: Address
  ) {}

  public static from<T extends Lender | null>(lender?: T): ResponseDtoType<T, LenderResponseDto> {
    return (
      !lender
        ? null
        : new LenderResponseDto(
            lender.tenantId.toString(),
            lender._id.toString(),
            lender.logo,
            lender.name,
            lender.cacNumber,
            lender.status,
            lender.addressId?.toString() ?? null,
            lender.address!
          )
    ) as ResponseDtoType<T, LenderResponseDto>;
  }

  public static fromMany(lenders: Lender[]) {
    return lenders.map((l) => LenderResponseDto.from(l));
  }
}
