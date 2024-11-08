import { IRequest } from "@infrastructure/mediator";
import { UserResponseDto } from "../../shared";
import { Tenant } from "@domain/tenant";

export class CreateUserCommand implements IRequest<UserResponseDto> {
  constructor(
    public readonly tenant: Tenant,
    public readonly lenderId: string,
    public readonly firstName: string,
    public readonly lastName: string,
    public readonly email: string,
    public readonly jobTitle?: string
  ) {}
}
