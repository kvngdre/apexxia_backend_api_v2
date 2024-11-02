import { inject, Lifecycle, scoped } from "tsyringe";
import { IRequestHandler } from "@infrastructure/mediator/request-handler-interface";
import { ResendTempPasswordCommand } from "./resend-temp-password-command";
import { Encryption, Result, ResultType } from "@shared-kernel/index";
import { IUserRepository, UserExceptions } from "@domain/user";
import { AuthUtils } from "../../shared/auth-utils";

@scoped(Lifecycle.ResolutionScoped)
export class ResendTempPasswordCommandHandler
  implements IRequestHandler<ResendTempPasswordCommand>
{
  constructor(@inject("UserRepository") private readonly _userRepository: IUserRepository) {}

  public async handle(command: ResendTempPasswordCommand): Promise<ResultType<never>> {
    const user = await this._userRepository.findByEmail(command.tenantId, command.email);
    if (!user) {
      return Result.failure(UserExceptions.NotFound);
    }

    const temporaryPassword = AuthUtils.generateRandomPassword(8);
    user.hashedPassword = Encryption.encryptText(temporaryPassword);

    await this._userRepository.update(user);

    // Send temp password to email...
    console.log({ temporaryPassword });

    return Result.success("Temporary password sent to email.");
  }
}
