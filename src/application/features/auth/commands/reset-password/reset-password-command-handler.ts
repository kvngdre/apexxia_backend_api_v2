import { Lifecycle, inject, scoped } from "tsyringe";
import { Result, ResultType } from "@shared-kernel/result";
import { IRequestHandler } from "@infrastructure/mediator";
import { IUserRepository } from "@domain/user/user-repository-interface";
import { Encryption } from "@shared-kernel/encryption";
import { AuthenticationExceptions } from "../../shared";
import { ResetPasswordCommandValidator } from "./reset-password-command-validator";
import { ResetPasswordCommand } from "./reset-password-command";

@scoped(Lifecycle.ResolutionScoped)
export class ResetPasswordCommandHandler implements IRequestHandler<ResetPasswordCommand> {
  constructor(
    private readonly _validator: ResetPasswordCommandValidator,
    @inject("UserRepository") private readonly _userRepository: IUserRepository
  ) {}

  public async handle(command: ResetPasswordCommand): Promise<ResultType> {
    // validating command...
    const { isFailure, exception, value } = this._validator.validate(command);
    if (isFailure) return Result.failure(exception);

    const user = await this._userRepository.findByEmail(value.tenant._id, value.email);
    if (!user || !Encryption.compare(user.hashedPassword as string, value.tempPassword)) {
      return Result.failure(AuthenticationExceptions.InvalidCredentials);
    }

    user.hashedPassword = Encryption.encryptText(value.newPassword);
    user.isTemporaryPassword = false;

    await this._userRepository.update(user);

    // TODO: Raise password reset domain event...

    return Result.success("Password reset successfully.");
  }
}
