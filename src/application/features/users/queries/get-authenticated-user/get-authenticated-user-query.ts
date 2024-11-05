import { IRequest } from "@infrastructure/mediator";
import { UserResponseDto } from "../../shared";
import { Tenant } from "@domain/tenant";
import { User } from "@domain/user";

export class GetAuthenticatedUserQuery implements IRequest<UserResponseDto> {
  constructor(
    public readonly tenant: Tenant,
    public readonly user: User
  ) {}
}
