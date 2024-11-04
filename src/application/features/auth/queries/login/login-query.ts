import { IRequest } from "@infrastructure/mediator";
import { ResultType } from "@shared-kernel/result";
import { AuthenticationResponseDto } from "../../shared/authentication-response-dto";
import { Tenant } from "@domain/tenant";

export class LoginQuery implements IRequest<ResultType<AuthenticationResponseDto>> {
  constructor(
    public readonly tenant: Tenant,
    public readonly email: string,
    public readonly password: string
  ) {}
}
