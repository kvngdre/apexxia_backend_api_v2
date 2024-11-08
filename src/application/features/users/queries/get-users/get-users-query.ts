import { IRequest } from "@infrastructure/mediator";
import { UserResponseDto } from "../../shared";
import { Tenant } from "@domain/tenant";

export class GetUsersQuery implements IRequest<UserResponseDto[]> {
  constructor(public readonly tenant: Tenant) {}
}
