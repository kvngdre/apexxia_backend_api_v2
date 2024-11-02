import { Lifecycle, inject, scoped } from "tsyringe";
import { LoginQuery } from "./login-query";
import { Result, ResultType } from "@shared-kernel/result";
import { AuthenticationResponseDto } from "../../shared/authentication-response-dto";
import { IRequestHandler } from "@infrastructure/mediator";
import { IJwtService } from "@application/abstractions/services";
import { IUserRepository } from "@domain/user/user-repository-interface";
import { Encryption } from "@shared-kernel/encryption";
import { AuthenticationExceptions } from "../../shared";
import { LoginQueryValidator } from "./login-query-validator";
import { UserExceptions } from "@domain/user";

@scoped(Lifecycle.ResolutionScoped)
export class LoginQueryHandler implements IRequestHandler<LoginQuery, AuthenticationResponseDto> {
  constructor(
    private readonly _validator: LoginQueryValidator,
    @inject("JwtService") private readonly _jwtService: IJwtService,
    @inject("UserRepository") private readonly _userRepository: IUserRepository
  ) {}

  public async handle(query: LoginQuery): Promise<ResultType<AuthenticationResponseDto>> {
    const { isFailure, exception, value } = this._validator.validate(query);

    if (isFailure) {
      return Result.failure(exception);
    }

    const user = await this._userRepository.findByEmail(value.tenantId, value.email);

    if (user === null || !Encryption.compare(user.hashedPassword as string, value.password)) {
      return Result.failure(AuthenticationExceptions.InvalidCredentials);
    }

    if (user.isTemporaryPassword) {
      return Result.failure(UserExceptions.TemporaryPassword);
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
