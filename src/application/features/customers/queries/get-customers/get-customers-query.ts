import { IRequest } from "@infrastructure/mediator";
import { CustomerResponseDto } from "../../shared/customer-response-dto";
import { Tenant } from "@domain/tenant";

export class GetCustomersQuery implements IRequest<CustomerResponseDto[]> {
  constructor(public readonly tenant: Tenant) {}
}
