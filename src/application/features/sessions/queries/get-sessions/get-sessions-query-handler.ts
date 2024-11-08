import { inject, Lifecycle, scoped } from "tsyringe";
import { IRequestHandler } from "@infrastructure/mediator";
import { GetSessionsQuery } from "./get-sessions-query";
import { SessionResponseDto } from "../../shared/session-response-dto";
import { Result, ResultType } from "@shared-kernel/result";
import { ISessionRepository } from "@domain/session";

@scoped(Lifecycle.ResolutionScoped)
export class GetSessionsQueryHandler
  implements IRequestHandler<GetSessionsQuery, SessionResponseDto[]>
{
  constructor(
    @inject("SessionRepository") private readonly _sessionRepository: ISessionRepository
  ) {}

  public async handle(query: GetSessionsQuery): Promise<ResultType<SessionResponseDto[]>> {
    const sessions = await this._sessionRepository.find(query.tenant._id);

    return Result.success("User sessions retrieved", SessionResponseDto.fromMany(sessions));
  }
}
