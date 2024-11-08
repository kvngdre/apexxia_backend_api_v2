import { inject, Lifecycle, scoped } from "tsyringe";
import { IRequestHandler } from "@infrastructure/mediator";
import { UserResponseDto } from "../../shared";
import { Result, ResultType } from "@shared-kernel/result";
import { CreateUserCommand } from "./create-user-command";
import { IUserRepository, User } from "@domain/user";
import { CreateUserCommandValidator } from "./create-user-command-validator";
import { Encryption, Utils } from "@shared-kernel/index";

@scoped(Lifecycle.ResolutionScoped)
export class CreateUserCommandHandler
  implements IRequestHandler<CreateUserCommand, UserResponseDto>
{
  constructor(
    @inject("UserRepository") private readonly _userRepository: IUserRepository,
    private readonly _validator: CreateUserCommandValidator
  ) {}

  public async handle(command: CreateUserCommand): Promise<ResultType<UserResponseDto>> {
    const { isFailure, exception, value } = this._validator.validate(command);
    if (isFailure) return Result.failure(exception);

    const temporaryPassword = Utils.generateRandomPassword(8);
    const user = new User(
      value.lenderId,
      value.firstName,
      value.lastName,
      value.email,
      Encryption.encryptText(temporaryPassword)
    );
    user.jobTitle = value.jobTitle || null;

    await this._userRepository.insert(value.tenant.id, user);

    // send verification email or raise event
    console.log("Your temporary password is: " + temporaryPassword);

    // TODO: raise signup domain event...

    return Result.success(
      "User created. Temporary password sent to user's email",
      UserResponseDto.from(user)
    );
  }
}
