import { IRequest } from "@infrastructure/mediator";
import { CustomerResponseDto } from "../../shared/customer-response-dto";
import { Tenant } from "@domain/tenant";
import { Address } from "@domain/address";
import { Gender, IdType, INextOfKin, MaritalStatus } from "@domain/customer";

export class CreateCustomerCommand implements IRequest<CustomerResponseDto> {
  constructor(
    public readonly tenant: Tenant,
    public readonly lenderId: string,
    public readonly firstName: string,
    public readonly middleName: string | null,
    public readonly lastName: string,
    public readonly gender: Gender,
    public readonly dateOfBirth: Date,
    public readonly residentialAddress: Address,
    public readonly phone: string,
    public readonly email: string,
    public readonly maritalStatus: MaritalStatus,
    public readonly bvn: number,
    public readonly idType: IdType,
    public readonly idNumber: string,
    public readonly idExpiration: Date,
    public readonly nextOfKin: INextOfKin,
    public readonly accountName: string,
    public readonly accountNumber: string,
    public readonly bank: string
  ) {}
}
