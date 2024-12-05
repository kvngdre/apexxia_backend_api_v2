import { inject, Lifecycle, scoped } from "tsyringe";
import { IRequestHandler } from "@infrastructure/mediator";
import { UpdateUserCommand } from "./update-user-command";
import { Result, ResultType } from "@shared-kernel/result";
import { IUserRepository, UserExceptions } from "@domain/user";
import { UpdateUserCommandValidator } from "./update-user-command-validator";

@scoped(Lifecycle.ResolutionScoped)
export class UpdateUserCommandHandler implements IRequestHandler<UpdateUserCommand> {
  constructor(
    @inject("UserRepository") private readonly _userRepository: IUserRepository,
    private readonly _validator: UpdateUserCommandValidator
  ) {}

  public async handle(command: UpdateUserCommand): Promise<ResultType<unknown>> {
    const { isFailure, exception, value } = this._validator.validate(command);
    if (isFailure) return Result.failure(exception);

    const user = await this._userRepository.findById(value.tenant._id, value.userId);
    if (!user) return Result.failure(UserExceptions.NotFound);

    await this._userRepository.update(user, value);

    return Result.success("User updated successfully");
  }
}
