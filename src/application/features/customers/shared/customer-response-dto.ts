import { ResponseDtoType } from "@application/shared/response-dto-type";
import { Customer } from "@domain/customer/customer-entity";
import { INextOfKin } from "@domain/customer/next-of-kin-interface";

export class CustomerResponseDto {
  constructor(
    public readonly lenderId: string,
    public readonly customerId: string,
    public readonly passportPicture: string | null,
    public readonly firstName: string,
    public readonly middleName: string | null,
    public readonly lastName: string,
    public readonly fullName: string,
    public readonly gender: string,
    public readonly dateOfBirth: Date,
    public readonly residentialAddressId: string,
    // public readonly residentialAddress: Address,
    public readonly phone: string,
    public readonly email: string | null,
    public readonly maritalStatus: string,
    public readonly bvn: number,
    public readonly idType: string,
    public readonly idNumber: string,
    public readonly idExpiration: Date,
    public readonly nextOfKin: INextOfKin,
    public readonly accountName: string,
    public readonly accountNumber: string,
    public readonly bank: string,
    public readonly createdAt: Date,
    public readonly updateAt: Date
  ) {}

  public static from<T extends Customer | null>(
    customer?: T
  ): ResponseDtoType<T, CustomerResponseDto> {
    return (
      !customer
        ? null
        : new CustomerResponseDto(
            customer.lenderId.toString(),
            customer._id.toString(),
            customer.passportPicture,
            customer.firstName,
            customer.middleName,
            customer.lastName,
            customer.fullName,
            customer.gender,
            customer.dateOfBirth,
            customer.residentialAddressId.toString(),
            // customer.residentialAddress,
            customer.phone,
            customer.email,
            customer.maritalStatus,
            customer.bvn,
            customer.idType,
            customer.idNumber,
            customer.idExpiration,
            customer.nextOfKin,
            customer.accountName,
            customer.accountNumber,
            customer.bank,
            customer.createdAt,
            customer.updatedAt
          )
    ) as ResponseDtoType<T, CustomerResponseDto>;
  }

  public static fromMany(customers: Customer[]) {
    return customers.map((s) => CustomerResponseDto.from(s));
  }
}
