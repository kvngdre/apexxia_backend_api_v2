import { IRequest } from "@infrastructure/mediator";
import { ResultType } from "@shared-kernel/result";
import { AuthenticationResponseDto } from "../../shared/authentication-response-dto";

export class SignupCommand implements IRequest<ResultType<AuthenticationResponseDto>> {
  constructor(
    public readonly lenderName: string,
    public readonly firstName: string,
    public readonly lastName: string,
    public readonly email: string
  ) {}
}
