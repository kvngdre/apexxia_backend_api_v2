import { Lifecycle, scoped } from "tsyringe";
import { IRequestHandler } from "@infrastructure/mediator";
import { GetAuthenticatedUserQuery } from "./get-authenticated-user-query";
import { UserResponseDto } from "../../shared";
import { Result, ResultType } from "@shared-kernel/result";

@scoped(Lifecycle.ResolutionScoped)
export class GetAuthenticatedUserQueryHandler
  implements IRequestHandler<GetAuthenticatedUserQuery, UserResponseDto>
{
  public async handle(query: GetAuthenticatedUserQuery): Promise<ResultType<UserResponseDto>> {
    return Result.success("Authenticated user retrieved", UserResponseDto.from(query.user));
  }
}
