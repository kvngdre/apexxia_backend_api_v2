import { Lifecycle, inject, scoped } from "tsyringe";
import { LoginQuery } from "./login-query";
import { Result, ResultType } from "@shared-kernel/result";
import { AuthenticationResponseDto } from "../../shared/authentication-response-dto";
import { IRequestHandler } from "@infrastructure/mediator";
// import { LoginQueryValidator } from "./login-query-validator";
import { IJwtService } from "@application/abstractions/services";
import { IUserRepository } from "@domain/user/user-repository-interface";
import { Encryption } from "@shared-kernel/encryption";
import { AuthenticationExceptions } from "../../shared";

@scoped(Lifecycle.ResolutionScoped)
export class LoginQueryHandler implements IRequestHandler<LoginQuery, AuthenticationResponseDto> {
  constructor(
    // private readonly _loginQueryValidator: LoginQueryValidator,
    @inject("JwtService") private readonly _jwtService: IJwtService,
    @inject("UserRepository") private readonly _userRepository: IUserRepository
  ) {}

  public async handle(query: LoginQuery): Promise<ResultType<AuthenticationResponseDto>> {
    // const { isFailure, error, value } = this._loginQueryValidator.validate(query);

    // if (isFailure) {
    //   return Result.failure(error);
    // }

    const user = await this._userRepository.findByEmail(query.tenantId, query.email);

    if (user === null || !Encryption.compare(user.hashedPassword as string, query.password)) {
      return Result.failure(AuthenticationExceptions.InvalidCredentials);
    }

    if (user.isTemporaryPassword) {
      return Result.success("Password reset required", AuthenticationResponseDto.from(user));
    }

    const token = this._jwtService.generateToken({
      sub: user.id,
      id: user.id,
      tenantId: query.tenantId,
      lenderId: user.lenderId.toString()
    });

    // TODO: Raise login domain event

    return Result.success(
      "Login successful",
      AuthenticationResponseDto.from(user, undefined, token)
    );
  }
}
