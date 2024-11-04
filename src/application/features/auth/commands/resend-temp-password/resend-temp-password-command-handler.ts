import { inject, Lifecycle, scoped } from "tsyringe";
import { IRequestHandler } from "@infrastructure/mediator/request-handler-interface";
import { ResendTempPasswordCommand } from "./resend-temp-password-command";
import { Encryption, Result, ResultType } from "@shared-kernel/index";
import { IUserRepository, UserExceptions } from "@domain/user";
import { Utils } from "../../../../../shared-kernel/utils";
import { ResendTempPasswordCommandValidator } from "./resend-temp-password-command-validator";

@scoped(Lifecycle.ResolutionScoped)
export class ResendTempPasswordCommandHandler
  implements IRequestHandler<ResendTempPasswordCommand>
{
  constructor(
    @inject("UserRepository") private readonly _userRepository: IUserRepository,
    private readonly _validator: ResendTempPasswordCommandValidator
  ) {}

  public async handle(command: ResendTempPasswordCommand): Promise<ResultType<never>> {
    const { isFailure, exception, value } = this._validator.validate(command);
    if (isFailure) {
      return Result.failure(exception);
    }

    const user = await this._userRepository.findByEmail(value.tenant.id, value.email);
    if (!user) {
      return Result.failure(UserExceptions.NotFound);
    }

    const temporaryPassword = Utils.generateRandomPassword(8);
    user.hashedPassword = Encryption.encryptText(temporaryPassword);
    user.isTemporaryPassword = true;

    await this._userRepository.update(user);

    // Send temp password to email...
    console.log({ temporaryPassword });

    return Result.success("Temporary password sent to email.");
  }
}
