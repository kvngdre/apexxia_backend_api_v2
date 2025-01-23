import { IRequest } from "@infrastructure/mediator";
import { ResultType } from "@shared-kernel/result";
import { AuthenticationResponseDto } from "../../shared/authentication-response-dto";

export class LoginQuery implements IRequest<ResultType<AuthenticationResponseDto>> {
  constructor(
    public readonly email: string,
    public readonly password: string
  ) {}
}
