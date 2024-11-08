import { IRequest } from "@infrastructure/mediator";
import { UserResponseDto } from "../../shared";
import { Tenant } from "@domain/tenant";

export class GetUserByIdQuery implements IRequest<UserResponseDto> {
  constructor(
    public readonly tenant: Tenant,
    public readonly userId: string
  ) {}
}
