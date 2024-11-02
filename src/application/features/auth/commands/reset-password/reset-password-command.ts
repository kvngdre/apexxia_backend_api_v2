import { IRequest } from "@infrastructure/mediator";

export class ResetPasswordCommand implements IRequest {
  constructor(
    public readonly tenantId: string,
    public readonly email: string,
    public readonly tempPassword: string,
    public readonly newPassword: string,
    public readonly confirmNewPassword: string
  ) {}
}
