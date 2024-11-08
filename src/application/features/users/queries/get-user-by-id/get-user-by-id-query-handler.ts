import { inject, Lifecycle, scoped } from "tsyringe";
import { IRequestHandler } from "@infrastructure/mediator";
import { GetUserByIdQuery } from "./get-user-by-id-query";
import { Result, ResultType } from "@shared-kernel/result";
import { IUserRepository, UserExceptions } from "@domain/user";
import { UserResponseDto } from "../../shared";

@scoped(Lifecycle.ResolutionScoped)
export class GetUserByIdQueryHandler implements IRequestHandler<GetUserByIdQuery, UserResponseDto> {
  constructor(@inject("UserRepository") private readonly _userRepository: IUserRepository) {}

  public async handle(query: GetUserByIdQuery): Promise<ResultType<UserResponseDto>> {
    const user = await this._userRepository.findById(query.tenant.id, query.userId);
    if (!user) return Result.failure(UserExceptions.NotFound);

    return Result.success("User retrieved", UserResponseDto.from(user));
  }
}
