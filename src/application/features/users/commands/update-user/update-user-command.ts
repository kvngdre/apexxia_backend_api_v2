import { Tenant } from "@domain/tenant";
import { User } from "@domain/user";
import { IRequest } from "@infrastructure/mediator";

export class UpdateUserCommand implements IRequest {
  constructor(
    public readonly tenant: Tenant,
    public readonly user: User,
    public readonly userId: string,
    public readonly firstName?: string,
    public readonly middleName?: string | null,
    public readonly lastName?: string,
    public readonly jobTitle?: string
  ) {}
}
