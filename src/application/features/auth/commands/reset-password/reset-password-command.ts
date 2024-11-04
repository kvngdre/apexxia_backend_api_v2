import { Tenant } from "@domain/tenant";
import { IRequest } from "@infrastructure/mediator";

export class ResetPasswordCommand implements IRequest {
  constructor(
    public readonly tenant: Tenant,
    public readonly email: string,
    public readonly tempPassword: string,
    public readonly newPassword: string,
    public readonly confirmNewPassword: string
  ) {}
}
