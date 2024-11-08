import { inject, Lifecycle, scoped } from "tsyringe";
import { IRequestHandler } from "@infrastructure/mediator";
import { GetUsersQuery } from "./get-users-query";
import { Result, ResultType } from "@shared-kernel/result";
import { IUserRepository } from "@domain/user";
import { UserResponseDto } from "../../shared";

@scoped(Lifecycle.ResolutionScoped)
export class GetUsersQueryHandler implements IRequestHandler<GetUsersQuery, UserResponseDto[]> {
  constructor(@inject("UserRepository") private readonly _userRepository: IUserRepository) {}

  public async handle(query: GetUsersQuery): Promise<ResultType<UserResponseDto[]>> {
    const users = await this._userRepository.find(query.tenant.id);

    return Result.success("Users retrieved", UserResponseDto.fromMany(users));
  }
}
